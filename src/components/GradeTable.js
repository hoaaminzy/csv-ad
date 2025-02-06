import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";
import HeadingPage from "./HeadingPage";

const GradeTable = () => {
  const { maLop } = useParams();
  const [dataMember, setDataMember] = useState({ members: [] });
  const [data, setData] = useState({ members: [] });

  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);
  const [classInfo, setClassInfo] = useState({});

  useEffect(() => {
    const fetchDataByClass = async () => {
      setLoading(true); // Bắt đầu loading
      setNoData(false); // Reset trạng thái noData
      try {
        const response = await axios.get(
          `http://localhost:8080/api/points/point/${maLop}`
        );
        if (response?.status === 200 && response.data.members.length > 0) {
          setDataMember(response.data);
          setData({ members: response.data.members }); // Gán dữ liệu nếu có
        } else {
          setNoData(true); // Không có dữ liệu
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setNoData(true); // Không có dữ liệu
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchDataByClass();
  }, [maLop]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0]; // Chọn sheet đầu tiên
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1, // Lấy theo hàng
      });

      if (sheetData.length < 7) {
        alert("Dữ liệu phải có ít nhất 7 hàng.");
        return;
      }

      const filteredJsonData = sheetData.filter((item) => item.length > 0);

      const formattedData = convertToObject(filteredJsonData);
      saveToDatabase(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  const convertToObject = (data) => {
    // if (!Array.isArray(data) || data.length < 7) {
    //   throw new Error(
    //     "Invalid data format: Data must contain at least 7 rows."
    //   );
    // }

    const toCamelCase = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, " ")
        .trim()
        .split(" ")
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

    const result = {};
    const members = [];
    const headers = Array.isArray(data[7]) ? data[7].map(toCamelCase) : [];
    console.log(data);
    data.forEach((row, index) => {
      if (index < 7) {
        if (row.length >= 2) {
          result[toCamelCase(row[0])] = row[1];
        }
      } else if (index > 7 && Array.isArray(row)) {
        const member = {};
        row.forEach((value, i) => {
          member[headers[i]] = value;
        });
        members.push(member);
      }
    });

    result.members = members;
    return result;
  };

  const saveToDatabase = async (formattedData) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/points/point/create", // URL API để lưu dữ liệu
        formattedData
      );
      console.log(formattedData);

      if (response.status === 200) {
        alert("Dữ liệu đã được lưu thành công!");
        setData(formattedData);
        window.location.reload();
      } else {
        alert("Lỗi khi lưu dữ liệu: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu:", error);
      alert("Có lỗi xảy ra khi lưu dữ liệu.");
    }
  };

  const handleInputChange = (e, index, field) => {
    const updatedData = [...data.members];

    // Ensure the member exists at the specified index
    if (!updatedData[index]) {
      // If the member does not exist, create a new object with default values
      updatedData[index] = {
        mssv: "",
        tNThNhViN: "",
        kttx: 0,
        nttd: 0,
        giuaKy: 0,
        thucHanh: 0,
        cuoiKy: 0,
        tongKet: 0,
      };
    }

    // Update the field value for the specific member
    updatedData[index][field] = parseFloat(e.target.value) || 0;

    // Recalculate the total score (adjust according to your business logic)
    const { kttx, nttd, giuaKy, thucHanh, cuoiKy } = updatedData[index];
    updatedData[index].tongKet = (kttx + nttd + giuaKy + thucHanh + cuoiKy) / 5;

    // Update the data state with the modified member list
    setData({ members: updatedData });
  };

  const handleSave = async () => {
    try {
      if (data && data.members) {
        const requestData = {
          mLP: maLop,
          members: data.members.map((member) => ({
            mssv: member.mssv,
            updatedFields: {
              kttx: member.kttx,
              nttd: member.nttd,
              giuaky: member.giuaky,
              thuchanh: member.thuchanh,
              cuoiky: member.cuoiky,
              tongket: member.tongket,
            },
          })),
        };
        console.log(requestData);
        const response = await axios.put(
          "http://localhost:8080/api/points/point/updateAll",
          requestData
        );

        if (response.status === 200) {
          alert("Cập nhật điểm thành công cho tất cả thành viên!");
          const updatedMembers = data.members.map((member) => ({
            ...member,
            ...requestData.members.find((m) => m.mssv === member.mssv)
              ?.updatedFields,
          }));
          setData({ members: updatedMembers });
        } else {
          alert("Cập nhật điểm thất bại: " + response.data.message);
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Có lỗi xảy ra khi gửi dữ liệu!");
    }
  };

  return (
    <div className="" style={{ minHeight: "100vh" }}>
      <HeadingPage title={`Bảng điểm lớp học: ${maLop}`} />

      {loading ? (
        <p>Loading...</p>
      ) : noData ? (
        <div>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />
          {fileName && (
            <p className="text-gray-500 mt-2">Đã tải lên: {fileName}</p>
          )}
        </div>
      ) : (
        <>
          {" "}
          <div className="mb-4 border p-4 rounded bg-gray-100">
            <p>
              <strong>Giáo viên:</strong> {dataMember?.tNGiOViN || "N/A"}
            </p>
            <p>
              <strong>Lớp:</strong> {dataMember?.mLP || "N/A"}
            </p>
            <p>
              <strong>Môn học:</strong> {dataMember?.mNHC || "N/A"}
            </p>
            <p>
              <strong>Lớp học phần:</strong> {dataMember?.lPHCPhN || "N/A"}
            </p>
            <p>
              <strong>Số tín chỉ:</strong> {dataMember?.sTNCh || "N/A"}
            </p>
            <p>
              <strong>Học kỳ:</strong> {dataMember?.hCK || "N/A"}
            </p>
            <p>
              <strong>Năm học:</strong> {dataMember?.nMHC || "N/A"}
            </p>
          </div>
          <table className="table-auto w-full border border-gray-300 mt-4">
            <thead className="bg-[#f4f7f9]">
              <tr>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  STT
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  Tên thành viên
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  MSSV
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  KTTX
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  NTTD
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  Giữa kỳ
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  Thực hành
                </th>
                <th className="border text-center py-2 text-[14px] text-[#1ea1f1]">
                  Cuối kỳ
                </th>
                <th className="border whitespace-nowrap px-2 text-center py-2 text-[14px] text-[#1ea1f1]">
                  Điểm tổng kết
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {data?.members?.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-4 py-2 text-[16px]">{index + 1}</td>
                  <td className="border whitespace-nowrap px-5 py-2 text-[16px]">
                    {item.tNThNhViN}
                  </td>
                  <td className="border whitespace-nowrap px-5 py-2 text-[16px]">
                    {item.mssv}
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    <input
                      type="text"
                      className="w-full border p-1 rounded-md"
                      value={item.kttx || ""}
                      onChange={(e) => handleInputChange(e, index, "kttx")}
                    />
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    <input
                      type="text"
                      className="w-full border p-1 rounded-md"
                      value={item.nttd || ""}
                      onChange={(e) => handleInputChange(e, index, "nttd")}
                    />
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    <input
                      type="text"
                      className="w-full border p-1 rounded-md"
                      value={item.giuaky || ""}
                      onChange={(e) => handleInputChange(e, index, "giuaky")}
                    />
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    <input
                      type="text"
                      className="w-full border p-1 rounded-md"
                      value={item.thuchanh || ""}
                      onChange={(e) => handleInputChange(e, index, "thuchanh")}
                    />
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    <input
                      type="text"
                      className="w-full border p-1 rounded-md"
                      value={item.cuoiky || ""}
                      onChange={(e) => handleInputChange(e, index, "cuoiky")}
                    />
                  </td>
                  <td className="border px-4 py-2 text-[16px]">
                    {item.tongket}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 text-right">
            <button
              onClick={handleSave}
              className="bg-[#1ea1f1] py-2 px-5 text-white rounded-md"
            >
              Lưu điểm
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GradeTable;
