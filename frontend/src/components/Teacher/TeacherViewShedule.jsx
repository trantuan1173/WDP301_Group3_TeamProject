import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import vi from "date-fns/locale/vi";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import { jwtDecode } from "jwt-decode";import { API_ENDPOINTS } from "../../config";

const locales = {
  "en-US": enUS,
  "vi": vi,
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

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await axios.get(API_ENDPOINTS.GET_TEACHER_SCHEDULE(userId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(res.data.data || []);
      } catch (error) {
        setSchedules([]);
      }
    };
    fetchSchedule();
  }, []);

  // Chuyển đổi dữ liệu sang format của DevExtreme Scheduler
   const events = schedules.map(sch => ({
    id: sch._id,
    title: sch.classId?.course || "Buổi học",
    start: new Date(sch.start_time),
    end: new Date(sch.end_time),
    allDay: false,
  }));

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
        />
      </div>
    </div>
  );
};

export default TeacherViewShedule;