import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Input, Popconfirm, message } from "antd";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";

const CreateSchoolYear = () => {
  const [schoolYears, setSchoolYears] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchoolYear, setEditingSchoolYear] = useState(null);

  const [form] = Form.useForm();

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get(`${baseUrl}schoolyears/get-all-school`);
      setSchoolYears(response.data);
    } catch (error) {
      console.log("Lỗi khi tải danh sách năm học.");
    }
  };
  useEffect(() => {
    fetchSchoolYears();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (editingSchoolYear) {
        // Update school year
        await axios.put(
          `${baseUrl}schoolyears/update/${editingSchoolYear._id}`,
          values
        );
        message.success("Cập nhật năm học thành công!");
      } else {
        // Add new school year
        await axios.post(`${baseUrl}schoolyears/create`, values);
        message.success("Thêm năm học mới thành công!");
      }
      fetchSchoolYears();
      form.resetFields();
      setIsModalOpen(false);
      setEditingSchoolYear(null);
    } catch (error) {
      if (error.response && error.response.data.message === "Đã trùng") {
        message.error("Dữ liệu bị trùng!");
      } else {
        message.error("Đã xảy ra lỗi, vui lòng thử lại.");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}schoolyears/delete/${id}`);
      message.success("Xóa năm học thành công!");
      fetchSchoolYears();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa!");
    }
  };

  const columns = [
    {
      title: "Năm học",
      dataIndex: "year",
      key: "year",
    },

    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setEditingSchoolYear(record);
              setIsModalOpen(true);
              form.setFieldsValue({
                id: record._id,
                year: record.year,
              });
            }}
          >
            Sửa
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
    <div className="">
      <HeadingPage title="Danh sách năm học" />

      <div className="flex justify-start my-4">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm Năm Học
        </Button>
      </div>
      <Table
        className="shadow-md rounded-md"
        dataSource={schoolYears}
        columns={columns}
        rowKey={(record) => record.year} // Key by year since it's unique after grouping
        pagination={{ pageSize: 5 }}
      />

      {/* Modal for Add/Edit */}
      <Modal
        title={editingSchoolYear ? "Cập nhật Năm Học" : "Thêm Năm Học"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingSchoolYear(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="year"
            label="Năm học"
            rules={[{ required: true, message: "Vui lòng nhập năm học!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CreateSchoolYear;
