import React, { useState } from "react";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  SnippetsOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FaUser } from "react-icons/fa";
import { Layout, Menu, Button, Dropdown, message } from "antd";
import { Link, useNavigate, Route, Routes } from "react-router-dom";
import AddTour from "./AddTour";
import AddInforTour from "./AddInforTour";
import AddInforTourNote from "./AddInforTourNote";
import AllBill from "./AllBill";
import AllTour from "./AllTour";
import AddBlog from "./AddBlog";
import AllUser from "./AllUser";
import AddStaff from "./AddStaff";
import AllStaff from "./AllStaff";
import AllBlog from "./AllBlog";
import logo from "../images/logo.png";
import TourList from "./TourList";
import AllSchedule from "./AllSchedule";
import Dashboard from "./Dashboard";
import AllContact from "./AllContact";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaUserCheck } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const DashboardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("role"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear the token on logout
    message.success("Logged out successfully");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  const items = [];

  // Check the user's role and populate the items array accordingly
  if (storedUser?.role === "admin") {
    items.push(
      getItem(<Link to="/dashboard">Thống kê</Link>, "1", <PieChartOutlined />),
      getItem("Quản lý tour", "sub1", <QuestionCircleOutlined />, [
        getItem(<Link to="/dashboard/addTour">Thêm tour</Link>, "3"),
        getItem(<Link to="/dashboard/allTour">Tất cả các tour</Link>, "4"),
        getItem(
          <Link to="/dashboard/addInforTourNote">Thêm thông tin lưu ý</Link>,
          "5"
        ),
        getItem(
          <Link to="/dashboard/addInforTour">Thêm thông tin tour</Link>,
          "7"
        ),
      ]),
      getItem("Người dùng", "sub2", <FaUser />, [
        getItem(
          <Link to="/dashboard/tat-ca-nguoi-dung">Tất cả người dùng</Link>,
          "6"
        ),
      ]),
      getItem("Nhân viên", "sub5", <TeamOutlined />, [
        getItem(
          <Link to="/dashboard/tat-ca-nhan-vien">Tất cả nhân viên</Link>,
          "8"
        ),
        getItem(
          <Link to="/dashboard/them-nhan-vien">Thêm nhân viên</Link>,
          "12"
        ),
        getItem(
          <Link to="/dashboard/phan-cong-nhan-vien">Phân công nhân viên</Link>,
          "16Tất cả tin tức"
        ),
      ]),
      getItem("Quản lý hóa đơn", "sub3", <FaMoneyBill />, [
        getItem(
          <Link to="/dashboard/tat-ca-hoa-don">Tất cả hóa đơn</Link>,
          "10"
        ),
      ]),
      getItem("Quản lý tin tức", "sub4", <SnippetsOutlined />, [
        getItem(<Link to="/dashboard/them-blog">Thêm tin tức</Link>, "11"),
        getItem(<Link to="/dashboard/tat-ca-blog">Tất cả tin tức</Link>, "13"),
      ]),
      getItem("Quản lý liên hệ", "sub6", <MdContactPhone />, [
        getItem(
          <Link to="/dashboard/tat-ca-lien-he">Tất cả liên hệ</Link>,
          "17"
        ),
      ])
    );
  } else if (storedUser?.role === "staff") {
    // Add staff-specific menu items if needed
    items.push(
      getItem("Quản lý lịch trình", "sub1", <SnippetsOutlined />, [
        getItem(<Link to="/dashboard/lich-trinh">Lịch trình</Link>, "11"),
      ])
      // Add more items specific to staff here
    );
  } else {
    items.push(
      getItem(<Link to="/login">Đăng nhập</Link>, "login", <UserOutlined />)
    );
  }

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        width={240}
        style={{
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          backgroundColor: "#001529",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={logo}
            style={{ width: "200px", height: "70px", objectFit: "cover" }}
            alt=""
          />
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          style={{ padding: "16px 0" }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "20px", margin: 0 }}>
            {" "}
            {storedUser.role === "admin"
              ? "Quản lý hệ thống"
              : "Thông tin nhân viên"}{" "}
          </h1>
          <Dropdown overlay={menu} placement="bottomCenter" trigger={["click"]}>
            <h1 style={{ fontSize: "20px", margin: 0 }}>
              Xin chào {storedUser?.displayName}
            </h1>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: "16px",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              padding: 24,
              height: "100vh",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route path="/addTour" element={<AddTour />} />

              <Route path="/addInforTour" element={<AddInforTour />} />
              <Route path="/addInforTourNote" element={<AddInforTourNote />} />
              <Route path="/allTour" element={<AllTour />} />
              <Route path="/tat-ca-hoa-don" element={<AllBill />} />
              <Route path="/tat-ca-nguoi-dung" element={<AllUser />} />
              <Route path="/them-nhan-vien" element={<AddStaff />} />
              <Route path="/tat-ca-nhan-vien" element={<AllStaff />} />
              <Route path="/phan-cong-nhan-vien" element={<TourList />} />

              <Route path="/them-blog" element={<AddBlog />} />
              <Route path="/tat-ca-blog" element={<AllBlog />} />

              <Route path="/lich-trinh" element={<AllSchedule />} />
              <Route path="/tat-ca-lien-he" element={<AllContact />} />
            </Routes>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#f0f2f5",
            borderTop: "1px solid #e8e8e8",
            padding: "10px 50px",
          }}
        >
          LÊ TẤN HÒA
        </Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardAdmin;
