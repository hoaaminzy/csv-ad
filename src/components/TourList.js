import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Select, Input, message } from "antd";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import HeadingPage from "./HeadingPage";

const { Option } = Select;

const TourList = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [staffId, setStaffId] = useState("");
  const [allAssignStaff, setAllAssignStaff] = useState([]);

  const [form] = Form.useForm();

  // Fetch all users (staff)
  const allUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all bookings (tours)
  const fetchTours = async () => {
    try {
      const response = await axios.get(`${baseUrl}booking/get-all-bookings`);
      setTours(response.data?.bookings);
      setLoading(false);
    } catch (err) {
      message.error("Failed to load tours");
      setLoading(false);
    }
  };
  const fetchAllAssginStaff = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}assignStaff/get-all-assignStaff`
      );
      setAllAssignStaff(response.data?.staffAssignments);
      setLoading(false);
    } catch (err) {
      message.error("Failed to load tours");
      setLoading(false);
    }
  };

  useEffect(() => {
    allUsers();
    fetchTours();
    fetchAllAssginStaff();
  }, []);

  // Handle staff selection and set staffId
  const handleStaffChange = (value) => {
    const selectedStaff = allUser.find((staff) => staff.displayName === value);
    if (selectedStaff) {
      form.setFieldsValue({
        staffId: selectedStaff._id,
        staffName: selectedStaff.displayName,
      });
      setStaffId(selectedStaff._id);
    }
  };

  const handleAssignStaff = (tour) => {
    if (tour && Array.isArray(tour.tourDetail) && tour.tourDetail.length > 0) {
      setSelectedTour(tour);
      setIsModalVisible(true);
    } else {
      message.error("Tour details not available for this booking.");
    }
  };

  // Handle view details of the tour
  const handleViewDetails = (detail) => {
    setSelectedDetail(detail);
    setIsDetailModalVisible(true);
  };

  // Submit the selected staff for the tour
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (selectedTour && selectedTour.tourDetail[0]) {
        const payload = {
          staffId: values.staffId,
          staffName: values.staffName,
          tourId: selectedTour.tourId,
          tourDetailId: selectedTour.tourDetail[0]._id, // Ensure tourDetail exists
        };

        // Gọi API để gán nhân viên mới
        await axios.post(`${baseUrl}assignStaff/assignStaff`, payload);
        message.success("Phân công nhân viên thành công");

        // Sau khi gán nhân viên thành công, tải lại dữ liệu tours và gán nhân viên
        fetchTours();
        fetchAllAssginStaff();

        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error("Tour details are missing. Cannot assign staff.");
      }
    } catch (err) {
      message.error("Failed to reassign staff");
    }
  };

  const handleUnassignStaff = async (tour) => {
    try {
      // Lấy thông tin nhân viên đã gán cho tour này
      const assignedStaff = allAssignStaff.find(
        (assignment) =>
          assignment.tourId === tour.tourId &&
          assignment.tourDetailId === tour.tourDetail[0]._id
      );

      if (assignedStaff) {
        // Tạo payload để hủy nhân viên
        const payload = {
          tourId: tour.tourId,
          tourDetailId: tour.tourDetail[0]._id,
          staffId: assignedStaff.staffId,
        };

        // Gọi API để hủy chọn nhân viên
        await axios.post(`${baseUrl}assignStaff/unassignStaff`, payload);
        message.success("Hủy chọn nhân viên thành công");

        // Sau khi hủy chọn nhân viên, tải lại dữ liệu tours và gán nhân viên
        fetchTours();
        fetchAllAssginStaff();
      } else {
        message.error("Không tìm thấy nhân viên để hủy chọn");
      }
    } catch (err) {
      message.error("Hủy chọn nhân viên thất bại");
    }
  };

  // Close modals
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailModalVisible(false);
  };

  // Define table columns
  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Tour ID",
      dataIndex: "tourId",
      key: "tourId",
    },
    {
      title: "Tên",
      dataIndex: ["detail", "0", "tourInfor", "0", "title"],
      key: "ten",
    },
    {
      title: "Điểm bắt đầu",
      dataIndex: ["detail", "0", "tourInfor", "0", "city"],
      key: "dbd",
    },
    {
      title: "Điểm kết thúc",
      dataIndex: ["detail", "0", "tourInfor", "0", "endCity"],
      key: "dkt",
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: ["tourDetail", "0", "time", "startDate"],
      key: "startDate",
    },
    {
      title: "Điểm kết thúc",
      dataIndex: ["tourDetail", "0", "time", "endDate"],
      key: "endDate",
    },
    {
      title: "Tên nhân viên",
      key: "staffName",
      render: (tour) => {
        // Tìm thông tin nhân viên đã gán cho tour này từ `allAssignStaff`
        const assignedStaff = allAssignStaff.find(
          (assignment) =>
            assignment.tourId === tour.tourId &&
            assignment.tourDetailId === tour.tourDetail[0]._id
        );
        return assignedStaff ? (
          <strong>{assignedStaff.staffName}</strong>
        ) : (
          <span className="" style={{ color: "red" }}>
            Chưa có nhân viên đảm nhận
          </span>
        );
      },
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (tour) => (
        <div className="d-flex gap-3">
          <Button type="primary" onClick={() => handleAssignStaff(tour)}>
            Chọn nhân viên
          </Button>
          {/* Hiển thị nút "Hủy chọn" nếu đã có nhân viên được gán */}
          {allAssignStaff.some(
            (assignment) =>
              assignment.tourId === tour.tourId &&
              assignment.tourDetailId === tour.tourDetail[0]._id
          ) && (
            <Button danger onClick={() => handleUnassignStaff(tour)}>
              Hủy chọn
            </Button>
          )}
          <Button onClick={() => handleViewDetails(tour.detail)}>
            Xem chi tiết
          </Button>
        </div>
      ),
    },
  ];
  const filterTourSuccess = tours.filter(
    (item) => item.status === "Thanh toán thành công"
  );

  const groupedData = filterTourSuccess.reduce((acc, curr) => {
    const {
      tourId,
      tourDetail,
      address,
      bookingId,
      email,
      fullName,
      messageContent,
      passengers,
      payment,
      phone,
      status,
      selectedPayment,
      totalPrice,
      tourInfor,
    } = curr;

    const tourDetailId = tourDetail[0]._id;
    const existingGroup = acc.find(
      (item) =>
        item.tourId === tourId && item.tourDetail[0]._id === tourDetailId
    );

    if (existingGroup) {
      existingGroup.detail.push({
        address,
        bookingId,
        email,
        fullName,
        messageContent,
        passengers,
        status,
        payment,
        phone,
        selectedPayment,
        totalPrice,
        tourInfor,
      });
    } else {
      acc.push({
        tourId,
        tourDetail,
        detail: [
          {
            address,
            bookingId,
            email,
            fullName,
            messageContent,
            passengers,
            payment,
            phone,
            status,
            selectedPayment,
            totalPrice,
            tourInfor,
          },
        ],
      });
    }

    return acc;
  }, []);

  const filterRoleUser = allUser.filter((item) => item.role === "staff");
  return (
    <div>
      <HeadingPage title="Phân công nhân viên" />
      <Table columns={columns} dataSource={groupedData} loading={loading} />

      {/* Assign Staff Modal */}
      <Modal
        title="Assign Staff"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <Form form={form} layout="vertical">
          {/* Staff ID - Auto-filled */}
          <Form.Item
            name="staffId"
            label="ID nhân viên"
            rules={[{ required: true, message: "ID nhân viên" }]}
          >
            <Input placeholder={staffId} disabled />{" "}
            {/* Disabled, since this field is auto-filled */}
          </Form.Item>

          {/* Staff Name - Select with options */}
          <Form.Item
            name="staffName"
            label="Tên nhân viên"
            rules={[{ required: true, message: "Vui lòng chọn tên nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên" onChange={handleStaffChange}>
              {filterRoleUser.map((staff) => {
                const isAssigned = allAssignStaff.some(
                  (assignment) => assignment.staffId === staff._id
                );
                return (
                  <Option
                    key={staff._id}
                    value={staff.displayName}
                    disabled={isAssigned}
                  >
                    {staff.displayName}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="Danh sách"
        visible={isDetailModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {selectedDetail.length > 0 ? (
          <div>
            {selectedDetail.map((detailItem, index) => (
              <div key={index}>
                <p>
                  <strong>Full Name:</strong> {detailItem.fullName}
                </p>
                <p>
                  <strong>Email:</strong> {detailItem.email}
                </p>
                <p>
                  <strong>Phone:</strong> {detailItem.phone}
                </p>
                <p>
                  <strong>Total Price:</strong> {detailItem.totalPrice}
                </p>
                <p>
                  <strong>Selected Payment:</strong>{" "}
                  {detailItem.selectedPayment}
                </p>
                <p>
                  <strong>Passengers:</strong>
                  {`Người lớn: ${detailItem.passengers.slotAdult}, 
                  Trẻ em: ${detailItem.passengers.slotChildren}, 
                  Em bé: ${detailItem.passengers.slotBaby}`}
                </p>
                <hr />
              </div>
            ))}
          </div>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>
    </div>
  );
};

export default TourList;
