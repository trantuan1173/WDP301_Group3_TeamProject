import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import AdminCreateSchedule from "./AdminCreateSchedule";
import Scheduler from "devextreme-react/scheduler";
import "devextreme/dist/css/dx.light.css";

export default function AdminViewSchedule() {
  const { classId } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [className, setClassName] = useState(""); // Thêm state lưu tên lớp

  // Lấy tên lớp học
  const fetchClassName = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
      headers: { Authorization: `Bearer ${token}` }
    });
    setClassName(res.data.data?.course || "Buổi học");
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

  // Chuyển đổi dữ liệu sang format của DevExtreme Scheduler
  const appointments = schedules.map(sch => ({
    id: sch._id,
    text: className || "Buổi học", // Luôn lấy tên lớp học
    startDate: new Date(sch.start_time),
    endDate: new Date(sch.end_time),
  }));

  // Tối ưu hiển thị ca tối
  const getHour = (dateStr) => new Date(dateStr).getHours();
  const minHour = schedules.length
    ? Math.min(...schedules.map(sch => getHour(sch.start_time)), 7)
    : 7;
  const maxHour = schedules.length
    ? Math.max(...schedules.map(sch => getHour(sch.end_time)), 21)
    : 21;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Lịch học của lớp</h2>
      <button
        className="mb-4 bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
        onClick={() => setShowCreate(true)}
      >
        + Tạo lịch học
      </button>
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
      <div className="mt-6">
        <Scheduler
          dataSource={appointments}
          views={['week', 'month']}
          defaultCurrentView="week"
          defaultCurrentDate={appointments[0]?.startDate || new Date()}
          height={1000}
          startDayHour={minHour - 1 < 0 ? 0 : minHour - 1}
          endDayHour={maxHour + 1 > 23 ? 23 : maxHour + 1}
          showAllDayPanel={false}
        />
      </div>
    </div>
  );
}