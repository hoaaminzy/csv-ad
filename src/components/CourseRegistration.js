import React, { useState, useEffect } from "react";
import { Table, Select, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;

const data = [
  { monHoc: "A", courseHK: "Học kỳ 1" },
  { monHoc: "B", courseHK: "Học kỳ 2" },
  { monHoc: "C", courseHK: "Học kỳ 3" },
];

const CourseRegistration = () => {
  const [selectedHK, setSelectedHK] = useState(null);
  const [registeredCourses, setRegisteredCourses] = useState([]);

  // 📌 Lấy học kỳ mở từ API khi load trang
  useEffect(() => {
    const fetchOpenSemester = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/registrationStatus/get-all"
        );
        if (res.data) setSelectedHK(res.data.openSemester);
      } catch (error) {
        console.error("Lỗi khi lấy học kỳ mở:", error);
      }
    };

    fetchOpenSemester();
  }, []);

  // 📌 Cập nhật học kỳ mở vào MongoDB
  const handleAdminSelectHK = async (value) => {
    try {
      await axios.post("http://localhost:8080/api/registrationStatus/open-hk", {
        openSemester: value,
      });
      setSelectedHK(value);
      message.success(`Đã mở đăng ký cho ${value}`);
    } catch (error) {
      message.error("Lỗi khi cập nhật học kỳ");
    }
  };

  // 📌 Đăng ký môn học
  const handleRegister = (course) => {
    setRegisteredCourses((prev) => [...prev, course]);
  };

  // 📌 Lọc môn học hiển thị: Học kỳ đang mở hoặc đã đăng ký
  const filteredCourses = data.filter(
    (course) =>
      course.courseHK === selectedHK || registeredCourses.includes(course)
  );

  // 📌 Cấu hình bảng
  const columns = [
    { title: "Môn học", dataIndex: "monHoc", key: "monHoc" },
    { title: "Học kỳ", dataIndex: "courseHK", key: "courseHK" },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) =>
        registeredCourses.includes(record) ? (
          <span>✅ Đã đăng ký</span>
        ) : (
          <Button onClick={() => handleRegister(record)} type="primary">
            Đăng ký
          </Button>
        ),
    },
  ];

  return (
    <div>
      {/* Quản trị viên chọn học kỳ mở */}
      <div style={{ marginBottom: 16 }}>
        <span>Quản trị viên mở đăng ký học kỳ: </span>
        <Select
          value={selectedHK}
          onChange={handleAdminSelectHK}
          style={{ width: 200 }}
        >
          <Option value="Học kỳ 1">Học kỳ 1</Option>
          <Option value="Học kỳ 2">Học kỳ 2</Option>
          <Option value="Học kỳ 3">Học kỳ 3</Option>
        </Select>
      </div>

      {/* Danh sách môn học */}
      <Table columns={columns} dataSource={filteredCourses} rowKey="monHoc" />
    </div>
  );
};

export default CourseRegistration;
