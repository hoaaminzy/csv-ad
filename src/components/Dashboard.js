import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { MdOutlineTour } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { FaUserCheck } from "react-icons/fa";
import * as XLSX from "xlsx";
import { Tooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { baseUrl } from "../base/baseUrl";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { message } from "antd";
import axios from "axios";
const Dashboard = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1, // Lấy theo hàng
      });
      setData(sheetData);
    };

    reader.readAsBinaryString(file);
  };

  const [allTours, setAllTours] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [allContacts, setAllContacts] = useState([]);

  const [allUserFirebase, setAllUserFirebase] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [blogs, setBlogs] = useState([]);
  console.log(data);
  // const allUsers = async () => {
  //   try {
  //     const res = await axios.get(`${baseUrl}auth/get-all-users`);
  //     setAllUser(res.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const filterRoleUser = allUser.filter((item) => item.role !== "staff");
  const filterRoleStaff = allUser.filter((item) => item.role === "staff");

  const combineUser = [...filterRoleUser, ...allUserFirebase];

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
      <div className="p-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="mb-4"
        />
        <table className="table-auto border-collapse border border-gray-500">
          <thead>
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key} className="border border-gray-500 px-4 py-2">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td
                    key={colIndex}
                    className="border border-gray-500 px-4 py-2"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
