import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../config";
import NavBar from "../../components/Layouts/NavBar";
import TeacherSideMenu from "../../components/Layouts/TeacherSideMenu";

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
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove diacritics
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  };

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
          API_ENDPOINTS.GET_ATTENDANCES_BY_CLASS(classId, currentDate),
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const rawStudents = res.data.students || [];

        const mapped = rawStudents.map((student) => ({
          _id: student._id,
          email: student.email,
          name: student.profileId?.name || "Không rõ",
          gender: student.profileId?.gender || "Không rõ",
          dob: student.profileId?.dob || "",
          imageURL: student.profileId?.imageURL || "",
          attendance: student.attendance || null,
        }));

        const prefillAttendance = {};
        const prefillNotes = {};
        mapped.forEach((stu) => {
          prefillAttendance[stu._id] =
            typeof stu.attendance?.status === "boolean"
              ? stu.attendance.status
              : null;
          prefillNotes[stu._id] = stu.attendance?.note || "";
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
  }, [classId, currentDate]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendances((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };
  const isAllMarked = students.length > 0 && students.every(
    stu => attendances[stu._id] === true || attendances[stu._id] === false
  );
  const handleSaveAttendance = async () => {
    if (!isAllMarked) {
      alert("All students must be marked!");
      return;
    }
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
    .filter((student) => {
      const searchText = removeVietnameseTones(search);
      const name = removeVietnameseTones(student.name);
      const email = student.email.toLowerCase();
      return name.includes(searchText) || email.includes(searchText);
    })
    .filter((student) => {
      const status = attendances[student._id];
      if (filterStatus === "present") return status === true;
      if (filterStatus === "absent") return status === false;
      return true;
    });

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full">
        <NavBar />
      </header>

      <div className="flex flex-1 bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <div className="hidden md:block w-64">
          <TeacherSideMenu />
        </div>

        {/* Main content with scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="p-6 bg-white rounded-xl shadow-md min-w-full">
              {/* Quay lại */}
              <div className="mb-4">
                <button
                  // onClick={() => navigate("/teacher")}
                  onClick={() => navigate(-1)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded shadow"
                >
                  Back
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {className ? `Class ${className}` : "Attendance"}
              </h2>

              {/* Tìm kiếm & lọc */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1 w-full max-w-md">
                  <FiSearch className="text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search student name, email..."
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
                  <option value="all">All</option>
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>

                <span className="text-green-600 font-semibold whitespace-nowrap">
                  {filteredStudents.length}{" "}
                  {filteredStudents.length === 1 ? "Student" : "Students"}
                </span>
              </div>

              {/* Bảng điểm danh */}
              <div className="w-full overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="overflow-hidden border border-gray-200 rounded-lg">
                    <table className="w-full min-w-[900px] text-left text-sm bg-blue-50">
                      <thead className="bg-blue-100 text-sm text-gray-700">
                        <tr>
                          <th className="p-3 border">#</th>
                          <th className="p-3 border">Image</th>
                          <th className="p-3 border">Name</th>
                          <th className="p-3 border">Email</th>
                          <th className="p-3 border">Gender</th>
                          <th className="p-3 border">Date of birth</th>
                          <th className="p-3 border text-center">State</th>
                          <th className="p-3 border text-center">Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, idx) => (
                          <tr
                            key={student._id}
                            className="text-sm hover:bg-blue-100 transition"
                          >
                            <td className="p-3 border text-center">
                              {idx + 1}
                            </td>
                            <td className="p-3 border text-center">
                              <img
                                src={
                                  student.imageURL
                                    ? student.imageURL
                                    : "/images/avatar-default.png"
                                }
                                alt={student.name || "Default avatar"}
                                className="w-20 h-25 rounded-sm object-cover mx-auto"
                              />
                            </td>

                            <td className="p-3 border">{student.name}</td>
                            <td className="p-3 border">{student.email}</td>
                            <td className="p-3 border">{student.gender}</td>
                            <td className="p-3 border">
                              {new Date(student.dob).toLocaleDateString(
                                "vi-VN"
                              )}
                            </td>
                            <td className="p-3 border text-center">
                              <label className="inline-flex items-center mr-4">
                                <input
                                  type="radio"
                                  name={`attend-${student._id}`}
                                  checked={attendances[student._id] === true}
                                  disabled={!isToday}
                                  onChange={() =>
                                    handleAttendanceChange(student._id, true)
                                  }
                                />
                                <span className="ml-2">Present</span>
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
                                <span className="ml-2">Absent</span>
                              </label>
                            </td>
                            <td className="p-3 border text-center">
                              <input
                                type="text"
                                placeholder="Note..."
                                value={notes[student._id] || ""}
                                disabled={!isToday}
                                onChange={(e) =>
                                  setNotes((prev) => ({
                                    ...prev,
                                    [student._id]: e.target.value,
                                  }))
                                }
                                className="border px-2 py-1 rounded w-full text-sm min-w-[120px]"
                              />
                            </td>
                          </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                          <tr>
                            <td
                              colSpan="8"
                              className="text-center text-gray-500 py-6"
                            >
                              There are no students..
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Nút lưu */}
              {isToday && (
                <div className="text-right mt-6">
                  <button
                    onClick={handleSaveAttendance}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    disabled={!isAllMarked}
                  >
                    Save Attendance
                  </button>
                </div>
              )}

              {/* Ghi chú trạng thái khác */}
              {!isToday && !isFutureDate && (
                <div className="text-right mt-6 text-gray-600 italic">
                  Time out to edit attendance.
                </div>
              )}
              {isFutureDate && (
                <div className="text-right mt-6 text-gray-600 italic">
                  It's not time for roll call yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
