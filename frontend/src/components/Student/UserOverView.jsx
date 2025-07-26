import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import LoadingSpinner from "../LoadingSpinner";
import {
  FaBook,
  FaClipboardCheck,
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";  

export default function UserOverView({ onQuickAction }) {
  const [profile, setProfile] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const [profileRes, scheduleRes, courseRes] = await Promise.all([
          axios.get(API_ENDPOINTS.GET_PROFILE_BY_USERID(userId), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_ENDPOINTS.GET_STUDENT_SCHEDULE(userId), {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(API_ENDPOINTS.GET_CLASSES_BY_STUDENT_ID(userId), {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfile(profileRes.data.data);
        setSchedules(scheduleRes.data.data || []);
        setCourses(courseRes.data.data || []);
      } catch (err) {
        console.error("Error loading dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner size={100} text="Loading dashboard..." />;

  const upcomingSlots = schedules
    .filter((sch) => new Date(sch.start_time) > new Date())
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div
        className="relative rounded-lg shadow-lg overflow-hidden mb-6"
        style={{ height: 300 }}
      >
        <img
          src="/images/viewcourse.png"
          alt="Dashboard Banner Illustration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-start p-10">
          <h3 className="text-white text-3xl md:text-4xl font-bold mb-2 drop-shadow">
            Have a nice day,{" "}
            {profile?.profile?.name || profile?.email || user?.profile?.name || "Student"}!
          </h3>
          <p className="text-white text-xl md:text-2xl mb-4 drop-shadow">
            Let&apos;s progress together!
          </p>
          <button
            onClick={() => onQuickAction("courses")}
            className="bg-white text-indigo-900 font-bold text-lg md:text-xl rounded-2xl px-6 py-3 shadow hover:scale-105 transition"
          >
            Let&apos;s Go
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 p-4 bg-white rounded-lg shadow">
        <img
          src={profile?.profile?.imageURL || user?.profile?.imageURL || "/avatar-default.png"}
          alt="avatar"
          className="w-16 h-16 rounded-full border object-cover"
        />
        <div>
          <div className="font-bold text-xl">
            {profile?.profile?.name || profile?.email || user?.profile?.name || "Student"}
          </div>
          <div className="text-gray-600">Welcome back to your dashboard!</div>
        </div>
      </div>

      <hr className="mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-bold text-lg mb-1">Quick Actions</div>
            <div className="text-gray-500 text-sm mb-3">
              Quickly access your essential tools and sections
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => onQuickAction("courses")}
                className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
              >
                <FaBook /> My Courses
              </button>
              <button
                onClick={() => onQuickAction("attendance")}
                className="bg-green-100 hover:bg-green-200 text-green-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
              >
                <FaClipboardCheck /> Attendance
              </button>
              <button
                onClick={() => onQuickAction("test")}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
              >
                <FaClipboardList /> My Tests
              </button>
              <button
                onClick={() => onQuickAction("schedule")}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
              >
                <FaCalendarAlt /> Schedule
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <div className="font-bold text-lg mb-1">My Courses</div>
            <div className="text-gray-500 text-sm mb-3">
              A quick glance at your enrolled courses
            </div>
            <div className="flex overflow-x-auto gap-3 pb-2">
              {courses.length === 0 ? (
                <p className="text-gray-500">No courses enrolled.</p>
              ) : (
                courses.map((course) => (
                  <div
                    key={course._id}
                    className="min-w-[150px] max-w-[150px] bg-gray-50 rounded-lg shadow-sm flex-shrink-0"
                  >
                    <img
                      src={
                        course.course?.detail?.imageURL ||
                        "/images/default-course.png"
                      }
                      alt={course.course?.name || "Course image"}
                      className="w-full h-24 object-cover rounded-t-lg"
                    />
                    <div className="p-2">
                      <p className="text-sm font-semibold truncate">
                        {course.course?.name || "Unnamed"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        🏫 {course.className || "No class"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="font-bold text-lg mb-1">My Schedule Coming Soon</div>
          <div className="text-gray-500 text-sm mb-3">
            Review what’s coming up for today
          </div>
          {upcomingSlots.length === 0 ? (
            <p className="text-gray-500">No upcoming classes.</p>
          ) : (
            <div className="space-y-3">
              {upcomingSlots.map((slot) => (
                <div
                  key={slot._id}
                  className="p-3 rounded-lg bg-gray-50 border hover:bg-gray-100 transition"
                >
                  <div className="font-medium text-gray-700 mb-1"></div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                    <FaClock className="text-gray-400" />
                    <span>
                      {new Date(slot.start_time).toLocaleDateString()} |{" "}
                      {new Date(slot.start_time).toLocaleTimeString()} -{" "}
                      {new Date(slot.end_time).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    🏫 Class: {slot.classId?.className || "Unnamed Course"}
                  </div>
                </div>
              ))}
              <div className="mt-4 text-center text-sm text-gray-600">
                <hr className="my-2" />
                Your day ends here <br />
                Enjoy your day
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
