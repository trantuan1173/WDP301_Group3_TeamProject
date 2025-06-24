import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { API_ENDPOINTS } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  FaChartLine,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaLayerGroup,
} from "react-icons/fa";

export default function AttendanceOverview() {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const url = API_ENDPOINTS.GET_ATTENDANCE_BY_STUDENT_ID(user._id);
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendances(res.data.data || []);
      } catch (err) {
        console.error("Error fetching attendance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading)
    return <LoadingSpinner size={100} text="Loading attendance..." />;

  if (attendances.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No attendance records found.
      </div>
    );
  }

  const grouped = attendances.reduce((acc, att) => {
    const classId = att.classId._id;
    if (!acc[classId]) acc[classId] = { class: att.classId, records: [] };
    acc[classId].records.push(att);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          My Attendance Overview
        </h1>

        {Object.values(grouped).map((group) => {
          const total = group.records.length;
          const attended = group.records.filter(
            (r) => r.status === true
          ).length;
          const absent = total - attended;
          const attendanceRate = total
            ? Math.round((attended / total) * 100)
            : 0;
          const absentRate = 100 - attendanceRate;

          return (
            <div
              key={group.class._id}
              className="bg-white rounded-xl shadow p-5 border-l-4 border-indigo-500"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {group.class.course || "Unnamed Class"}
                  </h2>
                
                  <p className="text-gray-600 mt-4 flex items-center gap-2">
                    <FaLayerGroup className="text-indigo-400" />
                    <span className="font-medium">Class:</span>{" "}
                      {group.class.course || "Unnamed Course"}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FaCalendarAlt className="text-yellow-500" />
                    {new Date(
                      group.class.start_time
                    ).toLocaleDateString()} -{" "}
                    {new Date(group.class.end_time).toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(`/attendance/${group.class._id}`, {
                      state: { records: group.records, classInfo: group.class },
                    })
                  }
                  className="mt-2 py-1.5 px-3 bg-indigo-900 text-white rounded hover:bg-indigo-600 transition"
                >
                  View Details
                </button>
              </div>

              <div className="">
                <div className="flex justify-between text-sm mb-1">
                  <span className="flex items-center gap-1 text-green-600">
                    <FaCheckCircle /> Attendance: {attendanceRate}% ({attended}/
                    {total})
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <FaTimesCircle /> Absent: {absentRate}% ({absent}/{total})
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-green-500 h-3"
                    style={{ width: `${attendanceRate}%` }}
                  ></div>
                  <div
                    className="bg-red-500 h-3"
                    style={{ width: `${absentRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
