import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function AttendanceTab({ classId, students }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [nextSchedule, setNextSchedule] = useState(null);
  const navigate = useNavigate();

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          API_ENDPOINTS.GET_SHEDULE_BY_CLASSID(classId),
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

      // Chấp nhận nếu ngày hiện tại trùng với ngày học (bỏ qua giờ)
      if (!found && isSameDate(now, start)) {
        found = sch;
      }

      if (!next && start > now) {
        next = sch;
      }
    }

    setCurrentSchedule(found);
    setNextSchedule(next);
  }, [schedules]);

  if (loading) {
    return <div>Loading schedules...</div>;
  }

  if (!schedules.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 text-center">
          Student List
        </h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-yellow-800 font-semibold shadow mb-4 w-full text-center max-w-xl">
          This class has no schedules yet.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-start px-0">
      <h2 className="text-2xl font-bold mb-6 text-blue-900 text-left w-full pl-2">
        Student List
      </h2>
      <div className="flex flex-row gap-70 w-full justify-start items-start flex-wrap">
        <div className="flex-1 min-w-[320px] max-w-3xl">
          <table className="min-w-full border rounded-lg shadow bg-white px-4">
            <thead>
              <tr className="bg-blue-100 text-blue-900">
                <th className="border px-4 py-2 text-center">No.</th>
                <th className="border px-4 py-2 text-center">Student Name</th>
                <th className="border px-4 py-2 text-center">Email</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student, idx) => (
                  <tr
                    key={student._id}
                    className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="border px-4 py-2 text-center">{idx + 1}</td>
                    <td className="border px-4 py-2 text-center">
                      {student.profileId?.name || "N/A"}
                    </td>
                    <td className="border px-4 py-2">{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex flex-col justify-between min-w-[220px] max-w-xs w-full h-full ml-8"
          style={{ minHeight: 220 }}
        >
          <button
            className={`px-6 py-2 rounded-lg shadow font-semibold text-base w-32 mt-2 self-end ${
              currentSchedule
                ? "bg-blue-700 text-white hover:bg-blue-800"
                : "bg-gray-400 text-white cursor-not-allowed"
            }`}
            onClick={() => {
              if (currentSchedule) {
                const today = new Date().toISOString().split("T")[0];
                navigate(`/teacher/attendance/${classId}?date=${today}`);
              }
            }}
            disabled={!currentSchedule}
          >
            Take Attendance
          </button>

          {!currentSchedule && nextSchedule && (
            <div className="mt-4 bg-yellow-100 p-3 rounded text-sm text-gray-700">
              <div className="font-semibold">Next Schedule:</div>
              <div>{new Date(nextSchedule.date).toLocaleDateString()}</div>
              <div>
                {new Date(nextSchedule.start_time).toLocaleTimeString()} -{" "}
                {new Date(nextSchedule.end_time).toLocaleTimeString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
