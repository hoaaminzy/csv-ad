import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../base/baseUrl";
import logom from "../images/logo.png";
import { useEffect } from "react";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}auth/login-admin`, values); // Replace with your API URL
      const { token, user } = response.data;
      // Role-based navigation
      if (user.role === "admin" || user.role === "staff") {
        // Store the token only if the role is authorized
        localStorage.setItem("token", token);
        localStorage.setItem("role", JSON.stringify(user));

        message.success(`Welcome ${user.role}`);
        navigate("/dashboard");
      } else {
        message.error("Unauthorized role.");
      }
    } catch (error) {
      message.error("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener to track resize
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="d-flex  justify-content-center items-center "
      style={{ height: "100%" }}
    >
      <div className="">
        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-center items-center">
            <img
              src={logom}
              style={{ width: "400px", objectFit: "cover", height: "auto" }}
              alt=""
            />
          </div>
        </div>
        <div style={{ flex: 1, padding: 20 }}>
          <h2 style={{ textAlign: "center", color: "white" }}>
            Đăng nhập cho quản trị và nhân viên
          </h2>
          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Email chưa hợp lệ!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
                size="large"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
