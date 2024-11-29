import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";

const AddInforTour = () => {
  const [form] = Form.useForm();
  const { Option } = Select;

  const [allTours, setAllTours] = useState([]);

  useEffect(() => {
    const getAllTours = async () => {
      try {
        const response = await axios.get(`${baseUrl}tour/get-all-tours`);
        const tours = response?.data?.tours;
        setAllTours(tours);
        console.log("Tours fetched successfully:", tours);
        return tours;
      } catch (error) {
        console.error("Error fetching tours:", error);
        throw error;
      }
    };
    getAllTours();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        `${baseUrl}inforTour/add-infor-tour`,
        values
      );
      message.success("Tour information submitted successfully!");
      form.resetFields();
    } catch (error) {
      message.error("Failed to submit tour information.");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <HeadingPage title="Thông tin về tour" />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          titleTour: "",
          sightseeingSpot: "",
          cuisine: "",
          suitable: "",
          idealTime: "",
          vehicle: "",
          endow: "",
        }}
      >
        <Form.Item
          label="Tên Tour"
          name="titleTour"
          rules={[{ required: true, message: "Vui lòng chọn tên tour!" }]}
        >
          <Select placeholder="Chọn tên tour">
            {allTours.map((tour) => (
              <Option key={tour.code} value={tour.title}>
                {tour.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Điểm thăm quan"
          name="sightseeingSpot"
          rules={[
            { required: true, message: "Please enter sightseeing spot!" },
          ]}
        >
          <Input placeholder="Điểm thăm quan" />
        </Form.Item>

        <Form.Item
          label="Ẩm thực"
          name="cuisine"
          rules={[{ required: true, message: "Please enter the cuisine!" }]}
        >
          <Input placeholder="Ẩm thực" />
        </Form.Item>

        <Form.Item
          label="Đối tượng thích hợp"
          name="suitable"
          rules={[
            { required: true, message: "Please enter suitable audience!" },
          ]}
        >
          <Input placeholder="Đối tượng thích hợp" />
        </Form.Item>

        <Form.Item
          label="Thời gian lý tưởng"
          name="idealTime"
          rules={[{ required: true, message: "Please enter the ideal time!" }]}
        >
          <Input placeholder="Thời gian lý tưởng" />
        </Form.Item>

        <Form.Item
          label="Phương tiện"
          name="vehicle"
          rules={[{ required: true, message: "Please enter the vehicle!" }]}
        >
          <Input placeholder="Phương tiện" />
        </Form.Item>

        <Form.Item
          label="Ưu đãi"
          name="endow"
          rules={[
            { required: true, message: "Please enter endow information!" },
          ]}
        >
          <Input placeholder="Ưu đãi" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddInforTour;
