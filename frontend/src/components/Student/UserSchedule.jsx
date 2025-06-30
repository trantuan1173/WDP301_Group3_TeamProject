import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../config";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const TeacherViewSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await axios.get(API_ENDPOINTS.GET_STUDENT_SCHEDULE(userId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(res.data.data || []);
      } catch (error) {
        setSchedules([]);
      }
    };
    fetchSchedule();
  }, []);

  const events = schedules.map((sch) => ({
    id: sch._id,
    title: sch.classId?.className || "Class",
    start: new Date(sch.start_time),
    end: new Date(sch.end_time),
    allDay: false,
  }));

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">My Schedule</h2>
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
          culture="en-US"
          slotPropGetter={() => ({
            style: {
              minHeight: "25px",
            },
          })}
          min={new Date(1970, 1, 1, 7, 0, 0)}
          max={new Date(1970, 1, 1, 23, 59, 59)}
        />
      </div>
    </div>
  );
};

export default TeacherViewSchedule;
