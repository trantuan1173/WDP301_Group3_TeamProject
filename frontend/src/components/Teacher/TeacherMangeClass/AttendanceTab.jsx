import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AttendanceTab({ classId, students }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [showAttendance, setShowAttendance] = useState(false);

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
      setNextSchedule(null);
      return;
    }
    const now = new Date();
    let found = null;
    let next = null;
    for (let sch of schedules) {
      const start = new Date(sch.start_time);
      const end = new Date(sch.end_time);
      if (end <= start) continue;
      if (!found && now >= start && now <= end) {
        found = sch;
      }
      if (!next && start > now) {
        next = sch;
      }
    }
    setCurrentSchedule(found);
    setNextSchedule(next);
  }, [schedules]);

  const handleCheck = (studentId, type) => {
    setAttendance(prev => {
      const prevState = prev[studentId] || { present: false, absent: false };
      return {
        ...prev,
        [studentId]: {
          present: type === "present" ? !prevState.present : false,
          absent: type === "absent" ? !prevState.absent : false,
        }
      };
    });
  };

  if (loading) {
    return <div>Đang tải lịch học...</div>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">Danh sách học viên</h2>
      <div className="flex flex-row gap-8 w-full justify-center items-start flex-wrap">
        {/* Bảng danh sách học viên */}
        <div className="flex-1 min-w-[340px] max-w-3xl">
          <table className="min-w-full border rounded-lg shadow bg-white px-8">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="border px-4 py-2 text-center">STT</th>
                <th className="border px-4 py-2 text-center">Email</th>
                {showAttendance && currentSchedule && (
                  <>
                    <th className="border px-4 py-2 text-center">Có mặt</th>
                    <th className="border px-4 py-2 text-center">Vắng</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? students.map((student, idx) => (
                <tr key={student._id} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className="border px-4 py-2 text-center">{idx + 1}</td>
                  <td className="border px-4 py-2">{student.email}</td>
                  {showAttendance && currentSchedule && (
                    <>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={attendance[student._id]?.present || false}
                          onChange={() => handleCheck(student._id, "present")}
                          disabled={attendance[student._id]?.absent}
                          className="w-5 h-5 accent-green-600"
                        />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <input
                          type="checkbox"
                          checked={attendance[student._id]?.absent || false}
                          onChange={() => handleCheck(student._id, "absent")}
                          disabled={attendance[student._id]?.present}
                          className="w-5 h-5 accent-red-600"
                        />
                      </td>
                    </>
                  )}
                </tr>
              )) : (
                <tr>
                  <td colSpan={showAttendance && currentSchedule ? 4 : 2} className="text-center py-4">Không có học viên nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Thông báo và nút điểm danh */}
        <div className="flex flex-col justify-between min-w-[320px] max-w-sm w-full h-full" style={{minHeight: 220}}>
          {!showAttendance ? (
            <button
              className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition text-base font-semibold w-32 self-end mt-2"
              onClick={() => setShowAttendance(true)}
            >
              Điểm danh
            </button>
          ) : (
            <div className="flex flex-col h-full justify-between" style={{height: "100%"}}>
              <div>
                {!currentSchedule && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 font-semibold shadow mb-4 w-full text-center">
  <div>Chưa đến giờ điểm danh.</div>
  {nextSchedule ? (
    <div className="mt-2 text-sm font-normal">
      <div className="font-medium">Buổi học gần nhất:</div>
      <div>
        Ngày: {new Date(nextSchedule.date).toLocaleDateString()}<br />
        Thời gian: {new Date(nextSchedule.start_time).toLocaleTimeString()} - {new Date(nextSchedule.end_time).toLocaleTimeString()}
      </div>
    </div>
  ) : (
    <div className="mt-2 text-sm font-normal text-gray-600">
      Không có buổi học sắp tới.
    </div>
  )}
</div>
                )}
              </div>
              <button
                className={`px-6 py-2 rounded-lg shadow font-semibold text-base w-32 mt-2 self-end ${
                  currentSchedule
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-400 text-white cursor-not-allowed"
                }`}
                disabled={!currentSchedule}
              >
                Xác nhận điểm danh
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}