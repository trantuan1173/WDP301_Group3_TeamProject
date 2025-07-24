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

export default function UserAttendance() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?._id) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        // Lấy danh sách lớp học của sinh viên
        const classRes = await axios.get(API_ENDPOINTS.GET_CLASSES_BY_STUDENT_ID(user._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(classRes.data.data || []);

        // Lấy toàn bộ điểm danh của sinh viên
        const attRes = await axios.get(API_ENDPOINTS.GET_ATTENDANCE_BY_STUDENT_ID(user._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAttendances(attRes.data.data || []);
      } catch (err) {
        console.error("Error fetching attendance/class data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading)
    return <LoadingSpinner size={100} text="Loading attendance..." />;

  
  const classAttendance = classes.map(cls => {
    const records = attendances.filter(att => att.classId === cls._id);
    const total = records.length;
    const present = records.filter(r => r.status === true).length;
    
    const absent = records.filter(r => r.status === false || r.status === null).length;
    const attendanceRate = total ? Math.round((present / total) * 100) : 0;
    return {
      ...cls,
      records,
      total,
      present,
      absent,
      attendanceRate,
    };
  }).filter(cls => cls.records.length > 0);

  if (classAttendance.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No attendance records found for your classes.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">
          My Attendance Overview
        </h1>

        {classAttendance.map(cls => (
          <div
            key={cls._id}
            className="bg-white rounded-xl shadow p-5 border-l-4 border-indigo-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-indigo-700">
                  {cls.course?.name || cls.className || "Unnamed Class"}
                </h2>
                <p className="text-gray-600 mt-4 flex items-center gap-2">
                  <FaLayerGroup className="text-indigo-400" />
                  <span className="font-medium">Class:</span>{" "}
                  {cls.className}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-500" />
                  {cls.start_time
                    ? new Date(cls.start_time).toLocaleDateString()
                    : "--"}{" "}
                  -{" "}
                  {cls.end_time
                    ? new Date(cls.end_time).toLocaleDateString()
                    : "--"}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaChartLine className="text-green-500" />
                  <span className="font-medium">Teacher:</span>{" "}
                  {cls.teacher?.profileId?.name || cls.teacher?.email || "N/A"}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/attendance/${cls._id}`, {
                    state: { records: cls.records, classInfo: cls },
                  })
                }
                className="mt-2 py-1.5 px-3 bg-indigo-900 text-white rounded hover:bg-indigo-600 transition"
              >
                View Details
              </button>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="flex items-center gap-1 text-green-600">
                  <FaCheckCircle /> Attendance: {cls.attendanceRate}% ({cls.present}/{cls.total})
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <FaTimesCircle /> Absent: {cls.total ? 100 - cls.attendanceRate : 0}% ({cls.absent}/{cls.total})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex">
                <div
                  className="bg-green-500 h-3"
                  style={{ width: `${cls.attendanceRate}%` }}
                ></div>
                <div
                  className="bg-red-500 h-3"
                  style={{ width: `${cls.total ? 100 - cls.attendanceRate : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}