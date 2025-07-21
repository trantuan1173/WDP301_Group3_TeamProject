import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br ml-3 py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl pb-4  font-extrabold text-indigo-700 mb-10 animate-fade-in">
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
                className="relative bg-white rounded-3xl shadow-lg   hover:shadow-2xl transition duration-300 group animate-slide-up"
              >
                {course.course?.detail?.imageURL ? (
                  <img
                    src={course.course.detail.imageURL}
                    alt={course.course?.name || "Course image"}
                    className="w-full h-74 object-cover"
                  />
                ) : (
                  <div className="w-full h-74 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No image available
                  </div>
                )}

                <div className="pl-7 pt-3 bg-gradient-to-r">
                  <h3 className="text-xl font-bold truncate">
                    {course.course?.name || "No course name"}
                  </h3>
                </div>

                <div className="m-3 pl-3  text-sm text-gray-700">
                  <p className="flex items-center gap-2">
                    <FaRegStickyNote className="text-indigo-500" />
                    <span className="font-medium">Class:</span>
                    {course.className || "No class name"}
                  </p>
               
                  <p className="flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    <span className="font-medium">Progress:</span>
                    {course.progress ?? 0}%
                  </p>
                </div>

                <div className="p-4 border-t flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 hover:scale-105 transition duration-300"
                    onClick={() => navigate(`/courses/${course._id}`, { state: { course } })}
                  >
                    View Details
                  </button>
                  
                </div>

                <div className="absolute inset-0 pointer-events-none bg-indigo-100 opacity-0 group-hover:opacity-10 transition duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
