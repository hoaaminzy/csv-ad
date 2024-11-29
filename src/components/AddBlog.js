// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Upload, List, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Ckeditor5 from "./Ckeditor5";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";

const AddBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${baseUrl}blogs/get-all-blogs`);
      setBlogs(response.data);
    } catch (error) {
      message.error("Failed to fetch blogs.");
    }
  };

  // Xử lý khi submit form để tạo bài viết mới
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    try {
      await axios.post(`${baseUrl}blogs/add-blog`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("Tạo Blog thành công!");
      fetchBlogs(); // Cập nhật danh sách bài viết
      setTitle(""); // Reset title
      setContent(""); // Reset content
      setImage(null); // Reset image
    } catch (error) {
      console.log(error);
      message.error("Xảy ra lỗi tạo Blog");
    }
  };

  const handleUpload = (file) => {
    setImage(file); // Lưu file ảnh vào state
    return false; // Ngăn Ant Design Upload component tự động upload
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <HeadingPage title="Thêm tin tức" />
      <Form layout="vertical" onFinish={handleSubmit}>
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
            // beforeUpload={() => false}
            beforeUpload={handleUpload}
            // onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Content">
          <Ckeditor5 onChange={setContent} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tạo tin
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddBlog;
