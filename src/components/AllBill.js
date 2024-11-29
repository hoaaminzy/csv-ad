import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import "dayjs/locale/en-gb";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";

import {
  Button,
  Table,
  Modal,
  message,
  Dropdown,
  Menu,
  Popconfirm,
  Space,
} from "antd";
import { CaretDownOutlined } from "@ant-design/icons";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaPlane } from "react-icons/fa6";
import HeadingPage from "./HeadingPage";
const AllBill = () => {
  const [allTours, setAllTours] = useState([]);
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

  const calculateDaysAndNights = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));
    const nights = days - 1; // Nights are usually one less than the number of days

    return `${days}N${nights}Đ`;
  };
  const [allBookings, setAllBookings] = useState([]);
  const formatDate = (dateString) => {
    return dayjs(dateString).format("DD-MM-YYYY");
  };
  const getAllBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}booking/get-all-bookings`);
      const bookings = response?.data?.bookings;
      setAllBookings(bookings);
    } catch (error) {
      throw error;
    }
  };
  useEffect(() => {
    getAllBookings();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const handleViewDetail = (tour) => {
    setSelectedTour(tour);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTour(null);
  };
  const filterTourDetail = allTours.find(
    (item) => item._id === selectedTour?.tourId
  );
  const updatedDataAllBooking = allBookings.map((booking) => {
    const matchingTour = allTours.find((tour) => tour._id === booking.tourId);

    if (matchingTour) {
      // Kiểm tra nếu tourInfor chưa chứa matchingTour thì mới thêm vào
      const isTourAlreadyAdded = booking.tourInfor.some(
        (tour) => tour._id === matchingTour._id
      );

      if (!isTourAlreadyAdded) {
        booking.tourInfor.push(matchingTour);
      }
    }

    return booking;
  });

  const handleCancelTour = async (record) => {
    try {
      const response = await axios.delete(
        `${baseUrl}booking/cancel-tour/${record?._id}`
      );
      if (response.status === 200) {
        message.success("Tour đã được hủy");

        setAllBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== record._id)
        );
      }
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
      title: "Tên",
      dataIndex: "fullName",
      key: "name",
      width: "100%",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: "100%",
      align: "center",
      sorter: (a, b) => a?.address.length - b?.address.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone", // Lấy số điện thoại từ đối tượng user
      key: "numberphone",
      width: "100%",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "100%",
      align: "center",
    },
    {
      title: "Hình thức thanh toán",
      dataIndex: "selectedPayment",
      key: "orderId",
      width: "100%",
      align: "center",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "bookingId",
      key: "orderId",
      width: "100%",
      align: "center",
    },
    {
      title: "Mã tour",
      dataIndex: "tourId",
      key: "tourId",
      width: "100%",
      align: "center",
    },
    {
      title: "Tổng giá",
      dataIndex: "totalPrice", // Tổng giá
      key: "totalPrice",
      width: "100%",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "100%",
      align: "center",
      filters: [
        {
          text: "Chờ xác nhận",
          value: "Chờ xác nhận",
        },
        {
          text: "Xác nhận đơn đặt",
          value: "Xác nhận đơn đặt",
        },
      ],
      onFilter: (value, record) => record.status.includes(value),
      render: (text, record) => {
        const handleStatusChange = async (newStatus) => {
          try {
            // Gọi API để cập nhật trạng thái trong database
            await axios.put(`${baseUrl}booking/update-status`, {
              bookingId: record.bookingId,
              status: newStatus,
            });

            // Hiển thị thông báo thành công
            message.success("Cập nhật trạng thái thành công!");

            // Cập nhật lại danh sách bookings
            getAllBookings();
          } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            message.error("Cập nhật trạng thái thất bại.");
          }
        };

        const menu = (
          <Menu
            onClick={({ key }) => handleStatusChange(key)}
            items={[
              {
                label: "Chờ xác nhận",
                key: "Chờ xác nhận",
              },
              {
                label: "Xác nhận đơn đặt",
                key: "Xác nhận đơn đặt",
              },
              {
                label: "Thanh toán thành công",
                key: "Thanh toán thành công",
              },
              {
                label: "Đã hoàn thành tour",
                key: "Đã hoàn thành tour",
              },
            ]}
          />
        );

        let color;
        if (text === "Chờ xác nhận") {
          color = "red";
        } else if (text === "Xác nhận đơn đặt") {
          color = "orange";
        } else if (text === "Thanh toán thành công") {
          color = "green";
        } else if (text === "Đã hoàn thành tour") {
          color = "blue";
        } else {
          color = "black";
        }

        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <span style={{ color, cursor: "pointer" }}>
              {text} <CaretDownOutlined />
            </span>
          </Dropdown>
        );
      },
    },

    {
      title: "Ngày tạo",
      dataIndex: "createdAt", // Ngày tạo
      key: "createdAt",
      width: "100%",
      align: "center",

      render: (text) => formatDate(text),
    },

    {
      title: "Xem chi tiết",
      dataIndex: "Xem chi tiết",
      key: "Xem chi tiết",
      width: "100%",
      render: (_, record) => (
        <Button onClick={() => handleViewDetail(record)}>Xem chi tiết</Button>
      ),
    },
    {
      title: "Hủy tour", // Title for the cancel button column
      key: "cancelTour",
      width: "100%",
      align: "center",
      render: (_, record) => (
        <>
          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tour này không?"
              onConfirm={() => handleCancelTour(record)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Hủy tour
              </Button>
            </Popconfirm>
          </Space>
        </>
      ),
    },
  ];
  const calculateTotal = () => {
    return (
      selectedTour?.passengers.slotBaby +
      selectedTour?.passengers.slotChildren +
      selectedTour?.passengers.slotAdult
    );
  };
  return (
    <div className="ql-hd">
      <div className="w-full hd-tour flex flex-col gap-5">
        <HeadingPage title="Hóa đơn đặt tour" />
        <div className="overflow-x-scroll w-full">
          <Table
            columns={columns}
            pagination={{ pageSize: 6 }}
            dataSource={updatedDataAllBooking.reverse()}
          />

          <Modal
            title="Chi Tiết Hóa Đơn"
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            centered
          >
            {selectedTour && (
              <div className="flex flex-col w-full">
                <div className="w-full">
                  <div className="w-full">
                    <div className="w-full">
                      <div className="d-flex w-full gap-3">
                        <img
                          style={{ width: "40%", borderRadius: "10px" }}
                          src={selectedTour?.tourInfor[0]?.images[0]}
                          alt=""
                          className=""
                        />
                        <div style={{ width: "50%" }}>
                          <strong className="clamped-text-bookingtour">
                            {selectedTour?.tourInfor[0]?.title}
                          </strong>
                          <p>Mã tour: {selectedTour?.tourId}</p>
                        </div>
                      </div>
                      <hr />
                      <div className="flex gap-5">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt /> Khởi hành:{" "}
                          <span className="text-[#276ca1]">
                            {selectedTour?.tourInfor[0]?.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt /> Thời gian:{" "}
                          <span className="text-[#276ca1]">
                            {calculateDaysAndNights(
                              selectedTour?.tourDetail[0]?.time.startDate,
                              selectedTour?.tourDetail[0]?.time.endDate
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <FaPlane />
                          <strong className="uppercase">
                            Thông tin chuyến bay
                          </strong>
                        </div>
                        <div>
                          <div
                            className="d-grid  gap-5"
                            style={{ gridTemplateColumns: "repeat(2,1fr)" }}
                          >
                            <div className="flex flex-col gap-2">
                              <div>
                                <span>
                                  <strong>Ngày đi</strong> -{" "}
                                  {selectedTour?.tourDetail[0]?.time.startDate}
                                </span>
                              </div>
                              <div>
                                <div
                                  className="d-flex gap-2"
                                  style={{ flexDirection: "column" }}
                                >
                                  <div className="d-flex justify-content-between">
                                    <span>
                                      {
                                        selectedTour?.tourDetail[0]?.fightTime
                                          ?.startTime
                                      }
                                    </span>
                                    <span>
                                      {
                                        selectedTour?.tourDetail[0]?.fightTime
                                          ?.endTime
                                      }
                                    </span>
                                  </div>
                                  <div
                                    className=" "
                                    style={{
                                      width: "100%",
                                      height: "5px",
                                      background: "#ccc",
                                    }}
                                  ></div>
                                  <div className="d-flex justify-content-between">
                                    <span>
                                      {selectedTour?.tourInfor[0]?.city}
                                    </span>
                                    <span>
                                      {selectedTour?.tourInfor[0]?.endCity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <div>
                                <span>
                                  <strong>Ngày về</strong> -{" "}
                                  {selectedTour?.tourDetail[0]?.time?.endDate}
                                </span>
                              </div>
                              <div className="">
                                <div
                                  className="d-flex gap-2"
                                  style={{ flexDirection: "column" }}
                                >
                                  <div className="d-flex justify-content-between">
                                    <span>
                                      {
                                        selectedTour?.tourDetail[0]
                                          ?.fightBackTime?.startBackTime
                                      }
                                    </span>
                                    <span>
                                      {
                                        selectedTour?.tourDetail[0]
                                          ?.fightBackTime?.endBackTime
                                      }
                                    </span>
                                  </div>
                                  <div
                                    className=" "
                                    style={{
                                      width: "100%",
                                      height: "5px",
                                      background: "#ccc",
                                    }}
                                  ></div>
                                  <div className="d-flex justify-content-between flex-row-reverse">
                                    <span>
                                      {selectedTour?.tourInfor[0]?.city}
                                    </span>
                                    <span>
                                      {selectedTour?.tourInfor[0]?.endCity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr />
                <div className="d-flex" style={{ flexDirection: "column" }}>
                  <strong>Thông tin hành khách</strong>

                  <div className="d-flex justify-content-between">
                    <span>Em bé: {selectedTour?.passengers.slotBaby}</span>
                    <span>Trẻ em: {selectedTour?.passengers.slotChildren}</span>
                    <span>Người lớn: {selectedTour?.passengers.slotAdult}</span>
                  </div>
                  <span>Tổng số hành khách: {calculateTotal()}</span>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default AllBill;
