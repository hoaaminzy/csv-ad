import React, { useState, useEffect } from "react";
import { Form, Select, Input, Button, message, notification } from "antd";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";

const { TextArea } = Input;

const AddInforTourNote = () => {
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
        `${baseUrl}inforTourNote/add-infor-tour-note`,
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
      <HeadingPage title="Thông tin lưu ý tour" />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          titleTour: "",
          tourPriceIncluded: "",
          tourPriceNotIncluded: "",
          notePriceChildren: "",
          paymentConditions: "",
          registerConditions: "",
          noteTransferCancellation: "",
          tourCancelWeekdays: "",
          tourCancelHolidays: "",
          forceMajeureReasons: "",
          contact: "",
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
          name="tourPriceIncluded"
          label="Giá tour bao gồm"
          rules={[
            {
              required: true,
              message: "Please input the tour price included!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="tourPriceNotIncluded"
          label="Giá tour không bao gồm"
          rules={[
            {
              required: true,
              message: "Please input the tour price not included!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="notePriceChildren"
          label="Lưu ý giá trẻ em"
          rules={[
            {
              required: true,
              message: "Please input the note on price for children!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="paymentConditions"
          label="Điều kiện thanh toán"
          rules={[
            { required: true, message: "Please input the payment conditions!" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="registerConditions"
          label="Điều kiện đăng ký"
          rules={[
            {
              required: true,
              message: "Please input the registration conditions!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="noteTransferCancellation"
          label="Lưu ý về chuyển hoặc hủy tour"
          rules={[
            {
              required: true,
              message: "Please input the note on transfer cancellation!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="tourCancelWeekdays"
          label="Điều kiện hủy tour đối với ngày thường"
          rules={[
            {
              required: true,
              message: "Please input the tour cancellation on weekdays!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="tourCancelHolidays"
          label="Điều kiện hủy tour đối với ngày lễ, tết"
          rules={[
            {
              required: true,
              message: "Please input the tour cancellation on holidays!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="forceMajeureReasons"
          label="Trường hợp bất khả kháng"
          rules={[
            {
              required: true,
              message: "Please input the force majeure reasons!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="contact"
          label="Liên hệ"
          rules={[
            {
              required: true,
              message: "Please input the contact information!",
            },
          ]}
        >
          <Input />
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

export default AddInforTourNote;
