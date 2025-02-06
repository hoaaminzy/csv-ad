import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { Table, Button, Modal, Popconfirm, Form, Input, message } from "antd";
import HeadingPage from "./HeadingPage";

const AllDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [faculty, setFaculty] = useState("");
  const [majors, setMajors] = useState([{ name: "", courses: [""] }]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
  }, []);

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

  const handleChangeCourse = (majorIndex, courseIndex, value) => {
    const updatedMajors = [...majors];
    updatedMajors[majorIndex].courses[courseIndex] = value; // Ensure value is a string
    setMajors(updatedMajors);
  };

  const handleAddCourse = (majorIndex) => {
    const updatedMajors = [...majors];
    updatedMajors[majorIndex].courses.push(""); // Add an empty string to courses array
    setMajors(updatedMajors);
  };

  const handleSubmit = async () => {
    try {
      const data = { faculty, majors };

      // Ensure that all courses are in the right format (array of strings)
      const validMajors = majors.map((major) => ({
        ...major,
        courses: major.courses.filter((course) => course.trim() !== ""), // Remove empty strings if any
      }));

      if (editingDepartment) {
        // If editing, send updated data
        await axios.put(
          `${baseUrl}department/update-department/${editingDepartment._id}`,
          { faculty, majors: validMajors }
        );
        message.success("Cập nhật khoa thành công!");
      } else {
        // If adding new, send the data
        await axios.post(`${baseUrl}department/create-departments`, {
          faculty,
          majors: validMajors,
        });
        message.success("Thêm khoa mới thành công!");
      }

      fetchDepartments();
      resetForm();
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}department/delete-department/${id}`);
      message.success("Xóa khoa thành công!");
      fetchDepartments();
    } catch (error) {
      message.error("Đã xảy ra lỗi khi xóa!");
    }
  };

  const handleAddMajor = () => {
    setMajors([...majors, { name: "", courses: [""] }]);
  };

  const handleRemoveMajor = (index) => {
    setMajors(majors.filter((_, idx) => idx !== index));
  };

  const handleChangeMajor = (index, value) => {
    const updatedMajors = majors.map((major, idx) =>
      idx === index ? { ...major, name: value } : major
    );
    setMajors(updatedMajors);
  };

  const handleRemoveCourse = (majorIndex, courseIndex) => {
    const updatedMajors = [...majors];
    updatedMajors[majorIndex].courses = updatedMajors[
      majorIndex
    ].courses.filter((_, idx) => idx !== courseIndex);
    setMajors(updatedMajors);
  };

  const resetForm = () => {
    setFaculty("");
    setMajors([{ name: "", courses: [""] }]);
    setIsAddModalVisible(false);
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  const columns = [
    {
      title: "Khoa",
      dataIndex: "faculty",
      key: "faculty",
    },
    {
      title: "Ngành học",
      dataIndex: "majors",
      key: "majors",
      render: (majors) =>
        majors.map((major) => (
          <div key={major.name}>
            <b>{major.name}</b>: {major.courses.join(", ")}
          </div>
        )),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            onClick={() => {
              setEditingDepartment(record);
              setFaculty(record.faculty);
              setMajors(record.majors);
              setIsModalOpen(true);
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
    <div>
      <HeadingPage title="Quản lý Khoa - Ngành" />
      <Button
        type="primary"
        className="my-3"
        onClick={() => setIsAddModalVisible(true)}
      >
        Thêm Khoa
      </Button>

      <Modal
        title={editingDepartment ? "Cập nhật Khoa" : "Thêm Khoa"}
        visible={isAddModalVisible}
        onCancel={resetForm}
        footer={null}
        centered
      >
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Tên Khoa"
            rules={[{ required: true, message: "Vui lòng nhập tên khoa!" }]}
          >
            <Input
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="Nhập tên khoa"
            />
          </Form.Item>

          {majors.map((major, majorIndex) => (
            <div key={majorIndex} className="mb-4">
              <label className="block text-lg font-medium mb-2">
                Ngành {majorIndex + 1}:
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={major.name}
                  onChange={(e) =>
                    handleChangeMajor(majorIndex, e.target.value)
                  }
                  placeholder="Nhập tên ngành"
                />
                {majors.length > 1 && (
                  <Button
                    type="danger"
                    onClick={() => handleRemoveMajor(majorIndex)}
                  >
                    Xóa
                  </Button>
                )}
              </div>

              {major.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="flex items-center gap-2 mt-2">
                  <Input
                    value={course}
                    onChange={(e) =>
                      handleChangeCourse(
                        majorIndex,
                        courseIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Khóa học ${courseIndex + 1}`}
                  />
                  {major.courses.length > 1 && (
                    <Button
                      type="danger"
                      onClick={() =>
                        handleRemoveCourse(majorIndex, courseIndex)
                      }
                    >
                      Xóa
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="dashed"
                onClick={() => handleAddCourse(majorIndex)}
                className="mt-2"
              >
                Thêm khóa học
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={handleAddMajor}
            className="w-full mt-2"
          >
            Thêm ngành
          </Button>

          <Form.Item className="text-center mt-6">
            <Button type="primary" htmlType="submit" className="w-full py-2">
              {editingDepartment ? "Cập nhật Khoa" : "Thêm Khoa"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        className="shadow-md rounded-md"
        dataSource={departments}
        columns={columns}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default AllDepartment;
