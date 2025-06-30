import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import vi from "date-fns/locale/vi";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../config";
import { useNavigate } from "react-router-dom";
const locales = {
  "en-US": enUS,
  vi: vi,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TeacherViewShedule = () => {
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await axios.get(
          API_ENDPOINTS.GET_TEACHER_SCHEDULE(userId),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSchedules(res.data.data || []);
      } catch (error) {
        setSchedules([]);
      }
    };
    fetchSchedule();
  }, []);

  // Chuyển đổi dữ liệu sang format của DevExtreme Scheduler
  const events = schedules.map((sch) => ({
    id: sch._id, // ID lịch học
    classId: sch.classId?._id, // ✅ đảm bảo lấy đúng ID lớp
    title: sch.classId?.className || "Buổi học",
    start: new Date(sch.start_time),
    end: new Date(sch.end_time),
    date: sch.date,
  }));

const CustomEvent = ({ event }) => {
  const now = new Date();
  const eventDate = new Date(event.date);

  const isSameDay =
    now.getFullYear() === eventDate.getFullYear() &&
    now.getMonth() === eventDate.getMonth() &&
    now.getDate() === eventDate.getDate();

  const isPastDay = eventDate < new Date(now.setHours(0, 0, 0, 0));
  const isFutureDay = eventDate > new Date(now.setHours(23, 59, 59, 999));

  let buttonStyle = "bg-gray-400 text-white cursor-not-allowed";
  let buttonLabel = "Điểm danh";
  let isDisabled = false;

  if (isPastDay) {
    buttonStyle = "bg-yellow-500 text-white hover:bg-yellow-600";
    buttonLabel = "Xem điểm danh";
    isDisabled = false;
  } else if (isSameDay) {
    buttonStyle = "bg-green-500 text-white hover:bg-green-600";
    buttonLabel = "Điểm danh";
    isDisabled = false;
  }

  return (
    <div className="flex flex-col items-center justify-between h-full px-1 py-1">
      <span className="text-white text-sm font-semibold text-center leading-tight">
        {event.title}
      </span>
      <div className="mt-1 mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!isDisabled) {
              navigate(`/teacher/attendance/${event.classId}?date=${event.date}`);
            }
          }}
          disabled={isDisabled}
          className={`px-2 py-[2px] text-[10px] rounded transition ${buttonStyle}`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};


  // Tối ưu hiển thị ca tối

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Lịch dạy của tôi</h2>
      <div className="mt-6" style={{ height: 600 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          titleAccessor="title"
          defaultView="week"
          views={["week", "month"]}
          style={{ height: 600 }}
          popup
          culture="vi"
          onSelectEvent={() => {}}
          components={{
            event: CustomEvent,
          }}
          slotPropGetter={() => ({
            style: {
              minHeight: "25px", // 👈 tăng chiều cao mỗi dòng giờ
            },
          })}
          min={new Date(1970, 1, 1, 7, 0, 0)}
              max={new Date(1970, 1, 1, 23, 59, 59)}
        />
      </div>
    </div>
  );
};

export default TeacherViewShedule;