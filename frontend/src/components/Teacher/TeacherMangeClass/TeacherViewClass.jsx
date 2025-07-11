import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { API_ENDPOINTS } from "../../../config";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../LoadingSpinner";
const TeacherViewClass = ({ onViewClass }) => {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const teacherId = decodedToken.id;

        // Lấy danh sách lớp theo teacherId
        const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_TEACHERID(teacherId), {
          headers: { Authorization: `Bearer ${token}` }
        });
        const classList = res.data.data || [];
        setClasses(classList);

        // Lấy thông tin course cho từng lớp (để lấy image)
        const courseIds = [...new Set(classList.map(cls => cls.courseId))];
        const courseDetailPromises = courseIds.map(id =>
          axios.get(API_ENDPOINTS.GET_COURSE_BY_ID(id), {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        const courseDetails = await Promise.all(courseDetailPromises);
        const courseMap = {};
        courseDetails.forEach(res => {
          const data = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
          if (data && data.courseId && data.courseId._id) {
            courseMap[data.courseId._id] = data;
          }
        });
        setCourses(courseMap);
      } catch (err) {
        setClasses([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

   if (loading) return <LoadingSpinner size={120} text="Loading..." />;


return (
  <div className="px-8 py-4">
    <h1 className="text-3xl font-bold mb-6">My Classes</h1>
    <div className="border-2 border-blue-400 rounded-xl p-6 bg-[#eaf4fd]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {classes.map((cls) => {
          const courseDetail = courses[cls.courseId];
          return (
            <div
              key={cls._id}
              className="bg-white rounded-xl shadow p-0 flex flex-col items-center border"
              style={{ minHeight: 420 }}
            >
              <div className="w-full h-48 rounded-t-xl overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                  src={courseDetail?.imageURL || "/no-image.png"}
                  alt={cls.course}
                  className="object-contain h-full w-full"
                />
              </div>
              <div className="p-4 w-full flex-1 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-lg mb-1">{cls.className}</div>
                  <div className="text-gray-700 mb-2">
                    Progress: {cls.progress}/{courseDetail?.durationDays || "?"} sessions
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{cls.note}</div>
                </div>
                <button
                  className="mt-4 w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
                  onClick={() => onViewClass && onViewClass(cls._id)}
                >
                  View Class
                </button>
              </div>
            </div>
          );
        })}
        {/* Optional: Fill empty grid spots */}
        {Array.from({ length: (3 - (classes.length % 3)) % 3 }).map((_, idx) => (
          <div key={`empty-${idx}`} className="bg-transparent rounded-xl" />
        ))}
      </div>
    </div>
  </div>
);
}
export default TeacherViewClass;