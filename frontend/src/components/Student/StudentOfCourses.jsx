import { useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../../../src/components/LoadingSpinner";
import { API_ENDPOINTS } from "../../config";
import { useAuth } from "../../context/AuthContext";
import {
  FaChalkboardTeacher,
  FaRegStickyNote,
  FaChartLine,
} from "react-icons/fa";

export default function StudentCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudentCourses = async (studentId) => {
    if (!studentId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = API_ENDPOINTS.GET_CLASSES_BY_STUDENT_ID(studentId);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data.data || []);
    } catch (err) {
      console.error("Error fetching student courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchStudentCourses(user._id);
    }
  }, [user]);

  if (loading) return <LoadingSpinner size={100} text="Loading courses..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br ml-3 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl pb-10 font-extrabold text-indigo-700 mb-10 animate-fade-in">
          My Enrolled Courses
        </h2>

        {courses.length === 0 ? (
          <div className="text-center text-gray-500 text-lg animate-fade-in">
            No courses found.
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course._id}
                className="relative bg-white rounded-3xl shadow-lg overflow-hidden transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 group animate-slide-up"
              >
                {course.course?.detail?.imageURL ? (
                  <img
                    src={course.course.detail.imageURL}
                    alt={course.course?.name || "Course image"}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No image available
                  </div>
                )}

                <div className="p-3 bg-gradient-to-r">
                  <h3 className="text-xl font-bold truncate">
                    {course.course?.name || "No course name"}
                  </h3>
                </div>

                <div className="pr-3 pl-3 pb-3 text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <FaRegStickyNote className="text-indigo-500" />
                    <span className="font-medium">Class:</span>
                    {course.className || "No class name"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaChalkboardTeacher className="text-indigo-500" />
                    <span className="font-medium">Teacher:</span>
                    {course.teacher?.email || "N/A"}
                  </p>
                  <p className="flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    <span className="font-medium">Progress:</span>
                    {course.progress ?? 0}%
                  </p>
                </div>

                <div className="p-4 border-t flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 hover:scale-105 transition duration-300">
                    View Details
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 hover:scale-105 transition duration-300">
                    Go to Course
                  </button>
                </div>

                <div className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-10 transition duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
