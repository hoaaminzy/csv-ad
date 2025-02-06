import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";
import HeadingPage from "./HeadingPage";

const { Option } = Select;

const AddCourse = ({ schoolYears, departments, users }) => {
  const [courses, setCourses] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const [selectCourse, setSelectCourse] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

  const [selectedUser, setSelectedUser] = useState([]);
  useEffect(() => {
    fetchCourses();
  }, []);

  const showModalDetail = () => {
    setIsModalOpenDetail(true);
  };

  const handleOkDetail = () => {
    setIsModalOpenDetail(false);
  };

  const handleCancelDetail = () => {
    setIsModalOpenDetail(false);
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/courses/get-all-course"
      );
      setCourses(res.data);
    } catch (error) {
      message.error("Lỗi khi tải dữ liệu!");
    }
  };

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    form.setFieldsValue({
      nganh: course.nganh,
      khoa: course.khoa,
      semesters: course.semesters,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/courses/course/${id}`);
      message.success("Xóa thành công!");
      fetchCourses();
    } catch (error) {
      message.error("Lỗi khi xóa!");
    }
  };

  const handleViewDetail = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/courses/course/${id}`
      );
      showModalDetail();
      setCourseDetail(res.data);
    } catch (error) {
      message.error("Lỗi khi xem chi tiết!");
    }
  };

  const handleSave = async (values) => {
    try {
      const formattedValues = {
        nganh: values.nganh,
        khoa: values.khoa,
        semesters: values.semesters.map((semester) => ({
          hk: semester.hk,
          courses: semester.courses.map((course) => ({
            name: course.name,
            code: course.code,
            credits: course.credits,
            lectureHours: course.theory,
            practiceHours: course.practice,
            mandatory: course.mandatory ?? true,
          })),
        })),
      };

      if (editingCourse) {
        await axios.put(
          `http://localhost:8080/api/courses/course/${editingCourse._id}`,
          formattedValues
        );
        message.success("Cập nhật thành công!");
      } else {
        await axios.post(
          "http://localhost:8080/api/courses/course",
          formattedValues
        );
        message.success("Thêm thành công!");
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      message.error("Lỗi khi lưu!");
    }
  };

  const columns = [
    { title: "Khoa", dataIndex: "khoa" },
    { title: "Ngành", dataIndex: "nganh" },
    {
      title: "Số học kỳ",
      dataIndex: "semesters",
      render: (semesters) => semesters?.length || 0,
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button type="primary" onClick={() => handleEdit(record)}>
            Sửa
          </Button>

          <Button
            type="primary"
            onClick={() => {
              handleViewDetail(record._id);
              showModalDetail();
            }}
          >
            Xem chi tiết
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

  const handleFacultyChange = (facultyName) => {
    setSelectedFaculty(facultyName);
    const selectedFaculty = departments.find(
      (faculty) => faculty.faculty === facultyName
    );
    if (selectedFaculty) {
      setSelectedMajors(selectedFaculty?.majors?.map((item) => item.name));
    } else {
      setSelectedMajors([]);
    }
  };
  const [selectedLearn, setSelectedLearn] = useState([]); // Danh sách môn đã chọn

  const handleMajor = (majorName) => {
    setSelectedMajor(majorName);
    const selectedFaculti = departments.find(
      (faculty) => faculty.faculty === selectedFaculty
    );
    if (selectedFaculti) {
      setSelectCourse(
        selectedFaculti?.majors?.find((item) => item.name === majorName)
      );
    }
  };
  const mergedLearn = [
    ...new Set(selectedUser.map((item) => item.learn).flat()),
  ];

  return (
    <div className="">
      <HeadingPage title="Quản lý khóa học" />
      <Button type="primary" onClick={handleAdd} className="mb-4">
        Thêm môn học
      </Button>
      <Table columns={columns} dataSource={courses} rowKey="_id" />

      <Modal
        title="Xem chi tiết"
        open={isModalOpenDetail}
        onOk={handleOkDetail}
        onCancel={handleCancelDetail}
        centered
      >
        {courseDetail?.semesters?.map((item) => (
          <div className="flex flex-col" key={item.hk}>
            <strong>Học kỳ: {item.hk}</strong>
            {item.courses.map((course) => (
              <div key={course._id} className="flex flex-col">
                <span>Tên môn học: {course.name}</span>
                <span>Số giờ thực hành: {course.practiceHours}</span>
                <span>Số giờ lý thuyết: {course.lectureHours}</span>
                <span>
                  Bắt buộc: {course.mandatory ? "Bắt buộc" : "Không bắt buộc"}
                </span>
                <hr />
              </div>
            ))}
          </div>
        ))}
      </Modal>

      <Modal
        title={editingCourse ? "Sửa môn học" : "Thêm môn học"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
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

          <Form.Item
            label="Chuyên Ngành"
            name="nganh"
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
            <Select
              onChange={handleMajor}
              placeholder="Chọn chuyên ngành"
              allowClear
            >
              {selectedMajors.map((major, index) => (
                <Option key={index} value={major}>
                  {major}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.List name="semesters">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key} className="border p-4 mb-4">
                    <h3>Học kỳ {key + 1}</h3>
                    <Form.Item
                      {...restField}
                      name={[name, "hk"]}
                      label="Tên học kỳ"
                      placeholder="VD: Học kỳ 1"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.List
                      name={[name, "courses"]}
                      initialValue={[{}]} // Mỗi học kỳ có ít nhất 1 môn
                    >
                      {(
                        courseFields,
                        { add: addCourse, remove: removeCourse }
                      ) => (
                        <>
                          {courseFields.map(
                            ({
                              key: courseKey,
                              name: courseName,
                              ...restCourseField
                            }) => (
                              <div key={courseKey} className="border p-4 mb-4">
                                <h4>Môn học {courseKey + 1}</h4>
                                <Form.Item
                                  {...restCourseField}
                                  label="Tên môn học"
                                  name={[courseName, "name"]} // Đảm bảo Form.Item lưu giá trị đúng vị trí
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng chọn môn học",
                                    },
                                  ]}
                                >
                                  <Select
                                    placeholder="Chọn môn học"
                                    onChange={(value) => {
                                      setSelectedLearn([
                                        ...selectedLearn,
                                        value,
                                      ]); // Cập nhật danh sách
                                      form.setFieldsValue({
                                        // Đảm bảo cập nhật Form
                                        semesters: form
                                          .getFieldValue("semesters")
                                          .map((semester, index) =>
                                            index === name
                                              ? {
                                                  ...semester,
                                                  courses: semester.courses.map(
                                                    (course, i) =>
                                                      i === courseName
                                                        ? {
                                                            ...course,
                                                            name: value,
                                                          }
                                                        : course
                                                  ),
                                                }
                                              : semester
                                          ),
                                      });
                                    }}
                                  >
                                    {selectCourse?.courses?.map(
                                      (learn, index) => (
                                        <Option key={index} value={learn}>
                                          {learn}
                                        </Option>
                                      )
                                    )}
                                  </Select>
                                </Form.Item>
                                <Form.Item
                                  {...restCourseField}
                                  name={[courseName, "code"]}
                                  label="Mã môn học"
                                  rules={[{ required: true }]}
                                >
                                  <Input />
                                </Form.Item>
                                <Form.Item
                                  {...restCourseField}
                                  name={[courseName, "credits"]}
                                  label="Số tín chỉ"
                                  rules={[{ required: true }]}
                                >
                                  <Input type="number" />
                                </Form.Item>
                                <Form.Item
                                  {...restCourseField}
                                  name={[courseName, "theory"]}
                                  label="Số tiết lý thuyết"
                                  rules={[{ required: true }]}
                                >
                                  <Input type="number" />
                                </Form.Item>
                                <Form.Item
                                  {...restCourseField}
                                  name={[courseName, "practice"]}
                                  label="Số tiết thực hành"
                                  rules={[{ required: true }]}
                                >
                                  <Input type="number" />
                                </Form.Item>
                                <Form.Item
                                  {...restCourseField}
                                  name={[courseName, "mandatory"]}
                                  label="Bắt buộc"
                                  valuePropName="checked"
                                >
                                  <input type="checkbox" />
                                </Form.Item>
                                <Button
                                  type="danger"
                                  onClick={() => removeCourse(courseName)}
                                >
                                  Xóa môn học
                                </Button>
                              </div>
                            )
                          )}

                          <Button type="dashed" onClick={addCourse}>
                            Thêm môn học
                          </Button>
                        </>
                      )}
                    </Form.List>
                    <Button type="danger" onClick={() => remove(name)}>
                      Xóa học kỳ
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={add}
                  //   icon={<PlusOutlined />}
                  className="mt-4"
                >
                  Thêm học kỳ
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default AddCourse;
