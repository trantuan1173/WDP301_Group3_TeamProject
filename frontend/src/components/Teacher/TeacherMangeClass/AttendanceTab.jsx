import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AttendanceTab({ classId, students }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [attendance, setAttendance] = useState({}); // {studentId: {present: bool, absent: bool}}

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(res.data.data || []);
      } catch (err) {
        setSchedules([]);
      }
      setLoading(false);
    };
    if (classId) fetchSchedules();
  }, [classId]);

  useEffect(() => {
  if (!schedules.length) {
    setCurrentSchedule(null);
    return;
  }
  const now = new Date();
  // Chỉ lấy buổi học đang diễn ra (now >= start && now <= end)
  let found = null;
  for (let sch of schedules) {
    const start = new Date(sch.start_time);
    const end = new Date(sch.end_time);
    if (now >= start && now <= end) {
      found = sch;
      break;
    }
  }
  setCurrentSchedule(found);
}, [schedules]);

  // Xử lý khi click checkbox
  const handleCheck = (studentId, type) => {
    setAttendance(prev => {
      const prevState = prev[studentId] || { present: false, absent: false };
      // Chỉ cho phép chọn 1 trong 2
      return {
        ...prev,
        [studentId]: {
          present: type === "present" ? !prevState.present : false,
          absent: type === "absent" ? !prevState.absent : false,
        }
      };
    });
  };
// Xử lý lưu điểm danh (sẽ bổ sung sau) 
  if (loading) {
    return <div>Đang tải lịch học...</div>;
  }

  if (!currentSchedule) {
  // Không có buổi học hiện tại, hiển thị buổi gần nhất trong tương lai
  
  if (schedules.length === 0) {
    return <div>Không có lịch học nào cho lớp này.</div>;
  }
  const next = schedules
    .filter(sch => new Date(sch.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))[0];
  return (
    <div>
      <div className="font-semibold mb-2">Chưa đến giờ điểm danh.</div>
      {next && (
        <div>
          <div>Buổi học gần nhất:</div>
          <div>
            Ngày: {new Date(next.date).toLocaleDateString()}<br />
            Thời gian: {new Date(next.start_time).toLocaleTimeString()} - {new Date(next.end_time).toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
}

  // Nếu đang trong thời gian điểm danh, hiển thị bảng học viên
  return (
    <div>
      <div className="font-semibold mb-2">
        Điểm danh buổi học ngày {new Date(currentSchedule.date).toLocaleDateString()}<br />
        Thời gian: {new Date(currentSchedule.start_time).toLocaleTimeString()} - {new Date(currentSchedule.end_time).toLocaleTimeString()}
      </div>
      <table className="min-w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">STT</th>
            <th className="border px-2 py-1">Email</th>
            <th className="border px-2 py-1">Có mặt</th>
            <th className="border px-2 py-1">Vắng</th>
          </tr>
        </thead>
        <tbody>
          {students && students.length > 0 ? students.map((student, idx) => (
            <tr key={student._id}>
              <td className="border px-2 py-1 text-center">{idx + 1}</td>
              <td className="border px-2 py-1">{student.email}</td>
              <td className="border px-2 py-1 text-center">
                <input
                  type="checkbox"
                  checked={attendance[student._id]?.present || false}
                  onChange={() => handleCheck(student._id, "present")}
                  disabled={attendance[student._id]?.absent}
                />
              </td>
              <td className="border px-2 py-1 text-center"> // oke 
                <input
                  type="checkbox"
                  checked={attendance[student._id]?.absent || false}
                  onChange={() => handleCheck(student._id, "absent")}
                  disabled={attendance[student._id]?.present}
                />
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={4} className="text-center py-4">Không có học viên nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        // onClick={handleSaveAttendance} // sẽ bổ sung sau
        disabled
      >
        Lưu điểm danh (chức năng sẽ bổ sung)
      </button>
    </div>
  );
}