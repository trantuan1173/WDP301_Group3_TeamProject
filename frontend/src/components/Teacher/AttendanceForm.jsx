import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";

export default function AttendanceForm() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [attendances, setAttendances] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");
  const [notes, setNotes] = useState({});
  const [className, setClassName] = useState(""); // mới thêm
  const navigate = useNavigate();

  const { classId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentDate =
    queryParams.get("date") || new Date().toISOString().split("T")[0];
  const isToday = (() => {
    const today = new Date();
    const input = new Date(currentDate);
    return (
      input.getFullYear() === today.getFullYear() &&
      input.getMonth() === today.getMonth() &&
      input.getDate() === today.getDate()
    );
  })();
  const isFutureDate = (() => {
    const today = new Date();
    const input = new Date(currentDate);
    return input > today;
  })();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          API_ENDPOINTS.GET_ATTENDANCES_BY_CLASS(classId),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rawStudents = res.data.students || [];

        // Chuẩn hóa dữ liệu học sinh
        const mapped = rawStudents.map((student) => ({
          _id: student._id,
          email: student.email,
          name: student.profileId?.name || "Không rõ",
          gender: student.profileId?.gender || "Không rõ",
          dob: student.profileId?.dob || "",
          attendance: student.attendance || {},
        }));

        // Gán sẵn trạng thái điểm danh và ghi chú vào state
        const prefillAttendance = {};
        const prefillNotes = {};
        mapped.forEach((stu) => {
          if (stu.attendance) {
            // prefillAttendance[stu._id] = stu.attendance.status;
            prefillAttendance[stu._id] =
              typeof stu.attendance.status === "boolean"
                ? stu.attendance.status
                : null;
            prefillNotes[stu._id] = stu.attendance.note || "";
          }
        });

        setStudents(mapped);
        setClassName(res.data.className || "");
        setAttendances(prefillAttendance);
        setNotes(prefillNotes);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách học sinh:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleAttendanceChange = (studentId, status) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveAttendance = async () => {
    const attendanceList = Object.entries(attendances).map(
      ([studentId, status]) => ({
        studentId,
        status,
        note: notes[studentId] || "",
      })
    );

    try {
      const res = await axios.post(
        API_ENDPOINTS.CREATE_ATTENDANCE,
        {
          classId,
          date: currentDate,
          attendances: attendanceList,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Điểm danh đã được lưu thành công!");
      console.log("Kết quả từ server:", res.data);
    } catch (error) {
      console.error("Lỗi khi lưu điểm danh:", error);
      alert("Có lỗi xảy ra khi lưu điểm danh!");
    }
  };

  const filteredStudents = students
    .filter((student) =>
      student.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((student) => {
      const status = attendances[student._id];
      if (filterStatus === "present") return status === true;
      if (filterStatus === "absent") return status === false;
      return true;
    });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="mb-4">
        <button
          onClick={() => navigate("/teacher")}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow"
        >
          Quay lại
        </button>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        {className ? `Lớp ${className}` : "Thông tin lớp..."}
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1 w-full max-w-md">
          <FiSearch className="text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm học sinh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none bg-transparent w-full py-2"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 bg-white px-3 py-2 rounded-md shadow-sm text-sm"
        >
          <option value="all">Tất cả</option>
          <option value="present">Có mặt</option>
          <option value="absent">Vắng mặt</option>
        </select>

        <span className="text-green-600 font-semibold whitespace-nowrap">
          {filteredStudents.length} Học Sinh
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse bg-blue-50 rounded-xl overflow-hidden">
          <thead className="bg-blue-100 text-sm text-gray-700">
            <tr>
              <th className="p-3 border">STT</th>
              <th className="p-3 border">Tên</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Giới tính</th>
              <th className="p-3 border">Ngày sinh</th>
              <th className="p-3 border text-center">Có mặt</th>
              <th className="p-3 border text-center">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, idx) => (
              <tr
                key={student._id}
                className="text-sm hover:bg-blue-100 transition"
              >
                <td className="p-3 border text-center">{idx + 1}</td>
                <td className="p-3 border">{student.name}</td>
                <td className="p-3 border">{student.email}</td>
                <td className="p-3 border">{student.gender}</td>
                <td className="p-3 border">
                  {new Date(student.dob).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 border text-center">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      name={`attend-${student._id}`}
                      checked={attendances[student._id] === true}
                      disabled={!isToday}
                      onChange={() => handleAttendanceChange(student._id, true)}
                    />
                    <span className="ml-2">Có</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name={`attend-${student._id}`}
                      checked={attendances[student._id] === false}
                      disabled={!isToday}
                      onChange={() =>
                        handleAttendanceChange(student._id, false)
                      }
                    />
                    <span className="ml-2">Vắng</span>
                  </label>
                </td>
                <td className="p-3 border text-center">
                  <input
                    type="text"
                    placeholder="Ghi chú..."
                    value={notes[student._id] || ""}
                    disabled={!isToday}
                    onChange={(e) =>
                      setNotes((prev) => ({
                        ...prev,
                        [student._id]: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded w-full text-sm"
                  />
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  Không có học sinh nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      {isToday && (
        <div className="text-right mt-6">
          <button
            onClick={handleSaveAttendance}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Lưu điểm danh
          </button>
        </div>
      )}
      {!isToday && !isFutureDate && (
        <div className="text-right mt-6 text-gray-600 italic">
          Hết thời gian chỉnh sửa điểm danh.
        </div>
      )}
      {isFutureDate && (
        <div className="text-right mt-6 text-gray-600 italic">
          Chưa tới thời gian điểm danh.
        </div>
      )}
    </div>
  );
}
