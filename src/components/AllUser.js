import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import HeadingPage from "./HeadingPage";
import {
  Table,
  Button,
  Modal,
  Input,
  Form,
  message,
  Popconfirm,
  Space,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const AllUser = () => {
  const [allUser, setAllUser] = useState([]);
  const [allUserFirebase, setAllUserFirebase] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const isValidPhoneNumber = (phoneNumber) => {
    // Example regex for validating phone numbers (adjust as necessary)
    const phoneRegex = /^\d{10,15}$/; // Modify this regex based on your validation rules
    return phoneRegex.test(phoneNumber);
  };
  const allUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const userList = usersSnapshot.docs.map((doc) => doc.data());
      setAllUserFirebase(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return an empty array or handle the error as needed
    }
  };
  useEffect(() => {
    getAllUsers();
    allUsers();
  }, []);

  const handleUpdate = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (userId, hasId) => {
    if (!hasId) {
      message.warning("Không thể xóa người dùng này");
      return;
    }

    try {
      await axios.delete(`${baseUrl}auth/delete-user/${userId}`);
      message.success("Xóa thành công");
      // Refresh the user list after deleting
      getAllUsers();
      allUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user");
    }
  };

  const handleModalOk = async () => {
    if (!selectedUser._id) {
      message.warning("Không thể chỉnh sửa người dùng này");
      setIsModalVisible(false);
      return;
    }

    const values = form.getFieldsValue();
    // Validate phone number
    if (!isValidPhoneNumber(values.phoneNumber)) {
      message.error("Số điện thoại không hợp lệ. Vui lòng nhập lại");
      return;
    }

    try {
      await axios.put(`${baseUrl}auth/update-user/${selectedUser._id}`, values);
      message.success("Chỉnh sửa thành công");
      setIsModalVisible(false);
      // Refresh the user list after updating
      getAllUsers();
      allUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const filterRoleUser = allUser.filter((item) => item.role !== "staff");
  const combineUser = [...filterRoleUser, ...allUserFirebase];
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1, // Displays the row number
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Họ và tên",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Chỉnh sửa
          </Button>

          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tour này không?"
              onConfirm={() =>
                handleDelete(record._id || record.uid, !!record._id)
              }
              okText="Có"
              cancelText="Không"
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Xóa blog
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeadingPage title="Tất cả người dùng" />
      <Table
        columns={columns}
        dataSource={combineUser.reverse()}
        rowKey={(record) => record._id || record.uid} // Use _id or uid as unique key
      />
      <Modal
        title="Update User"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input the email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="displayName"
            rules={[
              { required: true, message: "Please input the display name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please input the phone number!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllUser;
