import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import NavBar from "../../Layouts/NavBar";
import AdminCreateClassForm from "./AdminCreateClassForm";
import AdminAddTeacherClassForm from "./AdminAddTeacherClassForm";



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
  const [showAddTeacherForm, setShowAddTeacherForm] = useState(false);
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
      setClassData(res.data.data || res.data);
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

  if (loading) {
    return <div className="p-8">Đang tải dữ liệu...</div>;
  }

  if (!classData) {
    return <div className="p-8 text-red-500">Không tìm thấy dữ liệu lớp học.</div>;
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

    <div className="bg-white min-h-screen p-8">
      <NavBar />
      <h2 className="text-2xl font-bold mb-4 p-8 ">
        Khóa học {classData.course || ""} - {classData.courseId?.nameCourses || "Tên lớp"}
      </h2>
      <div className="flex items-center mb-4 w-full">
        <div className="flex gap-4 flex-1">
          <div className="flex gap-4 flex-1">
            <button className="bg-blue-100 text-gray-800 rounded-full min-w-[140px] px-5 py-2 font-semibold shadow-sm border border-gray-300 hover:font-bold transition-all duration-150"
            onClick={() => setShowAddTeacherForm(true)}>
              {classData.teacherId ? "Thay đổi giảng viên" : "+ Thêm giảng viên"}
            </button>
            <button className="bg-blue-100 text-gray-800 rounded-full min-w-[140px] px-5 py-2 font-semibold shadow-sm border border-gray-300 hover:font-bold transition-all duration-150"
              >
              {classData.courseId ? "Thay đổi khóa học" : "+ Thêm khóa học"}
            </button>
          </div>
        </div>
        <button
          className="ml-auto bg-gray-200 text-gray-800 rounded-full min-w-[110px] px-5 py-2 font-semibold shadow-sm border border-gray-300 hover:font-bold transition-all duration-150"
          onClick={handleBack}
        >
          Quay lại
        </button>
        
      </div>
      {showAddTeacherForm && (
        <AdminAddTeacherClassForm
        classId={classId}
        onSuccess={handleAddTeacherSuccess}
        onCancel={() => setShowAddTeacherForm(false)}
        />
        )}
      <hr className="mb-6" />

      <div className="mb-8">
        <div className="grid grid-cols-2 gap-y-2 gap-x-12 max-w-2xl">
          <div className="font-medium">Giáo viên phụ trách:</div>
          <div className={classData.teacherId ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
            {classData.teacherId?.email || "Chưa có giáo viên"}
          </div>
          <div className="font-medium">Tên lớp:</div>
          <div>{classData.course || "Chưa đặt tên"}</div>
          <div className="font-medium">Thời gian học:</div>
          <div>Chưa có API</div>
          <div className="font-medium">Khóa học:</div>
          <div>{classData.courseId?.nameCourses || ""}</div>
          <div className="font-medium">Tháng mở:</div>
          <div>{getMonthYear(classData.start_time)}</div>
          <div className="font-medium">Trạng thái lớp:</div>
          <div className={getStatusColor(status)}>{status}</div>
          <div className="font-medium">Số học sinh:</div>
          <div>{classData.students?.length || 0}</div>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-500 mb-2 mt-8">Danh sách học viên</h3>
      <hr className="mb-2" />
      {(!classData.students || classData.students.length === 0) ? (
        <div className="text-gray-600 mt-2">Không có dữ liệu học viên</div>
      ) : (
        <ul className="list-disc ml-8">
          {classData.students.map((student, idx) => (
            <li key={student._id || idx}>{student.email || "Không rõ"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}