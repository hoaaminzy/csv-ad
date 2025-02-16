import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  message,
  Upload,
  Select,
  Table,
  Modal,
  Popconfirm,
} from "antd";
import HeadingPage from "./HeadingPage";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";

const { Option } = Select;

const CreateClass = ({ schoolYears, departments }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]); // State to hold class list
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
    return false;
  };
  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/classes/get-all-class"
      );
      setClasses(response.data); // Update state with fetched data
    } catch (error) {
      message.error("Không thể lấy danh sách lớp.");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const onFinish = async (values) => {
    if (!file) {
      message.error("Vui lòng chọn file!");
      return;
    }

    try {
      setLoading(true);

      // Tạo FormData để gửi dữ liệu
      const formData = new FormData();
      formData.append("maLop", values.maLop);
      formData.append("namhoc", values.namhoc);
      formData.append("khoa", values.khoa);
      formData.append("nganh", values.nganh);
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8080/api/classes/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        message.success("Lớp học đã được tạo thành công!");
        form.resetFields();
        setFile(null);
        fetchClasses();
        setIsModalOpen(false);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.error(error.response.data.message || "Mã lớp đã tồn tại.");
      } else {
        message.error("Có lỗi xảy ra khi tạo lớp học.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyChange = (facultyName) => {
    const selectedFaculty = departments.find(
      (faculty) => faculty.faculty === facultyName
    );
    if (selectedFaculty) {
      setSelectedMajors(selectedFaculty.majors);
    } else {
      setSelectedMajors([]);
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/classes/class/${id}/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "file.xlsx");
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      message.error("Error downloading file");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/classes/delete-class/${id}`
      );
      message.success("Xóa thành Công");
      fetchClasses();
    } catch (error) {
      console.log(error);
    }
  };
  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Mã Lớp",
      dataIndex: "maLop",
      key: "maLop",
    },
    {
      title: "Khóa Học",
      dataIndex: "namhoc",
      key: "namhoc",
    },
    {
      title: "Khoa",
      dataIndex: "khoa",
      key: "khoa",
    },
    {
      title: "Chuyên Ngành",
      dataIndex: "nganh",
      key: "nganh",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            className="bg-blue-500 text-white"
            type="link"
            icon={<DownloadOutlined />}
            onClick={() => handleDownload(record._id)}
          >
            Tải danh sách lớp
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="primary" danger>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className=" ">
      <HeadingPage title="Quản lý lớp học" />

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Tạo Lớp Học
      </Button>

      {/* Modal for creating class */}
      <Modal
        title="Tạo Lớp Học"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >
          <Form.Item
            name="maLop"
            label="Mã Lớp"
            rules={[{ required: true, message: "Vui lòng nhập mã lớp!" }]}
          >
            <Input placeholder="Nhập mã lớp" />
          </Form.Item>
          <Form.Item
            label="Khóa Học"
            name="namhoc"
            rules={[{ required: true, message: "Please select a year!" }]}
          >
            <Select placeholder="Chọn khóa học">
              {schoolYears.map((item) => (
                <Select.Option key={item.year} value={item.year}>
                  {item.year}
                </Select.Option>
              ))}
            </Select>
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
            className="mb-3"
            label="Chuyên Ngành"
            name="nganh"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              placeholder="Chọn chuyên ngành"
              disabled={selectedMajors.length === 0}
              allowClear
            >
              {selectedMajors.map((major, index) => (
                <Option key={index} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Upload
            beforeUpload={handleFileChange}
            fileList={file ? [file] : []}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} className="w-full">
              Chọn file danh sách lớp
            </Button>
          </Upload>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Tạo Lớp Học
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Display Class List */}
      <Table
        className="shadow-md rounded-md"
        dataSource={classes}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CreateClass;
