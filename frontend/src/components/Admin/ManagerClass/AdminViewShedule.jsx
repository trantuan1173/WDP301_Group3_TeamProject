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
      setEditEvent(null);
      fetchSchedules();
    } catch (error) {
      alert("Cập nhật lịch học thất bại!");
    }
  };

  // Lấy tên lớp học
  // Lấy tên lớp học
const fetchClassName = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Nếu res.data.data.course là object, lấy trường name hoặc nameCourses
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
    const token = localStorage.getItem("token");
    const res = await axios.get(API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classId), {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSchedules(res.data.data || []);
  };

  useEffect(() => {
    fetchClassName();
    fetchSchedules();
    // eslint-disable-next-line
  }, [classId]);

  // Chuyển đổi dữ liệu sang format của react-big-calendar
  const events = schedules.map(sch => ({
    id: sch._id,
    title: className || "Buổi học",
    start: new Date(sch.start_time),
    end: new Date(sch.end_time),
    allDay: false,
  }));

  // Xử lý xóa toàn bộ lịch học
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

  return (
  <div className="p-8 bg-white min-h-screen">
    <h2 className="text-2xl font-bold mb-6">Lịch học của lớp {className}</h2>
    <div className="flex justify-end gap-4 mb-4">
      {events.length === 0 ? (
        <button
          className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
          onClick={() => setShowCreate(true)}
        >
          + Tạo lịch học
        </button>
      ) : (
        <button
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          onClick={handleDeleteAllSchedules}
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Chỉnh sửa lịch học"}
        </button>
      )}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded shadow"
      >
        ← Quay lại
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
            Lớp này chưa có lịch học
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
            culture="vi"
            messages={{
              week: "Tuần",
              month: "Tháng",
              today: "Hôm nay",
              previous: "Trước",
              next: "Sau",
            }}
            min={new Date(1970, 1, 1, 7, 0, 0)}   // 1:00 AM
            max={new Date(1970, 1, 1, 23, 59, 59)}   // 11:59:59 PM
            onSelectEvent={handleSelectEvent}
          />
          </div>
        )}
        <AdminUpdateSheduleForm
          open={!!editEvent}
          onClose={() => setEditEvent(null)}
          event={editEvent}
          onSave={handleSaveEdit}
        />
      </div>
      
    </div>
  );
}