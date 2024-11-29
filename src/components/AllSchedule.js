import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../base/baseUrl";
import { message, Table, Button, Popconfirm, Space } from "antd";
import HeadingPage from "./HeadingPage";
const AllSchedule = () => {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allAssignStaff, setAllAssignStaff] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("role"));
  console.log("storedUser", storedUser);

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
  const allUsers = async () => {
    try {
      const res = await axios.get(`${baseUrl}auth/get-all-users`);
      setAllUser(res.data);
    } catch (error) {
      console.log(error);
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
    fetchTours();
    allUsers();
    fetchAllAssginStaff();
  }, []);

  const filterStaff = allUser.filter((item) => item.role === "staff");

  const findStaff = filterStaff.find(
    (item) => item.displayName === storedUser.displayName
  );

  const filterScheduleStaff = allAssignStaff.find(
    (item) => item?.staffId === findStaff?._id
  );

  console.log(filterScheduleStaff);

  const filterTour = tours.find(
    (item) =>
      item?.tourId === filterScheduleStaff?.tourId &&
      item?.tourDetail[0]._id === filterScheduleStaff?.tourDetailId
  );
  const tableData = [
    { key: "_id", field: "Mã lịch trình", value: filterTour?._id },
    { key: "tourId", field: "Mã tour", value: filterTour?.tourId },
    { key: "bookingId", field: "Mã booking", value: filterTour?.bookingId },
    { key: "fullName", field: "Họ và tên", value: filterTour?.fullName },
    { key: "phone", field: "Số điện thoại", value: filterTour?.phone },
    { key: "email", field: "Email", value: filterTour?.email },
    { key: "address", field: "Địa chỉ", value: filterTour?.address },
    {
      key: "passengers.slotBaby",
      field: "Em bé",
      value: filterTour?.passengers.slotBaby,
    },
    {
      key: "passengers.slotChildren",
      field: "Trẻ em",
      value: filterTour?.passengers.slotChildren,
    },
    {
      key: "passengers.slotAdult",
      field: "Người lớn",
      value: filterTour?.passengers.slotAdult,
    },

    {
      key: "tourDetail.price.price",
      field: "Giá người lớn",
      value: filterTour?.tourDetail[0].price.price,
    },
    {
      key: "tourDetail.price.priceBaby",
      field: "Giá em bé",
      value: filterTour?.tourDetail[0].price.priceBaby,
    },
    {
      key: "tourDetail.price.priceChildren",
      field: "Giá trẻ em",
      value: filterTour?.tourDetail[0].price.priceChildren,
    },
    {
      key: "tourDetail.time.startDate",
      field: "Ngày bắt đầu",
      value: filterTour?.tourDetail[0].time.startDate,
    },
    {
      key: "tourDetail.time.endDate",
      field: "Ngày kết thúc",
      value: filterTour?.tourDetail[0].time.endDate,
    },
    {
      key: "tourDetail.fightTime.startTime",
      field: "Thời gian bắt đầu bay đi ",
      value: filterTour?.tourDetail[0].fightTime.startTime,
    },
    {
      key: "tourDetail.fightTime.endTime",
      field: "Thời gian kết thúc bay đi ",
      value: filterTour?.tourDetail[0].fightTime.endTime,
    },
    {
      key: "tourDetail.fightBackTime.startBackTime",
      field: "Thời gian bắt đầu bay về",
      value: filterTour?.tourDetail[0].fightBackTime.startBackTime,
    },
    {
      key: "tourDetail.fightBackTime.endBackTime",
      field: "Thời gian kết thúc bay về",
      value: filterTour?.tourDetail[0].fightBackTime.endBackTime,
    },

    {
      key: "tourInfor.title",
      field: "Tên tour",
      value: filterTour?.tourInfor[0].title,
    },

    {
      key: "tourInfor.city",
      field: "Nơi bắt đầu",
      value: filterTour?.tourInfor[0].city,
    },
    {
      key: "tourInfor.endCity",
      field: "Nơi kết thúc",
      value: filterTour?.tourInfor[0].endCity,
    },
    {
      key: "tourInfor.inforTourDetail[0].price.price",
      field: "Giá tiền người lớn",
      value: filterTour?.tourInfor[0].inforTourDetail[0].price.price,
    },
    {
      key: "tourInfor.inforTourDetail[0].price.priceBaby",
      field: "Giá tiền em bé",
      value: filterTour?.tourInfor[0].inforTourDetail[0].price.priceBaby,
    },
    {
      key: "tourInfor.inforTourDetail[0].price.priceChildren",
      field: "Gía tiền trẻ em",
      value: filterTour?.tourInfor[0].inforTourDetail[0].price.priceChildren,
    },
    {
      key: "tourInfor.vehicle",
      field: "Phương tiện di chuyển",
      value: filterTour?.tourInfor[0].vehicle,
    },
    {
      key: "tourInfor.hotel",
      field: "Khách sạn",
      value: filterTour?.tourInfor[0].hotel,
    },
    {
      key: "tourInfor.typeCombo",
      field: "Loại hình combo",
      value: filterTour?.tourInfor[0].typeCombo,
    },
    {
      key: "tourInfor.combo",
      field: "Combo",
      value: filterTour?.tourInfor[0].combo === true ? "Có" : "Không",
    },
    {
      key: "selectedPayment",
      field: "Hình thức thanh toán",
      value: filterTour?.selectedPayment,
    },
    { key: "totalPrice", field: "totalPrice", value: filterTour?.totalPrice },
    {
      key: "messageContent",
      field: "Nội dung ghi chú",
      value: filterTour?.messageContent,
    },
    { key: "status", field: "Trạng thái", value: filterTour?.status },
    {
      key: "payment",
      field: "Thanh toán",
      value: filterTour?.payment.join(", "),
    },
  ];

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => index + 1, // Displays the row number
    },
    { title: "Tên", dataIndex: "field", key: "field" },
    { title: "Chi tiết", dataIndex: "value", key: "value" },
  ];

  console.log(filterTour);

  const handleToggleStatus = async (newStatus) => {
    try {
      const res = await axios.put(
        `${baseUrl}booking/update-bookinged-status/${filterTour?._id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );

      message.success(
        newStatus === "Đã hoàn thành tour"
          ? "Tour đã hoàn thành"
          : newStatus === "Đang hoạt động"
          ? "Đã xác nhận thành công"
          : "Đã hủy xác nhận, chờ xác nhận lại"
      );
      setTours((prevTours) =>
        prevTours.map((tour) =>
          tour._id === filterTour?._id ? { ...tour, status: newStatus } : tour
        )
      );

      if (newStatus === "Đã hoàn thành tour") {
        setIsLoading(true);
        const payloadHis = { HSA: filterTour, staff: findStaff };
        try {
          const response = await axios.post(
            `${baseUrl}assignStaff/history-staff`,
            payloadHis
          );
          console.log("Kết quả trả về:", response.data);
        } catch (error) {
          console.error("Lỗi khi gửi request:", error);
        }
        setTimeout(async () => {
          const payload = {
            tourId: filterScheduleStaff?.tourId,
            tourDetailId: filterScheduleStaff?.tourDetailId,
            staffId: filterScheduleStaff?.staffId,
          };
          try {
            const response = await axios.post(
              `${baseUrl}assignStaff/unassignStaff`,
              payload
            );
            console.log("Kết quả trả về:", response.data);
          } catch (error) {
            console.error("Lỗi khi gửi request:", error);
          } finally {
            setIsLoading(false); // Tắt trạng thái loading
          }
          window.location.reload();
        }, 2000); // Chờ 3 giây trước khi gửi request
      }
    } catch (error) {
      console.log(error);
      message.error("Có lỗi xảy ra");
    }
  };
  return (
    <div style={{ paddingBottom: "50px" }}>
      <HeadingPage title="Bảng lịch trình" />
      <div className="d-flex gap-3" style={{ flexDirection: "column" }}>
        <strong>Thông tin nhân viên</strong>
        <div className="d-flex gap-2" style={{ flexDirection: "column" }}>
          <span>Mã nhân viên : {findStaff?._id}</span>
          <span>Họ tên : {findStaff?.displayName}</span>
          <span>Email : {findStaff?.email}</span>
          <span>Số điện thoại : {findStaff?.phoneNumber}</span>
        </div>
        <strong>Thông tin lịch trình</strong>
        {!filterTour ? (
          <span className="fw-bold text-red-500">
            Hiện tại bạn chưa có lịch trình mới. Vui lòng chờ đợi !
          </span>
        ) : (
          <>
            <Table
              dataSource={tableData}
              columns={columns}
              pagination={false}
              rowKey="key"
              bordered
              size="small"
            />
            <div className="d-flex gap-2 align-items-center">
              <strong>Xác nhận lịch trình</strong>
              {filterTour?.status === "Đang hoạt động" ? (
                <>
                  <Button
                    onClick={() => handleToggleStatus("Hủy xác nhận")}
                    className=" btn-secondary"
                  >
                    Hủy xác nhận
                  </Button>

                  <Space size="middle">
                    <Popconfirm
                      title="Sau khi hoàn thành tour, lịch trình tour này sẽ bị mất đi để chờ lịch trình mới. Bạn có thể vào lịch sử lịch trình của mình để xem lại"
                      onConfirm={() => handleToggleStatus("Đã hoàn thành tour")}
                      okText="Có"
                      cancelText="Không"
                    >
                      <Button type="primary" danger>
                        Đã hoàn thành tour
                      </Button>
                    </Popconfirm>
                  </Space>
                  {/* <button
                    onClick={() => handleToggleStatus("Đã hoàn thành tour")}
                    className="btn btn-success"
                  >
                    Đã hoàn thành tour
                  </button> */}
                </>
              ) : filterTour?.status === "Đã hoàn thành tour" ? (
                <span
                  style={{ color: "red", fontWeight: "bold", size: "24px" }}
                >
                  Tour đã kết thúc
                </span>
              ) : (
                <Button onClick={() => handleToggleStatus("Đang hoạt động")}>
                  Xác nhận
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllSchedule;
