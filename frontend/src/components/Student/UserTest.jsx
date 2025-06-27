import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config";
import { useMemo } from "react";

export default function UserTest() {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchTests = async () => {
      if (!user || !user._id) return;

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          API_ENDPOINTS.GET_TESTS_BY_STUDENT_ID(user._id),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTests(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch tests:", error);
      }
    };

    fetchTests();
  }, [user]);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const keyword = searchQuery.toLowerCase();
      const courseMatch =
        test.courseId?.nameCourses?.toLowerCase().includes(keyword) ||
        test.classId?.className?.toLowerCase().includes(keyword) ||
        test.teacherId?.profileId?.name?.toLowerCase().includes(keyword);

      const dueDate = new Date(test.dueDate);
      const now = new Date();

      const isSameDay =
        now.getFullYear() === dueDate.getFullYear() &&
        now.getMonth() === dueDate.getMonth() &&
        now.getDate() === dueDate.getDate();

      const isPast = dueDate < new Date(now.setHours(0, 0, 0, 0));
      const isFuture = dueDate > new Date(now.setHours(23, 59, 59, 999));

      let statusMatch = true;
      if (filterStatus === "upcoming") statusMatch = isFuture;
      else if (filterStatus === "today") statusMatch = isSameDay;
      else if (filterStatus === "past") statusMatch = isPast;

      return courseMatch && statusMatch;
    });
  }, [tests, searchQuery, filterStatus]);

  const weekdays = [
    { label: "Thứ Hai", value: 1 },
    { label: "Thứ Ba", value: 2 },
    { label: "Thứ Tư", value: 3 },
    { label: "Thứ Năm", value: 4 },
    { label: "Thứ Sáu", value: 5 },
    { label: "Thứ Bảy", value: 6 },
    { label: "Chủ Nhật", value: 0 },
  ];

  const getMonday = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    d.setDate(d.getDate() + diff);
    return d;
  };

  const monday = getMonday(new Date());

  const testsByWeekday = weekdays.map(({ label, value }) => {
    const thisDay = new Date(monday);
    thisDay.setDate(monday.getDate() + ((value + 7 - 1) % 7));

    const filtered = filteredTests.filter((test) => {
      const testDate = new Date(test.dueDate);
      return (
        testDate.getFullYear() === thisDay.getFullYear() &&
        testDate.getMonth() === thisDay.getMonth() &&
        testDate.getDate() === thisDay.getDate()
      );
    });

    return {
      label,
      dateStr: thisDay.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }),
      tests: filtered,
    };
  });

  const pad = (num) => num.toString().padStart(2, "0");

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Bài Kiểm Tra Của Tôi</h2>

      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center border rounded px-2 bg-gray-100 w-full max-w-md">
          <input
            type="text"
            placeholder="Tên lớp học, khóa học, giáo viên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="outline-none py-1 px-2 bg-transparent w-full"
          />
          <FiSearch className="text-gray-600" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-1 rounded text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="upcoming">Chưa tới hạn</option>
            <option value="today">Đến hạn hôm nay</option>
            <option value="past">Đã quá hạn</option>
          </select>
          <select className="border px-3 py-1 rounded text-sm">
            <option>Tuần này</option>
            <option>Tuần trước</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-400 text-white text-left">
              <th className="p-3 border">Thứ</th>
              <th className="p-3 border">Tên lớp</th>
              <th className="p-3 border">Khoá học</th>
              <th className="p-3 border">Giáo viên</th>
              <th className="p-3 border">Thời gian</th>
              <th className="p-3 border text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {testsByWeekday.flatMap(({ label, dateStr, tests }, weekdayIndex) =>
              tests.map((test, i) => {
                const dueDate = new Date(test.dueDate);
                const startHour = dueDate.getHours();
                const startMin = dueDate.getMinutes();
                const endHour = startHour + 1;
                const timeStr = `45p (${startHour}h${pad(
                  startMin
                )} - ${endHour}h${pad(startMin)})`;

                const now = new Date();
                const isSameDay =
                  now.getFullYear() === dueDate.getFullYear() &&
                  now.getMonth() === dueDate.getMonth() &&
                  now.getDate() === dueDate.getDate();

                const isPast = dueDate < new Date(now.setHours(0, 0, 0, 0));
                const isFuture =
                  dueDate > new Date(now.setHours(23, 59, 59, 999));

                const rowBg =
                  (i + weekdayIndex) % 2 === 0 ? "bg-white" : "bg-gray-50";

                const actionButton = isPast ? (
                  <button className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200">
                    Xem kết quả
                  </button>
                ) : isSameDay ? (
                  <button className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">
                    Làm bài
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-200 text-gray-600 px-3 py-1 rounded cursor-not-allowed"
                  >
                    Chưa mở
                  </button>
                );

                return (
                  <tr
                    key={test._id}
                    className={`${rowBg} hover:bg-blue-50 transition`}
                  >
                    <td className="p-3 border">{`${label} (${dateStr})`}</td>
                    <td className="p-3 border">{test.classId?.className}</td>
                    <td className="p-3 border">{test.courseId?.nameCourses}</td>
                    <td className="p-3 border">
                      {test.teacherId?.profileId?.name}
                    </td>
                    <td className="p-3 border">{timeStr}</td>
                    <td className="p-3 border text-center">{actionButton}</td>
                  </tr>
                );
              })
            )}

            {filteredTests.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  Không có bài kiểm tra.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
