import React, { useState } from "react";
import { Input, Form, message, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";
const AddStaff = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    setLoading(true);

    const isStaff = true; // Set this based on your application logic, e.g., from a toggle or a specific route

    const userValues = {
      ...values,
      isStaff,
    };

    try {
      const response = await axios.post(`${baseUrl}auth/signup`, userValues);
      message.success("Đăng ký thành công!");
      form.resetFields();
    } catch (error) {
      message.error("There was an error creating the user!");
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto " }} className=" py-10">
      <HeadingPage title="Đăng ký nhân viên" />
      <div className=" justify-center items-center flex">
        <div className="flex w-full flex-col justify-center items-center gap-5">
          <div className="w-full">
            <Form
              onFinish={handleFinish}
              style={{
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
              className="bg-white p-4 w-full  flex flex-col justify-center items-center gap-4"
            >
              <div>
                <span className="uppercase text-[#276ca1] text-[28px] fw-bold">
                  Đăng ký
                </span>
              </div>
              <div className="w-full flex flex-col justify-center items-center gap-3">
                <Form.Item
                  className="w-full"
                  name="email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email" },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item
                  name="displayName"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên" },
                  ]}
                >
                  <Input placeholder="Nhập họ và tên" />
                </Form.Item>
                <Form.Item
                  name="phoneNumber"
                  className="w-full"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^\d{10,11}$/,
                      message: "Số điện thoại không hợp lệ (10-11 số)!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item className="w-full" name="address">
                  <Input placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                    { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
                <Form.Item
                  className="w-full"
                  name="confirmPassword"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password placeholder="Nhập lại mật khẩu" />
                </Form.Item>

                <button className="btn btn-primary" type="submit">
                  Đăng ký
                </button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
