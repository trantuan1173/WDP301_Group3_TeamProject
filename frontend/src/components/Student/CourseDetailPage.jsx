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
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function CourseDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { course } = location.state || {};
  const detail = course?.course?.detail;
  console.log(course);
  const [showCourseFeedback, setShowCourseFeedback] = useState(false);
  const [showTeacherFeedback, setShowTeacherFeedback] = useState(false);
  const [studentId, setStudentId] = useState();
  const [downloading, setDownloading] = useState(false);

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

  const downloadZip = async () => {
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.DOWNLOAD_ALL_MATERIALS_ZIP(course._id), {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "class_materials.zip");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error downloading zip:", err);
    } finally {
      setDownloading(false);
    }
  };

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
            {/* <button
              onClick={downloadZip}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {downloading ? "Downloading..." : "Download Learner Material"}
            </button> */}
            <button
              onClick={downloadZip}
              disabled={downloading}
              className={`py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 ${downloading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {downloading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12"
                    />
                  </svg>
                  Download Learner Material
                </>
              )}
            </button>
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