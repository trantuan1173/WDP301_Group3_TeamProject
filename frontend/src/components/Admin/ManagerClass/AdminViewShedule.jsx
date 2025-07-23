import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import AdminCreateSchedule from "./AdminCreateSchedule";
import AdminUpdateSheduleForm from "./AdminUpdateSheduleForm";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import vi from "date-fns/locale/vi";
import enUS from "date-fns/locale/en-US";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner"; // Đã import

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

export default function AdminViewSchedule() {
  const { classId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [className, setClassName] = useState("");
  const [editEvent, setEditEvent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true); // Thêm state loading

  const navigate = useNavigate();

  const handleSelectEvent = (event) => {
    setEditEvent(event);
  };

  const handleSaveEdit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(API_ENDPOINTS.UPDATE_SCHEDULE(editEvent.id), data, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const res = await axios.get(API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newSchedules = res.data.data || [];

      if (newSchedules.length > 0) {
        const lastSchedule = newSchedules.reduce((a, b) =>
          new Date(a.end_time) > new Date(b.end_time) ? a : b
        );
        if (
          editEvent.id === lastSchedule._id ||
          (data.end_time && new Date(data.end_time).getTime() > new Date(lastSchedule.end_time).getTime())
        ) {
          await axios.put(
            API_ENDPOINTS.UPDATE_CLASS(classId),
            { end_time: data.end_time },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }

      setEditEvent(null);
      fetchSchedules();
    } catch (error) {
      alert("Update schedule failed!");
    }
  };

  // Lấy tên lớp học
  const fetchClassName = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const course = res.data.data?.course;
    let name = "";
    if (typeof course === "string") {
      name = course;
    } else if (typeof course === "object" && course !== null) {
      name = course.name || course.nameCourses || course._id || "Buổi học";
    } else {
      name = "Buổi học";
    }
    const className = res.data.data?.className || res.data.data?.course?.name || "Buổi học";
    setClassName(className);
  };

  // Lấy lịch học
  const fetchSchedules = async () => {
    setLoading(true); // Bắt đầu loading
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(res.data.data || []);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchClassName(), fetchSchedules()]).then(() => setLoading(false));
    // eslint-disable-next-line
  }, [classId]);

  const events = schedules.map(sch => ({
    id: sch._id,
    title: className || "Buổi học",
    start: new Date(sch.start_time),
    end: new Date(sch.end_time),
    allDay: false,
  }));

  const handleDeleteAllSchedules = async () => {
    if (!window.confirm("Are you sure to change all shedules?")) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.DELETE_SHEDULE_BY_CLASSID(classId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules([]);
      setShowCreate(true);
    } catch (error) {
      alert("Xóa toàn bộ lịch học thất bại!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Class Schedule: {className}</h2>
      <div className="flex justify-end gap-4 mb-4">
        {events.length === 0 ? (
          <button
            className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
            onClick={() => setShowCreate(true)}
          >
            + Create schedule
          </button>
        ) : (
          <button
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            onClick={handleDeleteAllSchedules}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Edit schedule"}
          </button>
        )}
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow"
        >
          ← Back
        </button>
      </div>
      {showCreate && (
        <AdminCreateSchedule
          classId={classId}
          onSuccess={() => {
            setShowCreate(false);
            fetchSchedules();
          }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="mt-6" style={{ height: 600 }}>
        {events.length === 0 ? (
          <div className="flex items-center justify-center h-full text-lg text-gray-500 font-semibold">
            This class has no schedule yet
          </div>
        ) : (
          <div className="container mx-auto">
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
              messages={{
                week: "Week",
                month: "Month",
                today: "Today",
                previous: "Previous",
                next: "Next",
              }}
              min={new Date(1970, 1, 1, 7, 0, 0)}
              max={new Date(1970, 1, 1, 23, 59, 59)}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        )}
        <AdminUpdateSheduleForm
          open={
            !!editEvent &&
            new Date(editEvent.end).getTime() > Date.now()
          }
          onClose={() => setEditEvent(null)}
          event={editEvent}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
}