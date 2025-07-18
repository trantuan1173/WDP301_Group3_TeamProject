import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import NavBar from "../../Layouts/NavBar";
import AdminAddTeacherClassForm from "./AdminAddTeacherClassForm";
import LoadingSpinner from "../../LoadingSpinner";
import AdminAddStudentClass from "./AdminAddStudentClass";
import AdminManageClassStudentList from "./AdminManageClassStudentList";
import { FaChevronDown, FaChevronUp, FaPlus, FaUserPlus, FaCalendarAlt, FaArrowLeft, FaExchangeAlt, FaUsers } from "react-icons/fa";


const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const getStatus = (progress) => {
  if (progress === 0) return "Chưa bắt đầu";
  if (progress >= 100) return "Đã hoàn thành";
  return "Đang diễn ra";
};

const getStatusColor = (status) => {
  if (status === "Đang diễn ra") return "text-green-600";
  if (status === "Chưa bắt đầu") return "text-red-500";
  if (status === "Đã hoàn thành") return "text-orange-500";
  return "text-gray-800";
};

export default function AdminViewClassDetails() {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
  const [showStudentList, setShowStudentList] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleAddTeacherSuccess = () => {
    setShowAddTeacherForm(false);
    fetchClass();
  };

  const fetchClass = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_ENDPOINTS.GET_CLASS_BY_ID(classId), {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClassData(res.data.data);
    } catch (err) {
      setClassData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClass();
    // eslint-disable-next-line
  }, [classId]);

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  if (!classData) {
    return <div className="p-8 text-red-500">No class data.</div>;
  }

  const status = getStatus(classData.progress);
  const handleBack = () => {
    if (from === 'classes') {
      navigate('/admin', { state: { selectedPage: 'classes' } });
    } else {
      navigate('/admin');
    }
  };

  return (
    <div>
<header className="w-full ">
        <NavBar />
      </header>
    <div className="bg-gray-50 min-h-screen px-6 md:px-16 py-8 font-sans">
      

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Course:&nbsp;
          {typeof classData.course === "object"
            ? (classData.course.name || classData.course._id || "Unknown")
            : (classData.course || "Unknown")}
        </h2>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4 justify-between mb-10">
        <div className="flex flex-wrap gap-4">
          <button
            className={`rounded-md px-5 py-2 font-semibold shadow-sm text-white flex items-center gap-2 transition ${classData.teacherId ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
              }`}
            onClick={() => setShowAddTeacherForm(true)}
          >
            {classData.teacherId ? <FaExchangeAlt /> : <FaPlus />}
            {classData.teacherId ? "Change Teacher" : "Add Teacher"}
          </button>

          <button
            className="bg-green-600 text-white rounded-md px-5 py-2 font-semibold shadow-sm hover:bg-green-700 flex items-center gap-2 transition"
            onClick={() => setShowAddStudentForm(true)}
          >
            <FaUserPlus /> Add Student
          </button>

          <button
            className="bg-indigo-600 text-white rounded-md px-5 py-2 font-semibold shadow-sm hover:bg-indigo-700 flex items-center gap-2 transition"
            onClick={() => navigate(`/admin/class/${classId}/schedule`)}
          >
            <FaCalendarAlt /> View Schedule
          </button>
        </div>

        <button
          className="bg-gray-300 text-gray-800 rounded-md px-5 py-2 font-semibold shadow-sm hover:bg-gray-400 flex items-center gap-2 transition"
          onClick={handleBack}
        >
          <FaArrowLeft /> Back
        </button>
      </div>

      {/* Add Forms */}
      {showAddTeacherForm && (
        <AdminAddTeacherClassForm
          classId={classId}
          onSuccess={handleAddTeacherSuccess}
          onCancel={() => setShowAddTeacherForm(false)}
        />
      )}
      {showAddStudentForm && (
        <AdminAddStudentClass
          classId={classId}
          courseId={classData.course?._id || classData.course}
          courseName={classData.course?.name || ""}
          onSuccess={() => {
            setShowAddStudentForm(false);
            fetchClass();
          }}
          onCancel={() => setShowAddStudentForm(false)}
        />
      )}

      {/* Class Info Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12 text-[15px]">
          <div className="text-gray-500">Teacher:</div>
          <div className={classData.teacherId ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
            {classData.teacherId && typeof classData.teacherId === "object"
              ? (classData.teacherId.profileId?.name || "No teacher")
              : (classData.teacherId || "No teacher")}
          </div>

          <div className="text-gray-500">Class Name:</div>
          <div className="text-gray-800">{classData.className || "Untitled"}</div>
          <div className="text-gray-500">Duration:</div>
          <div className="text-gray-800">{classData.course?.detail?.durationDays || "--"} sessions</div>
          <div className="text-gray-500">Course:</div>
          <div className="text-gray-800">{classData.course?.name || "N/A"}</div>
          <div className="text-gray-500">Start Month:</div>
          <div className="text-gray-800">{getMonthYear(classData.start_time)}</div>
          <div className="text-gray-500">Status:</div>
          <div className={`${getStatusColor(status)} font-semibold`}>{status}</div>
          <div className="text-gray-500">Number of Students:</div>
          <div className="text-gray-800">{classData.students?.length || 0}</div>
        </div>
      </div>

      {/* Student List Section */}
      <div className="max-w-5xl">
        <button
          className="flex items-center gap-2 text-3xl font-semibold text-blue-700 mb-2 mt-4 focus:outline-none hover:underline"
          onClick={() => setShowStudentList((prev) => !prev)}
        >
          <FaUsers />
          Student List
          {showStudentList ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div
          className={`transition-all duration-500 overflow-hidden ${showStudentList ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <hr className="mb-2" />
          <div className="bg-white rounded-lg shadow border p-4">
            <AdminManageClassStudentList
              students={classData.students}
              currentClassId={classData._id}
              courseId={classData.course?._id || classData.course}
              fetchClass={fetchClass}
            />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}