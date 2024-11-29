import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl, baseUrlImage } from "../base/baseUrl";
import {
  Table,
  Button,
  Modal,
  Popconfirm,
  Form,
  Space,
  Input,
  message,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Ckeditor5 from "./Ckeditor5";
import HeadingPage from "./HeadingPage";
import { DeleteOutlined } from "@ant-design/icons";

const AllBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [editingBlog, setEditingBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseUrl}blogs/get-all-blogs`);
      setBlogs(res.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch blogs.");
    }
  };

  const showModal = (content) => {
    setSelectedContent(content);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsEditModalVisible(false);
  };

  // Delete blog
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}blogs/delete-blog/${id}`);
      message.success("Blog deleted successfully!");
      fetchBlogs(); // Refresh list after deletion
    } catch (error) {
      console.log(error);
      message.error("Failed to delete blog.");
    }
  };

  // Open edit modal with blog data
  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setContent(blog.content);
    setImage(null); // Reset image selection for editing
    setIsEditModalVisible(true);
  };

  // Update blog
  const handleUpdate = async () => {
    if (!editingBlog) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await axios.put(
        `${baseUrl}blogs/update-blog/${editingBlog._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      message.success("Blog updated successfully!");
      fetchBlogs(); // Refresh list after update
      setIsEditModalVisible(false);
      setEditingBlog(null);
    } catch (error) {
      console.log(error);
      message.error("Failed to update blog.");
    }
  };

  const handleUpload = (file) => {
    setImage(file);
    return false;
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1, // Displays the row number
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img
          style={{ borderRadius: "10px" }}
          alt=""
          width="200px"
          height="100%"
          src={`${image}`}
        />
      ),
    },
    {
      title: "Tùy chọn",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => showModal(record.content)}>
            Xem chi tiết
          </Button>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Chỉnh sửa
          </Button>

          <Space size="middle">
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa tour này không?"
              onConfirm={() => handleDelete(record._id)}
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
      <HeadingPage title="Tất cả tin tức" />
      <Table columns={columns} dataSource={blogs.reverse()} rowKey="_id" />

      {/* View Content Modal */}
      <Modal
        title="Nội dung"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <div dangerouslySetInnerHTML={{ __html: selectedContent }}></div>
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        title="Edit Blog"
        visible={isEditModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="update" type="primary" onClick={handleUpdate}>
            Cập nhập
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Title" required>
            <Input
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              accept="image/*"
              listType="picture"
              maxCount={1}
              beforeUpload={handleUpload}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Content">
            <Ckeditor5 onChange={setContent} initialValue={content} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AllBlog;
