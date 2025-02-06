import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input, Upload, Modal, message, Popconfirm, Table } from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import HeadingPage from "./HeadingPage";

function FormUpload() {
  const [formName, setFormName] = useState("");
  const [file, setFile] = useState(null);
  const [forms, setForms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNameChange = (e) => {
    setFormName(e.target.value);
  };

  const handleFileChange = (file) => {
    setFile(file);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", formName);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/forms/forms",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      message.success("Tải biểu mẫu thành công");
      setForms([...forms, response.data]);
      setFormName("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading form:", error);
      message.error("Error uploading form");
    }
  };

  const handleDownload = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/forms/forms/${id}/download`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "form.doc");
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
      await axios.delete(`http://localhost:8080/api/forms/deleteForms/${id}`);
      message.success("Xóa thành công!");
      getAllForms();
    } catch (error) {
      message.error("Lỗi khi xóa!");
    }
  };

  const getAllForms = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/forms/forms");
      setForms(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
      message.error("Error fetching forms");
    }
  };

  useEffect(() => {
    getAllForms();
  }, []);

  const columns = [
    {
      title: "Tên Biểu Mẫu",
      dataIndex: "name",
      key: "name",
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
            Tải xuống
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
    <div className="container mx-auto ">
      <HeadingPage title="Quản lý biểu mẫu" />

      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Tạo Biểu mẫu
      </Button>

      <Modal
        title="Tạo Biểu mẫu"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Tên biểu mẫu"
            value={formName}
            onChange={handleNameChange}
            required
            className="w-full mb-3"
          />
          <Upload
            beforeUpload={handleFileChange}
            fileList={file ? [file] : []}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} className="w-full">
              Chọn file
            </Button>
          </Upload>
          <Button type="primary" htmlType="submit" className="w-full">
            Tạo biểu mẫu
          </Button>
        </form>
      </Modal>

      <Table dataSource={forms} columns={columns} rowKey="_id" />
    </div>
  );
}

export default FormUpload;
