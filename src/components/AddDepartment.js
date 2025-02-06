import React, { useState } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { Button, Input, Form, message } from "antd";

const AddDepartment = () => {
  const [faculty, setFaculty] = useState("");
  const [majors, setMajors] = useState([
    { name: "", courses: [""] }, // Mỗi ngành có danh sách môn học
  ]);

  // Thêm ngành mới
  const handleAddMajor = () => {
    setMajors([...majors, { name: "", courses: [""] }]);
  };

  // Xóa ngành
  const handleRemoveMajor = (index) => {
    setMajors(majors.filter((_, idx) => idx !== index));
  };

  // Cập nhật tên ngành
  const handleChangeMajor = (index, value) => {
    const updatedMajors = majors.map((major, idx) =>
      idx === index ? { ...major, name: value } : major
    );
    setMajors(updatedMajors);
  };

  // Thêm môn học vào ngành cụ thể
  const handleAddCourse = (majorIndex) => {
    const updatedMajors = majors.map((major, idx) =>
      idx === majorIndex ? { ...major, courses: [...major.courses, ""] } : major
    );
    setMajors(updatedMajors);
  };

  // Xóa môn học khỏi ngành
  const handleRemoveCourse = (majorIndex, courseIndex) => {
    const updatedMajors = majors.map((major, idx) =>
      idx === majorIndex
        ? {
            ...major,
            courses: major.courses.filter((_, i) => i !== courseIndex),
          }
        : major
    );
    setMajors(updatedMajors);
  };

  // Cập nhật tên môn học
  const handleChangeCourse = (majorIndex, courseIndex, value) => {
    const updatedMajors = majors.map((major, idx) =>
      idx === majorIndex
        ? {
            ...major,
            courses: major.courses.map((course, i) =>
              i === courseIndex ? value : course
            ),
          }
        : major
    );
    setMajors(updatedMajors);
  };

  // Xử lý submit form
  const handleSubmit = async () => {
    try {
      await axios.post(`${baseUrl}department/create-departments`, {
        faculty,
        majors,
      });
      message.success("Thêm khoa thành công!");
      setFaculty("");
      setMajors([{ name: "", courses: [""] }]);
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Thêm Khoa, Ngành và Môn Học
      </h2>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label={<span className="text-lg font-medium">Tên Khoa:</span>}
          rules={[{ required: true, message: "Vui lòng nhập tên khoa!" }]}
        >
          <Input
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            placeholder="Nhập tên khoa"
            className="py-2 px-4 rounded-md"
          />
        </Form.Item>

        <div>
          <label className="block text-lg font-medium mb-2">Ngành Học:</label>
          {majors.map((major, majorIndex) => (
            <div key={majorIndex} className="mb-4 p-4 border rounded-md">
              <div className="flex items-center gap-2">
                <Input
                  value={major.name}
                  onChange={(e) =>
                    handleChangeMajor(majorIndex, e.target.value)
                  }
                  placeholder={`Ngành ${majorIndex + 1}`}
                  className="py-2 px-4 rounded-md flex-1"
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

              <label className="block text-md font-medium mt-3">Môn Học:</label>
              {major.courses.map((course, courseIndex) => (
                <div key={courseIndex} className="flex items-center gap-2 mb-2">
                  <Input
                    value={course}
                    onChange={(e) =>
                      handleChangeCourse(
                        majorIndex,
                        courseIndex,
                        e.target.value
                      )
                    }
                    placeholder={`Môn học ${courseIndex + 1}`}
                    className="py-2 px-4 rounded-md flex-1"
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
              <Button type="dashed" onClick={() => handleAddCourse(majorIndex)}>
                + Thêm môn học
              </Button>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={handleAddMajor}
            className="w-full mt-2"
          >
            + Thêm ngành
          </Button>
        </div>

        <Form.Item className="text-center mt-6">
          <Button type="primary" htmlType="submit" className="w-full py-2">
            Thêm Khoa
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddDepartment;
