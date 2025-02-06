import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  Form,
  Table,
  Input,
  DatePicker,
  Checkbox,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import HeadingPage from "./HeadingPage";

const { Option } = Select;

const CreateSchedule = ({
  schoolYears,
  schedules,
  allCourses,
  departments,
  classes,
}) => {
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [handleClick, setHandleClick] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [schedule, setSchedule] = useState({
    date: null,
    morning: false,
    afternoon: false,
    evening: false,
    loaiLichHoc: "",
    slot: "",
    time: "",
    room: "",
  });

  const dataCourses = [
    {
      hk: "Học kỳ 1",
      courses: [
        {
          name: "Triết",
        },
        {
          name: "Tư tưởng HCM",
        },
        {
          name: "Mac Le nin",
        },
      ],
    },
    {
      hk: "Học kỳ 2",
      courses: [
        {
          name: "Đại số",
        },
        {
          name: "Giải tích",
        },
      ],
    },
    {
      hk: "Học kỳ 3",
      courses: [
        {
          name: "GDCD",
        },
      ],
    },
    {
      hk: "Học kỳ 4",
      courses: [
        {
          name: "Thể dục thể chất",
        },
      ],
    },
  ];

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
    const filteredClasses = allCourses.find(
      (cls) => cls.khoa === selectedFaculty && cls.nganh === majorName
    );
    setSelectedClasses(filteredClasses);
  };

  const [courseHK, setCourseHK] = useState([]);
  const handleCourse = (value) => {
    const check = selectedClasses?.semesters.find((item) => item.hk === value);
    setCourseHK(check);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const handleScheduleChange = (field, value) => {
    setSchedule({ ...schedule, [field]: value });
  };

  const checkCourseBatBuoc = dataCourses?.find(
    (item) => item.hk === courseHK?.hk
  );
  console.log(checkCourseBatBuoc);

  const handleSubmit = async () => {
    try {
      const scheduleData = {
        course: selectedCourse,
        date: schedule.date ? dayjs(schedule.date).format("YYYY-MM-DD") : null,
        morning: schedule.morning,
        afternoon: schedule.afternoon,
        evening: schedule.evening,
        time: schedule.time,
        room: schedule.room,
        loaiLichHoc: schedule.loaiLichHoc,
        slot: schedule.slot,
        faculty: selectedFaculty,
        major: selectedMajor,
        courseHK: courseHK?.hk,
      };
      const response = await axios.post(
        "http://localhost:8080/api/schedule/schedule",
        scheduleData
      );

      if (response.statusText === "Created") {
        Modal.success({
          content: "Lịch học đã được lưu thành công!",
        });
        setIsModalOpen(false);
        setSchedule({
          date: null,
          morning: false,
          afternoon: false,
          evening: false,
          time: "",
          room: "",
          slot: "",
        });
        setSelectedCourse(null);
        setSelectedFaculty("");
        setSelectedMajor("");
        setSelectedMajors([]);
        setSelectedClasses([]);
      } else {
        Modal.error({
          content: "Đã có lỗi xảy ra, vui lòng thử lại.",
        });
      }
    } catch (error) {
      // Handle errors during submission
      Modal.error({
        content: "Có lỗi trong quá trình lưu lịch học. Vui lòng thử lại!",
      });
      console.error("Error submitting schedule:", error);
    }
  };

  const columns = [
    { title: "Môn học", dataIndex: "course", key: "course" },
    { title: "Ngày", dataIndex: "date", key: "date" },
    {
      title: "Sáng",
      dataIndex: "morning",
      key: "morning",
      render: (val) => (val ? "Có" : "Không"),
    },
    {
      title: "Chiều",
      dataIndex: "afternoon",
      key: "afternoon",
      render: (val) => (val ? "Có" : "Không"),
    },
    {
      title: "Tối",
      dataIndex: "evening",
      key: "evening",
      render: (val) => (val ? "Có" : "Không"),
    },
    { title: "Thời gian", dataIndex: "time", key: "time" },
    { title: "Phòng", dataIndex: "room", key: "room" },
    { title: "Khoa", dataIndex: "faculty", key: "faculty" },
    { title: "Ngành", dataIndex: "major", key: "major" },
    { title: "Học kỳ", dataIndex: "courseHK", key: "courseHK" },
    { title: "Số lượng", dataIndex: "slot", key: "slot" },
    { title: "Loại lịch học", dataIndex: "loaiLichHoc", key: "loaiLichHoc" },
  ];

  return (
    <div className="">
      <HeadingPage title="Quản lý môn học" />
      <Button type="primary" className="mb-3" onClick={showModal}>
        Tạo lịch học
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        title="Thêm Lịch Trình"
        footer={null}
      >
        <Form layout="vertical">
          <Form.Item label="Chọn Khoa">
            <Select
              placeholder="Chọn khoa"
              onChange={handleFacultyChange}
              allowClear
            >
              {departments?.map((faculty) => (
                <Option key={faculty._id} value={faculty.faculty}>
                  {faculty.faculty}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Chọn Ngành">
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

          <Form.Item label="Chọn Học Kỳ">
            <Select onChange={handleCourse} placeholder="Chọn học kỳ">
              {selectedClasses?.semesters?.map((sem, idx) => (
                <Option key={idx} value={sem.hk}>
                  {sem.hk}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <div className="mb-3 flex gap-3 justify-between">
            <Button
              className={`${
                handleClick === true ? "bg-blue-500 text-white" : ""
              } `}
              onClick={() => setHandleClick(true)}
            >
              Chọn Môn Học Chuyên Ngành
            </Button>
            <Button
              className={`${
                handleClick === false ? "bg-blue-500 text-white" : ""
              } `}
              onClick={() => setHandleClick(false)}
            >
              Chọn Môn Học Bắt Buộc
            </Button>
          </div>
          {handleClick ? (
            <Form.Item label="Chọn Môn Học">
              <Select onChange={handleCourseChange} placeholder="Chọn môn học">
                {courseHK?.courses?.map((course) => (
                  <Option key={course._id} value={course.name}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item label="Chọn Môn Học">
              <Select onChange={handleCourseChange} placeholder="Chọn môn học">
                {checkCourseBatBuoc?.courses?.map((course) => (
                  <Option key={course._id} value={course.name}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item label="Chọn Ngày Học">
            <DatePicker
              value={schedule.date}
              onChange={(date) => handleScheduleChange("date", date)}
              format="YYYY-MM-DD"
              disabled={!selectedCourse}
            />
          </Form.Item>

          <Form.Item label="Chọn Buổi Học">
            <Checkbox
              checked={schedule.morning}
              onChange={(e) =>
                handleScheduleChange("morning", e.target.checked)
              }
            >
              Sáng
            </Checkbox>
            <Checkbox
              checked={schedule.afternoon}
              onChange={(e) =>
                handleScheduleChange("afternoon", e.target.checked)
              }
            >
              Chiều
            </Checkbox>
            <Checkbox
              checked={schedule.evening}
              onChange={(e) =>
                handleScheduleChange("evening", e.target.checked)
              }
            >
              Tối
            </Checkbox>
          </Form.Item>

          <Form.Item label="Thời Gian">
            <Input
              value={schedule.time}
              onChange={(e) => handleScheduleChange("time", e.target.value)}
              placeholder="VD: 08:00 - 10:00"
            />
          </Form.Item>

          <Form.Item label="Phòng Học">
            <Input
              value={schedule.room}
              onChange={(e) => handleScheduleChange("room", e.target.value)}
              placeholder="VD: P301"
            />
          </Form.Item>
          <Form.Item label="Số lượng">
            <Input
              value={schedule.slot}
              onChange={(e) => handleScheduleChange("slot", e.target.value)}
              placeholder="VD: 29"
            />
          </Form.Item>

          <Form.Item label="Chọn loại lịch ">
            <Select
              placeholder="Chọn lịch học"
              value={schedule.loaiLichHoc || ""}
              onChange={(value) => handleScheduleChange("loaiLichHoc", value)}
            >
              <Option value="Lịch học trực tuyến">Lịch học trực tuyến</Option>
              <Option value="Lịch học thực hành">Lịch học thực hành</Option>
              <Option value="Lịch học lý thuyết">Lịch học lý thuyết</Option>
              <Option value="Lịch thi">Lịch thi</Option>
              <Option value="Lịch tạm ngưng">Lịch tạm ngưng</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" onClick={handleSubmit}>
              Lưu Lịch Học
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={schedules}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default CreateSchedule;
