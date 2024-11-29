import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { MdOutlineTour } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaUserCheck } from "react-icons/fa";

import { Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { baseUrl } from "../base/baseUrl";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { message } from "antd";
import axios from "axios";
const Dashboard = () => {
  const pieData = [
    { name: "A", value: 400 },
    { name: "B", value: 300 },
    { name: "C", value: 300 },
    { name: "D", value: 200 },
  ];

  const [allTours, setAllTours] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [allContacts, setAllContacts] = useState([]);

  const [allUserFirebase, setAllUserFirebase] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const getAllBookings = async () => {
    try {
      const response = await axios.get(`${baseUrl}booking/get-all-bookings`);
      const bookings = response?.data?.bookings;
      setAllBookings(bookings);
    } catch (error) {
      throw error;
    }
  };
  const allUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllContact = async () => {
    try {
      const res = await axios.get(`${baseUrl}contacts/get-all-contact`);
      setAllContacts(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(allContacts)

  const getAllUsers = async () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const userList = usersSnapshot.docs.map((doc) => doc.data());
      setAllUserFirebase(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
      return []; // Return an empty array or handle the error as needed
    }
  };
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

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${baseUrl}blogs/get-all-blogs`);
      setBlogs(res.data);
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch blogs.");
    }
  };

  const filterRoleUser = allUser.filter((item) => item.role !== "staff");
  const filterRoleStaff = allUser.filter((item) => item.role === "staff");

  const combineUser = [...filterRoleUser, ...allUserFirebase];
  useEffect(() => {
    allUsers();
    getAllUsers();
    getAllTours();
    getAllBookings();
    fetchBlogs();
    getAllContact();
  }, []);

  return (
    <div className="h-[300px]">
      <Row className="h-full">
        <Col sm={4} className="h-full">
          <div className="flex flex-col h-full gap-3">
            <div className="flex text-white items-start justify-between bg-red-500 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng số lượng TOUR</span>
                <span className="text-[30px] fw-bold">{allTours.length}</span>
              </div>
              <MdOutlineTour className="text-[30px]" />
            </div>
            <div className="flex text-white items-start justify-between bg-yellow-500 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng số lượng người dùng</span>
                <span className="text-[30px] fw-bold">
                  {combineUser.length}
                </span>
              </div>
              <FaUser className="text-[30px]" />
            </div>
          </div>
        </Col>
        <Col sm={4} className="h-full">
          <div className="flex flex-col h-full gap-3">
            <div className="flex text-white items-start justify-between bg-green-500 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng hóa đơn đặt tour</span>
                <span className="text-[30px] fw-bold">
                  {allBookings.length}
                </span>
              </div>
              <FaMoneyBill className="text-[30px]" />
            </div>
            <div className="flex text-white items-start justify-between bg-blue-500 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng số lượng tin tức</span>
                <span className="text-[30px] fw-bold">{blogs.length}</span>
              </div>
              <HiOutlineInformationCircle className="text-[30px]" />
            </div>
          </div>
        </Col>
        <Col sm={4} className="h-full">
          <div className="flex flex-col h-full gap-3">
            <div className="flex text-white items-start justify-between bg-violet-600 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng hóa đơn nhân viên</span>
                <span className="text-[30px] fw-bold">
                  {filterRoleStaff.length}
                </span>
              </div>
              <FaUserCheck className="text-[30px]" />
            </div>
            <div className="flex text-white items-start justify-between bg-pink-500 h-full rounded-xl p-3">
              <div className="flex flex-col">
                <span className="fw-bold">Tổng số lượng liên hệ</span>
                <span className="text-[30px] fw-bold">
                  {allContacts.length}
                </span>
              </div>
              <MdContactPhone className="text-[30px]" />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
