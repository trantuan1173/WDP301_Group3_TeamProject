import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { jwtDecode } from "jwt-decode";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function TeacherSheduleToday() {
  const [schedules, setSchedules] = useState([]);
  const [viewDate, setViewDate] = useState(new Date());

  // Lấy userId từ token
  let userId = "";
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (e) {
      userId = "";
    }
  }

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!userId) return;
      const res = await axios.get(API_ENDPOINTS.GET_TEACHER_SCHEDULE(userId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(res.data.data || []);
    };
    fetchSchedule();
  }, [userId, token]);

  // Lọc lịch học theo ngày đang xem
  const viewDateStr = viewDate.toISOString().slice(0, 10);
  const daySchedules = (schedules || [])
    .filter(sch => sch.date && sch.date.slice(0, 10) === viewDateStr)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time)); // soft theo thời gian tăng dần

  // Giới hạn chỉ cho phép next đến ngày mai
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isToday = viewDate.toDateString() === today.toDateString();
  const isTomorrow = viewDate.toDateString() === tomorrow.toDateString();

  // Hàm chuyển sang ngày tiếp theo (chỉ cho phép đến ngày mai)
  const handleNextDay = () => {
    if (isToday) setViewDate(tomorrow);
  };

  // Hàm quay lại ngày hôm nay
  const handlePrevDay = () => {
    if (isTomorrow) setViewDate(today);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 relative">
      <div className="font-bold text-lg mb-2">
        {viewDate.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}
      </div>
      {daySchedules.length === 0 ? (
        <div className="text-gray-500">No schedule for this day.<br />Enjoy your day</div>
      ) : (
        daySchedules.map((sch, idx) => (
          <div key={sch._id} className="mb-4">
            <div className="font-semibold">
              Slot {idx + 1} | {new Date(sch.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>Class: {sch.classId?.className || "?"}</div>
          </div>
        ))
      )}
      {/* Nút back chỉ hiện khi đang ở ngày mai, nút next chỉ hiện khi đang ở hôm nay */}
      {isTomorrow && (
        <button
          className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow hover:bg-blue-700 transition"
          onClick={handlePrevDay}
          title="Quay lại lịch hôm nay"
        >
          <FaArrowLeft />
        </button>
      )}
      {isToday && (
        <button
          className="absolute bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 shadow hover:bg-blue-700 transition"
          onClick={handleNextDay}
          title="Xem lịch ngày mai"
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
}