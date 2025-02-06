import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Button,
  Modal,
  Input,
  Popconfirm,
  Form,
  Space,
  message,
  Select,
} from "antd";
import HeadingPage from "./HeadingPage";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
const { Option } = Select;
const options = [];

const AllStaff = () => {
  const [allUser, setAllUser] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectCourse, setSelectCourse] = useState([]);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}department/get-all-departments`
      );
      setDepartments(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách khoa.");
    }
  };
  const handleFacultyChange = (facultyName) => {
    setSelectedFaculty(facultyName);

    const selectedFaculty = departments.find(
      (faculty) => faculty.faculty === facultyName
    );
    if (selectedFaculty) {
      setSelectedMajors(selectedFaculty.majors.map((item) => item.name));

      setSelectedClasses([]); // Xóa danh sách lớp khi thay đổi khoa
      setSelectedMajor(""); // Reset ngành
    } else {
      setSelectedMajors([]);
    }
  };
  const handleMajorChange = (majorName) => {
    setSelectedMajor(majorName);
    const selectedFaculti = departments.find(
      (faculty) => faculty.faculty === selectedFaculty
    );
    console.log(selectedFaculti);
    if (selectedFaculti) {
      setSelectCourse(
        selectedFaculti?.majors?.find((item) => item.name === majorName)
      );
    }
  };

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    fetchDepartments();
  }, []);

  const isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10,15}$/; // Validate phone number
    return phoneRegex.test(phoneNumber);
  };

  // Handle user addition
  const handleAddUser = async (values) => {
    setLoading(true);

    const userValues = {
      ...values,
      isStaff: true, // Mark the user as a staff member
    };
    console.log(userValues);

    try {
      await axios.post(`${baseUrl}auth/signup`, userValues);
      message.success("Đăng ký thành công!");
      form.resetFields();
      setIsAddModalVisible(false);
      fetchAllUsers(); // Refresh list
    } catch (error) {
      console.error("Error adding user:", error);
      message.error("Có lỗi xảy ra khi thêm người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Handle user update
  const handleUpdateUser = async () => {
    if (!selectedUser?._id) {
      message.warning("Không thể chỉnh sửa người dùng này");
      setIsModalVisible(false);
      return;
    }

    const values = form.getFieldsValue();
    if (!isValidPhoneNumber(values.phoneNumber)) {
      message.error("Số điện thoại không hợp lệ. Vui lòng nhập lại");
      return;
    }

    try {
      await axios.put(`${baseUrl}auth/update-user/${selectedUser._id}`, values);
      message.success("Chỉnh sửa thành công");
      setIsModalVisible(false);
      fetchAllUsers(); // Refresh list
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Có lỗi xảy ra khi chỉnh sửa người dùng!");
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${baseUrl}auth/delete-user/${userId}`);
      message.success("Xóa thành công!");
      fetchAllUsers(); // Refresh list
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Có lỗi xảy ra khi xóa người dùng!");
    }
  };

  // Open modal to update user
  const handleUpdateModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      email: user.email,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      address: user.address,
    });
    setIsModalVisible(true);
  };

  // Columns for the table
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
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
      title: "Khoa",
      dataIndex: "khoa",
      key: "khoa",
    },
    {
      title: "Ngành",
      dataIndex: "nganh",
      key: "nganh",
    },
    {
      title: "Môn",
      key: "nganh",
      render: (text, record) => (
        <div className="flex flex-col">
          {record?.learn?.map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <div className="flex gap-2 items-center">
          <Button type="primary" onClick={() => handleUpdateModal(record)}>
            Chỉnh sửa
          </Button>
          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa người dùng này không?"
              onConfirm={() => handleDeleteUser(record._id)}
              okText="Có"
              cancelText="Không"
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                style={{ marginLeft: 8 }}
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <div>
      <HeadingPage title="Quản lý giảng viên" />
      <div className="flex justify-start my-4">
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
          Thêm Giảng viên
        </Button>
      </div>
      <Table
        className="shadow-md rounded-md"
        columns={columns}
        dataSource={allUser.filter((item) => item.role === "teacher")}
        rowKey={(record) => record._id || record.uid}
      />
      {/* Add User Modal */}
      <Modal
        title="Thêm Giảng viên"
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddUser}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="displayName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^\d{10,15}$/,
                message: "Số điện thoại không hợp lệ (10-15 số)!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input placeholder="Nhập địa chỉ" />
          </Form.Item>

          <Form.Item
            label="Khoa"
            name="khoa"
            rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
          >
            <Select
              placeholder="Chọn khoa"
              onChange={handleFacultyChange}
              allowClear
            >
              {departments.map((faculty) => (
                <Option key={faculty._id} value={faculty.faculty}>
                  {faculty.faculty}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Majors Select */}
          <Form.Item
            label="Chuyên Ngành"
            name="nganh"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              disabled={selectedMajors.length === 0}
              onChange={handleMajorChange}
              allowClear
            >
              {selectedMajors.map((major, index) => (
                <Option key={index} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="learn" label="Chọn môn học">
            <Select
              placeholder="Chọn môn học"
              mode="tags"
              style={{ width: "100%" }}
              // onChange={handleChange}
              tokenSeparators={[","]}
              options={selectCourse?.courses?.map((course) => ({
                label: course,
                value: course,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp!"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form>
      </Modal>
      {/* Update User Modal */}
      <Modal
        title="Chỉnh sửa thông tin"
        visible={isModalVisible}
        onOk={handleUpdateUser}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            name="displayName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^\d{10,15}$/,
                message: "Số điện thoại không hợp lệ (10-15 số)!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Địa chỉ" name="address">
            <Input />
          </Form.Item>
          <Form.Item
            label="Khoa"
            name="khoa"
            rules={[{ required: true, message: "Vui lòng chọn khoa" }]}
          >
            <Select
              placeholder="Chọn khoa"
              onChange={handleFacultyChange}
              allowClear
            >
              {departments.map((faculty) => (
                <Option key={faculty._id} value={faculty.faculty}>
                  {faculty.faculty}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Majors Select */}
          <Form.Item
            label="Chuyên Ngành"
            name="nganh"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              disabled={selectedMajors.length === 0}
              onChange={handleMajorChange}
              allowClear
            >
              {selectedMajors.map((major, index) => (
                <Option key={index} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="learn">
            <Select
              placeholder="Chọn môn học"
              mode="tags"
              style={{ width: "100%" }}
              // onChange={handleChange}
              tokenSeparators={[","]}
              options={selectCourse?.courses?.map((course) => ({
                label: course,
                value: course,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllStaff;
