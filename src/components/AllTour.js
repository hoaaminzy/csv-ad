import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { Table } from "antd";
import HeadingPage from "./HeadingPage";
import { Button, Modal, message, Popconfirm } from "antd";
import AddTour from "./AddTour";
import { DeleteOutlined } from "@ant-design/icons";
const AllTour = () => {
  const [allTours, setAllTours] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [itemsDetail, setItemsDetail] = useState({});

  const handleButtonClick = (record) => {
    setIsModalVisible(true);
    setItemsDetail(record);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedTourData, setSelectedTourData] = useState(null);
  const handleUpdateClick = (tourData) => {
    setSelectedTourData(tourData);
    setIsUpdateModalVisible(true);
  };
  useEffect(() => {
    const getAllTours = async () => {
      try {
        const response = await axios.get(`${baseUrl}tour/get-all-tours`);
        const tours = response?.data?.tours;
        setAllTours(tours);
        console.log("Tours fetched successfully:", tours);
        return tours;
      } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }
    };
    getAllTours();
  }, []);

  const handleDeleteClick = async (record) => {
    try {
      const response = await axios.delete(
        `${baseUrl}tour/delete-tour/${record?._id}`
      );
      if (response.status === 200) {
        message.success("Tour đã được hủy");
      }
      setAllTours((prevTours) =>
        prevTours.filter((tour) => tour._id !== record._id)
      );
    } catch (error) {
      console.error("Lỗi khi hủy tour:", error);
      message.error(
        error.response
          ? error.response.data.message
          : "Có lỗi xảy ra khi hủy tour."
      );
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1, // Displays the row number
    },
    {
      title: "Mã tour",
      dataIndex: "_id",
      key: "id",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Tên",
      dataIndex: "title",
      key: "name",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
      render: (_, record) => (
        <img
          className=""
          style={{
            width: "200px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
          src={record?.images[0]}
          alt=""
        />
      ),
    },
    {
      title: "Xuất phát",
      dataIndex: "city",
      key: "city",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Kết thúc",
      dataIndex: "endCity",
      key: "endCity",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
    },
    {
      title: "Loại dịch vụ",
      dataIndex: "typeCombo",
      key: "typeCombo",
      width: "100%",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
      align: "center",
    },
    {
      title: "Phương tiện",
      dataIndex: "vehicle",
      key: "vehicle",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
    },

    {
      title: "Combo",
      dataIndex: "combo",
      key: "combo",
      width: "100%",
      align: "center",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
      render: (_, record) => (
        <span>{record?.combo === true ? "Có" : "Không"}</span>
      ),
    },

    {
      title: "Xem chi tiết",
      dataIndex: "Xem chi tiết",
      key: "Xem chi tiết",
      width: "100%",
      onCell: () => ({
        style: {
          whiteSpace: "nowrap",
        },
      }),
      render: (_, record) => (
        <Button
          onClick={() => handleButtonClick(record)}
          type="primary"
          style={{ width: "100%" }}
        >
          Xem chi tiết
        </Button>
      ),
    },
    {
      title: "Chỉnh sửa",
      key: "update",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleUpdateClick(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
    {
      title: "Xóa",
      key: "delele",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa tour này không?"
          onConfirm={() => handleDeleteClick(record)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
    },
  ];
  return (
    <div className="ql-hd w-full">
      <div className="w-full hd-tour flex flex-col ">
        <HeadingPage title="Tất cả các tour" />
        <div className="overflow-x-auto w-full">
          <Table
            columns={columns}
            pagination={{ pageSize: 6 }}
            dataSource={allTours.reverse()}
          />
          <Modal
            title="Thông tin chi tiết"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            centered
          >
            <div>
              {itemsDetail?.inforTourDetail?.map((item, index) => (
                <div key={item._id}>
                  <strong>Thông tin {index + 1}</strong>
                  <div
                    className=""
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2,1fr)",
                    }}
                  >
                    <ul>
                      <strong> Giá của từng lứa tuổi</strong>
                      <li>Người lớn: {item.price.price}</li>
                      <li>Em bé: {item.price.priceBaby}</li>
                      <li>Trẻ em: {item.price.priceChildren}</li>
                    </ul>

                    <ul>
                      <strong>Thời gian chuyến đi</strong>
                      <li>Ngày bắt đầu: {item.time.startDate}</li>
                      <li>Ngày kết thúc: {item.time.endDate}</li>
                    </ul>

                    <ul>
                      <strong>Thời gian bay đi</strong>
                      <li>Bắt đầu lúc: {item.fightTime.startTime}</li>
                      <li>Kết thúc lúc:{item.fightTime.endTime}</li>
                    </ul>
                    <ul>
                      <strong>Thời gian bay về</strong>
                      <li>Bắt đầu lúc: {item.fightBackTime.startBackTime}</li>
                      <li>Kết thúc lúc:{item.fightBackTime.endBackTime}</li>
                    </ul>
                  </div>
                  <ul>
                    <strong>Tổng số lượng: {item.slot}</strong>
                  </ul>

                  <hr />
                </div>
              ))}
            </div>
          </Modal>

          <Modal
            title="Update Tour"
            visible={isUpdateModalVisible}
            onCancel={() => setIsUpdateModalVisible(false)}
            footer={null}
            centered
          >
            <AddTour
              updateMode={true}
              tourData={selectedTourData}
              closeModal={() => setIsUpdateModalVisible(false)}
            />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AllTour;
