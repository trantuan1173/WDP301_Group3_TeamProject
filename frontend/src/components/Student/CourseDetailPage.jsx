import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaChalkboardTeacher,
  FaLayerGroup,
  FaTag,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaEnvelope,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import CourseFeedbackModal from "./CourseFeedbackModal";
import TeacherFeedbackModal from "./TeacherFeedbackModal";
import NavBar from "../Layouts/NavBar";

export default function CourseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const detail = course?.course?.detail;
  const [showCourseFeedback, setShowCourseFeedback] = useState(false);
  const [showTeacherFeedback, setShowTeacherFeedback] = useState(false);
  const [studentId, setStudentId] = useState();

  // Lấy studentId từ token đăng nhập theo mẫu bạn yêu cầu
  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setStudentId(decodedToken.id || decodedToken._id || decodedToken.studentId);
      }
    } catch (err) {
      setStudentId(undefined);
    }
  }, []);

  const handleSaveFeedback = (data) => {
    console.log("Saved feedback:", data);
    // Gửi data về backend tại đây nếu cần
  };

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-lg">
        No course data found. Please go back and select a course.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <NavBar />
      <div className="mt-8" />
      <div className="max-w-5xl mx-auto bg-white shadow rounded-2xl overflow-hidden relative">
        <div className="relative rounded-t-2xl overflow-hidden">
          {detail?.imageURL ? (
            <img
              src={detail.imageURL}
              alt="Course"
              className="w-full h-72 object-cover"
            />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400">
              No image available
            </div>
          )}

          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-2 py-1.5 px-3 bg-white/80 text-gray-800 text-sm rounded-full hover:bg-white transition backdrop-blur-sm shadow"
          >
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-700">
              {course.course?.name || "Unnamed Course"}
            </h1>
            <p className="text-gray-500 text-sm">
              <span className="font-medium">Class:</span>{" "}
              {course.className || "N/A"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaLayerGroup className="text-indigo-500" />
                <span className="font-semibold">Type:</span>{" "}
                <span className="inline-block bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                  {detail?.type || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaTag className="text-indigo-500" />
                <span className="font-semibold">Level:</span>{" "}
                <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                  {detail?.level || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaDollarSign className="text-indigo-500" />
                <span className="font-semibold">Price:</span>{" "}
                {detail?.price
                  ? new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(detail.price)
                  : "N/A"}
              </div>

              <div className="flex items-center gap-2">
                <FaClock className="text-indigo-500" />
                <span className="font-semibold">Duration:</span>{" "}
                {detail?.durationDays || "N/A"} days
              </div>
              <div className="flex items-center gap-2">
                <FaChalkboardTeacher className="text-indigo-500" />
                <span className="font-semibold">Teacher:</span>{" "}
                {course.teacher?.profileId.name || "N/A"}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-green-500" />
                  <span className="font-semibold">Progress:</span>{" "}
                  {course.progress ?? 0}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-indigo-500" />
                <span className="font-semibold">Teacher Mail:</span>{" "}
                {course.teacher?.email || "N/A"}
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-3">
            {course.progress >= 50 && (
              <>
                <button
                  onClick={() => setShowCourseFeedback(true)}
                  className="py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add feedback course
                </button>
                <button
                  onClick={() => {
                    setShowTeacherFeedback(true);
                  }}
                  className="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-400 transition"
                >
                  Add feedback teacher
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-6 bg-white shadow rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-indigo-600 mb-2">
          Description
        </h2>
        <hr className="mb-4" />
        <p className="text-gray-700 text-sm whitespace-pre-line">
          {detail?.description || "No description available"}
        </p>
      </div>
      {showCourseFeedback && (
        <CourseFeedbackModal
          courseName={course.course?.name}
          courseId={course.course?._id}
          userId={studentId}
          imageURL={detail?.imageURL}
          onClose={() => setShowCourseFeedback(false)}
          onSave={handleSaveFeedback}
        />
      )}

      {showTeacherFeedback && (
        <TeacherFeedbackModal
          teacherName={course.teacher?.profileId?.name}
          className={course.className}
          teacherId={course.teacher?._id}
          classId={course._id}
          studentId={studentId}
          onClose={() => setShowTeacherFeedback(false)}
          onSuccess={() => {/* reload hoặc thông báo nếu cần */ }}
        />
      )}
    </div>
  );
}