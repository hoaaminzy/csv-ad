import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { Table, Space, Popconfirm, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const AllContact = () => {
  const [allContacts, setAllContacts] = useState([]);

  const getAllContact = async () => {
    try {
      const res = await axios.get(`${baseUrl}contacts/get-all-contact`);
      setAllContacts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContact();
  }, []);

  const handleDeleteTour = async (record) => {
    try {
      const response = await axios.delete(
        `${baseUrl}contacts/delete-contact/${record?._id}`
      );
      if (response.status === 200) {
        message.success("Liên hệ đã được hủy");

        setAllContacts((prevContact) =>
          prevContact.filter((contact) => contact._id !== record._id)
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

  const handleUpdateContact = async (record) => {
    try {
      const response = await axios.put(
        `${baseUrl}contacts/update-contact/${record?._id}`,
        { contacted: !record.contacted } // Đổi trạng thái contacted
      );

      if (response.status === 200) {
        message.success("Liên hệ đã được cập nhật");

        // Cập nhật danh sách liên hệ trong state
        setAllContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact._id === record._id
              ? { ...contact, contacted: !contact.contacted } // Đổi trạng thái ngay trong state
              : contact
          )
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật liên hệ:", error);

      // Hiển thị thông báo lỗi
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật liên hệ."
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
      title: "Loại thông tin",
      dataIndex: "infoType",
      key: "infoType",
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Tên công ty",
      dataIndex: "companyName",
      key: "companyName",
    },
    {
      title: "Số khách",
      dataIndex: "numberOfGuests",
      key: "numberOfGuests",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Tùy chọn",
      dataIndex: "delete",
      key: "delete",
      render: (_, record) => (
        <div className="flex gap-3">
          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tour này không?"
              onConfirm={() => handleDeleteTour(record)}
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Hủy liên hệ
              </Button>
            </Popconfirm>
          </Space>
          <Button type="primary" onClick={() => handleUpdateContact(record)}>
            {record.contacted === false ? "Liên hệ" : "Đã liên hệ"}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <Table
        dataSource={allContacts}
        columns={columns}
        rowKey={(record) => record._id} // Unique identifier for each row
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AllContact;
