import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Space,
  Modal,
  Upload,
  Row,
  Col,
  InputNumber,
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import HeadingPage from "./HeadingPage";
const { Option } = Select;

const AddStudent = ({ schoolYears, departments, classes }) => {
  const [form] = Form.useForm();
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleFamilyMemberChange = (changedFields, allValues) => {
    setFamilyMembers(allValues.family_info);
  };
  const handleUpload = (file) => {
    console.log("Uploaded File:", file); // Log the uploaded file

    // Save the raw file in the state
    setImage(file);

    // Prevent the Upload component from automatically uploading the file
    return false;
  };
  useEffect(() => {
    if (image) {
      console.log("Image state updated:", image);
    } else {
      console.log("Image state is still undefined.");
    }
  }, [image]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Prepare FormData to include the uploaded image and form values
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (typeof values[key] === "object" && !Array.isArray(values[key])) {
          // If the value is an object (e.g., personal_info, education_info), stringify it
          formData.append(key, JSON.stringify(values[key]));
        } else if (Array.isArray(values[key])) {
          // If the value is an array (e.g., family_info), stringify each object
          formData.append(key, JSON.stringify(values[key]));
        } else {
          // For primitive values
          formData.append(key, values[key]);
        }
      });

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(
        "http://localhost:8080/api/students/add-student",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Modal.success({
        content: "Dữ liệu sinh viên đã được lưu thành công",
      });

      form.resetFields();
      setImage(null);
    } catch (error) {
      console.error(error);
      Modal.error({
        content: "Lưu dữ liệu sinh viên thất bại",
      });
    }
    setLoading(false);
  };

  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedMajor, setSelectedMajor] = useState("");
  const handleFacultyChange = (facultyName) => {
    setSelectedFaculty(facultyName);
    const selectedFaculty = departments.find(
      (faculty) => faculty.faculty === facultyName
    );

    if (selectedFaculty) {
      setSelectedMajors(selectedFaculty?.majors?.map((item) => item.name));
      setSelectedClasses([]); // Xóa danh sách lớp khi thay đổi khoa
      setSelectedMajor(""); // Reset ngành
    } else {
      setSelectedMajors([]);
    }
  };

  const handleMajorChange = (majorName) => {
    setSelectedMajor(majorName);
    const filteredClasses = classes.filter(
      (cls) => cls.khoa === selectedFaculty && cls.nganh === majorName
    );
    setSelectedClasses(filteredClasses);
  };

  return (
    <div className="">
      <HeadingPage title="Tạo mới sinh viên" />
      <Form
        className="shadow-md p-6 rounded-md"
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={handleFamilyMemberChange}
      >
        {/* Thông tin cơ bản về sinh viên */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-4">
          <Form.Item
            label="Mã Sinh Viên"
            name="student_id"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Họ và Tên"
            name="full_name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true }]}
          >
            <Input type="password" />
          </Form.Item>

          <Form.Item
            label="Giới tính"
            name="gender"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Nam">Nam</Option>
              <Option value="Nữ">Nữ</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Hình ảnh cá nhân"
            name="image"
            rules={[{ required: true, message: "Please upload an image" }]}
          >
            <Upload
              accept="image/*"
              listType="picture"
              maxCount={1}
              beforeUpload={handleUpload} // Custom function to handle the file upload
            >
              <Button icon={<UploadOutlined />}>Thêm ảnh cá nhân</Button>
            </Upload>
          </Form.Item>
        </div>

        {/* Thông tin giáo dục */}
        <h3 className="text-xl font-medium mt-6 mb-3">Thông Tin Giáo Dục</h3>
        <div className="grid grid-cols-3 gap-y-1 gap-x-4">
          <Form.Item
            label="Mã hồ sơ"
            name={["education_info", "student_code"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name={["education_info", "status"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại hình đào tạo (Không bắt buộc)"
            name={["education_info", "education_type"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cơ sở (Không bắt buộc)"
            name={["education_info", "campus"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bậc đào tạo (Không bắt buộc)"
            name={["education_info", "degree"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Khoa"
            name={["education_info", "faculty"]}
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
            label="Chuyên Ngành"
            name={["education_info", "major"]}
            rules={[{ required: true, message: "Vui lòng chọn chuyên ngành" }]}
          >
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

          {/* Class Select */}
          <Form.Item
            label="Lớp học"
            name={["education_info", "class"]}
            rules={[{ required: true, message: "Vui lòng chọn lớp học" }]}
          >
            <Select
              placeholder="Chọn lớp học"
              disabled={selectedClasses.length === 0}
              allowClear
            >
              {selectedClasses.map((cls) => (
                <Option key={cls._id} value={cls.maLop}>
                  {cls.maLop}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Khóa Học"
            name={["education_info", "course"]}
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
            label="Ngày Nhập Học"
            name={["education_info", "admission_date"]}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        {/* Thông tin cá nhân */}
        <h3 className="text-xl font-medium mt-6 mb-3">Thông Tin Cá Nhân</h3>
        <div className="grid grid-cols-3 gap-y-1 gap-x-4">
          <Form.Item
            label="Dân Tộc"
            name={["personal_info", "ethnicity"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Tôn Giáo" name={["personal_info", "religion"]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Quốc Tịch"
            name={["personal_info", "nationality"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Khu Vực"
            name={["personal_info", "region"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số CMND"
            name={["personal_info", "id_card", "number"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Nơi Cấp CMND"
            name={["personal_info", "id_card", "issue_place"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Diện chính sách (Không bắt buộc)"
            name={["personal_info", "policyArea"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày vào đảng (Không bắt buộc)"
            name={["personal_info", "dateOfJoiningTheParty"]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số Điện Thoại"
            name={["personal_info", "phone"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name={["personal_info", "email"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa Chỉ Hiện Tại"
            name={["personal_info", "current_address"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa Chỉ Thường Trú"
            name={["personal_info", "permanent_address"]}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Ngày Sinh"
            name={["personal_info", "birth_date"]}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Ngày Cấp CMND"
            name={["personal_info", "id_card", "issue_date"]}
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </div>

        {/* Thông tin gia đình */}
        <h3 className="text-xl font-medium mt-6 mb-3">Thông Tin Gia Đình</h3>
        <Form.List name="family_info">
          {(fields, { add, remove }) => (
            <div className="">
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    rowGap: "4px",
                    columnGap: "16px",
                  }}
                  align="baseline"
                  className="flex-col w-full"
                >
                  <Form.Item
                    label="Mối quan hệ"
                    {...restField}
                    name={[name, "relation"]}
                    fieldKey={[fieldKey, "relation"]}
                    rules={[{ required: true, message: "Thiếu mối quan hệ" }]}
                  >
                    <Input placeholder="Quan hệ (Bố, Mẹ,...)" />
                  </Form.Item>
                  <Form.Item
                    label="Họ Tên"
                    {...restField}
                    name={[name, "name"]}
                    fieldKey={[fieldKey, "name"]}
                    rules={[{ required: true, message: "Thiếu tên" }]}
                  >
                    <Input placeholder="Tên" />
                  </Form.Item>
                  <Form.Item
                    label="Năm Sinh"
                    {...restField}
                    name={[name, "birth_year"]}
                    fieldKey={[fieldKey, "birth_year"]}
                    rules={[{ required: true, message: "Thiếu năm sinh" }]}
                  >
                    <Input placeholder="Năm sinh" />
                  </Form.Item>
                  <Form.Item
                    label="Dân tộc (Không bắt buộc)"
                    {...restField}
                    name={[name, "ethnicity"]}
                    fieldKey={[fieldKey, "ethnicity"]}
                  >
                    <Input placeholder="Dân tộc" />
                  </Form.Item>
                  <Form.Item
                    label="Tôn giáo (Không bắt buộc)"
                    {...restField}
                    name={[name, "religion"]}
                    fieldKey={[fieldKey, "religion"]}
                  >
                    <Input placeholder="Tôn giáo" />
                  </Form.Item>
                  <Form.Item
                    label="Quốc tịch (Không bắt buộc)"
                    {...restField}
                    name={[name, "nationality"]}
                    fieldKey={[fieldKey, "nationality"]}
                  >
                    <Input placeholder="Quốc tịch" />
                  </Form.Item>
                  <Form.Item
                    label="Nghề nghiệp"
                    {...restField}
                    name={[name, "job"]}
                    fieldKey={[fieldKey, "job"]}
                    rules={[{ required: true, message: "Thiếu nghề nghiệp" }]}
                  >
                    <Input placeholder="Nghề nghiệp" />
                  </Form.Item>
                  <Form.Item
                    label="Cơ quan công tác (Không bắt buộc)"
                    {...restField}
                    name={[name, "organization"]}
                    fieldKey={[fieldKey, "organization"]}
                  >
                    <Input placeholder="Cơ quan công chức" />
                  </Form.Item>
                  <Form.Item
                    label="Chức vụ"
                    {...restField}
                    name={[name, "position"]}
                    fieldKey={[fieldKey, "position"]}
                    rules={[{ required: true, message: "Thiếu chức vụ" }]}
                  >
                    <Input placeholder="Chức vụ" />
                  </Form.Item>
                  <Form.Item
                    label="Số điện thoại"
                    {...restField}
                    name={[name, "phone"]}
                    fieldKey={[fieldKey, "phone"]}
                    rules={[{ required: true, message: "Thiếu số điện thoại" }]}
                  >
                    <Input placeholder="Số điện thoại" />
                  </Form.Item>
                  <Form.Item
                    label="Địa chỉ"
                    className="w-full"
                    {...restField}
                    name={[name, "address"]}
                    fieldKey={[fieldKey, "address"]}
                    rules={[{ required: true, message: "Thiếu địa chỉ" }]}
                  >
                    <Input placeholder="Địa chỉ" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  icon={<PlusOutlined />}
                >
                  Thêm Thành Viên Gia Đình
                </Button>
              </Form.Item>
            </div>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddStudent;
