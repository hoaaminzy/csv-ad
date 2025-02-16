import React, { useState, useEffect } from "react";
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
import AllBill from "./AllBill";
import AddBlog from "./AddBlog";
import AllUser from "./AllUser";
import AllStaff from "./AllStaff";
import AllBlog from "./AllBlog";
import logo from "../images/logo.png";
import Dashboard from "./Dashboard";
import AllContact from "./AllContact";
import { FaMoneyBill } from "react-icons/fa";
import AddDepartment from "./AddDepartment";
import AllDepartment from "./AllDepartment";
import CreateSchoolYear from "./CreateSchoolYear";
import AddStudent from "./AddStudent";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import GradeTable from "./GradeTable";
import CreateClass from "./CreateClass";
import AddCourse from "./AddCourse";
import FormUpload from "./FormUpload";
import CreateSchedule from "./CreateSchedule";
import CourseRegistration from "./CourseRegistration";
import { AiOutlineSchedule } from "react-icons/ai";
import { CiCalendar } from "react-icons/ci";
import { FaBook } from "react-icons/fa";
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
  const maLop = [
    {
      maLop: "20CT1",
    },
    {
      maLop: "20CT2",
    },
    {
      maLop: "IT0103",
    },
  ];
  const [departments, setDepartments] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [schedule, setSchedule] = useState([]);

  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("role"));
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); // Clear the token on logout
    message.success("Logged out successfully");
    navigate("/login");
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get(`${baseUrl}classes/get-all-class`);
      setClasses(response.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/courses/get-all-course"
      );
      setAllCourses(res.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchSchedule = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/schedule/get-all-schedule"
      );
      setSchedule(res.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}department/get-all-departments`
      );
      setDepartments(response.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${baseUrl}auth/get-all-users`);
      setUsers(response.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  const fetchSchoolYears = async () => {
    try {
      const response = await axios.get(`${baseUrl}schoolyears/get-all-school`);
      setSchoolYears(response.data);
    } catch (error) {
      console.log("Lỗi khi tải dữ liệu!");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSchoolYears();
    fetchClasses();
    fetchCourses();
    fetchUsers();
    fetchSchedule();
  }, []);

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
      getItem("Quản lý sinh viên", "sub1", <QuestionCircleOutlined />, [
        getItem(
          <Link to="/dashboard/them-sinh-vien">Tạo thông tin sinh viên</Link>,
          "3"
        ),
        // getItem(
        //   <Link to="/dashboard/tat-ca-sinh-vien">Tất cả các sinh viên</Link>,
        //   "4"
        // ),
        // getItem(
        //   <Link to="/dashboard/addInforTourNote">Thêm thông tin lưu ý</Link>,
        //   "5"
        // ),
        // getItem(
        //   <Link to="/dashboard/addInforTour">Thêm thông tin tour</Link>,
        //   "7"
        // ),
      ]),
      getItem("Quản lý năm học", "sub2", <FaUser />, [
        getItem(
          <Link to="/dashboard/danh-sach-nam-hoc">Danh sách năm học</Link>,
          "6"
        ),
      ]),
      getItem("Quản lý giảng viên", "sub5", <TeamOutlined />, [
        getItem(
          <Link to="/dashboard/danh-sach-giang-vien">Tất cả giảng viên</Link>,
          "8"
        ),

        getItem(
          <Link to="/dashboard/phan-cong-nhan-vien">Phân công giảng viên</Link>,
          "16"
        ),
      ]),
      getItem("Quản lý khoa - ngành - lớp", "sub3", <FaMoneyBill />, [
        getItem(
          <Link to="/dashboard/tat-ca-khoa-nganh">Tất cả Khoa - Ngành</Link>,
          "11"
        ),
        getItem(<Link to="/dashboard/quan-ly-lop-hoc">Tất cả Lớp</Link>, "7"),
      ]),
      getItem("Quản lý môn học", "sub4", <AiOutlineSchedule />, [
        getItem(
          <Link to="/dashboard/quan-ly-bai-hoc">Tất cả môn học</Link>,
          "20"
        ),
      ]),
      getItem("Quản lý biểu mẫu", "sub7", <FaBook />, [
        getItem(
          <Link to="/dashboard/tat-ca-bieu-mau">Quản lý biểu mẫu</Link>,
          "21"
        ),
      ]),
      getItem("Quản lý lịch học", "sub8", <CiCalendar />, [
        getItem(
          <Link to="/dashboard/quan-ly-lich-hoc">Quản lý lịch học</Link>,
          "22"
        ),
        getItem(<Link to="/dashboard/mo-dang-ky">Mở đăng ký</Link>, "23"),
      ])
      // getItem("Quản lý tin tức", "sub4", <SnippetsOutlined />, [
      //   getItem(<Link to="/dashboard/them-blog">Thêm tin tức</Link>, "11"),
      //   getItem(<Link to="/dashboard/tat-ca-blog">Tất cả tin tức</Link>, "13"),
      // ]),
      // getItem("Quản lý liên hệ", "sub6", <MdContactPhone />, [
      //   getItem(
      //     <Link to="/dashboard/tat-ca-lien-he">Tất cả liên hệ</Link>,
      //     "17"
      //   ),
      // ])
    );
  } else if (storedUser?.role === "teacher") {
    // Add staff-specific menu items if needed
    items.push(
      getItem(
        "Quản lý lịch học",
        "sub1",
        <SnippetsOutlined />,
        maLop.map((item, index) =>
          getItem(
            <Link to={`/dashboard/danh-sach/${item.maLop}`}>
              Danh sách lớp {item.maLop}
            </Link>,
            `sub1-${index}` // Generate unique keys
          )
        )
      )
    );
  } else {
    items.push(
      getItem(<Link to="/login">Đăng nhập</Link>, "login", <UserOutlined />)
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", height: "max-content" }}>
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
              height: "100%",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />

              <Route
                path="/them-sinh-vien"
                element={
                  <AddStudent
                    schoolYears={schoolYears}
                    departments={departments}
                    classes={classes}
                  />
                }
              />

              <Route path="/tat-ca-hoa-don" element={<AllBill />} />
              <Route path="/tat-ca-nguoi-dung" element={<AllUser />} />
              <Route path="/danh-sach-giang-vien" element={<AllStaff />} />
              <Route path="/tat-ca-khoa-nganh" element={<AllDepartment />} />

              <Route path="/them-blog" element={<AddBlog />} />
              <Route path="/tat-ca-blog" element={<AllBlog />} />
              <Route path="/danh-sach-nam-hoc" element={<CreateSchoolYear />} />
              <Route
                path="/quan-ly-bai-hoc"
                element={
                  <AddCourse
                    schoolYears={schoolYears}
                    departments={departments}
                    classes={classes}
                    users={users}
                  />
                }
              />

              <Route path="/tat-ca-lien-he" element={<AllContact />} />
              <Route path="/tat-ca-bieu-mau" element={<FormUpload />} />
              <Route path="/mo-dang-ky" element={<CourseRegistration />} />

              <Route
                path="/quan-ly-lich-hoc"
                element={
                  <CreateSchedule
                    schoolYears={schoolYears}
                    departments={departments}
                    classes={classes}
                    allCourses={allCourses}
                    schedules={schedule}
                  />
                }
              />

              <Route path="/danh-sach/:maLop" element={<GradeTable />} />
              <Route
                path="/quan-ly-lop-hoc"
                element={
                  <CreateClass
                    schoolYears={schoolYears}
                    departments={departments}
                  />
                }
              />
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
