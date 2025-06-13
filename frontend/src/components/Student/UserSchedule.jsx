import React, { useEffect, useState } from "react";
import Scheduler from "devextreme-react/scheduler";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../config";

const UserSchedule = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const res = await axios.get(API_ENDPOINTS.GET_STUDENT_SCHEDULE(userId), {
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
  const appointments = schedules.map(sch => ({
    id: sch._id,
    text: sch.classId?.course || "Buổi học",
    startDate: new Date(sch.start_time),
    endDate: new Date(sch.end_time),
  }));

  // Tối ưu hiển thị ca tối (nếu cần)
  const getHour = (dateStr) => new Date(dateStr).getHours();
  const minHour = schedules.length
    ? Math.min(...schedules.map(sch => getHour(sch.start_time)), 7)
    : 7;
  const maxHour = schedules.length
    ? Math.max(...schedules.map(sch => getHour(sch.end_time)), 21)
    : 21;

  return (
    <div className="p-8 bg-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Lịch học của tôi</h2>
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
};

export default UserSchedule;