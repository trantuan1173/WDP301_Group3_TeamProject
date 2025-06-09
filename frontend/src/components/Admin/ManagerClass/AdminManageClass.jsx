import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { useNavigate } from "react-router-dom";


const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

const getStatusColor = (status) => {
  if (status === "Đang diễn ra") return "text-green-600";
  if (status === "Chưa bắt đầu") return "text-red-500";
  if (status === "Đã hoàn thành") return "text-orange-500";
  return "text-gray-800";
};

const getStatus = (progress) => {
  if (progress === 0) return "Chưa bắt đầu";
  if (progress >= 100) return "Đã hoàn thành";
  return "Đang diễn ra";
};

const AdminManageClass = () => {
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const handleViewDetail = (id) => {
    navigate(`/admin/class/${id}`, {
      state: { from: 'classes' }, // <== đây là key quan trọng
    });
  };
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(API_ENDPOINTS.GET_ALL_CLASSES, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClasses(response.data.data || response.data);
      } catch (error) {
        // Có thể thêm thông báo lỗi ở đây nếu muốn
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  return (
    <div className="bg-white min-h-screen p-8">
      <h2 className="font-extrabold text-2xl mb-8 tracking-wide">QUẢN LÝ LỚP HỌC</h2>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm lớp, giáo viên, khóa học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 border border-gray-300 rounded-full text-base bg-gray-50 outline-none"
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        <button className="bg-blue-100 text-gray-800 rounded-full px-5 py-2 font-semibold shadow-sm">Filter thời gian</button>
        <button className="bg-blue-100 text-gray-800 rounded-full px-5 py-2 font-semibold shadow-sm">Filter trạng thái</button>
        <button className="bg-white text-gray-800 rounded-full px-5 py-2 font-bold shadow-sm flex items-center gap-1 border border-gray-200">
          <span className="text-xl font-bold">+</span> Thêm lớp học
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">Tên lớp</th>
              <th className="text-left py-3 px-2">Khóa học</th>
              <th className="text-left py-3 px-2">Tháng mở</th>
              <th className="text-left py-3 px-2">Giáo viên phụ trách</th>
              <th className="text-left py-3 px-2">Số học sinh</th>
              <th className="text-left py-3 px-2">Tiến độ (%)</th>
              <th className="text-left py-3 px-2">Trạng thái lớp</th>
              <th className="text-left py-3 px-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8">Đang tải dữ liệu...</td>
              </tr>
            ) : (
              classes
                .filter(row =>
                  (row.course || "").toLowerCase().includes(search.toLowerCase()) ||
                  (row.courseId && row.courseId.nameCourses && row.courseId.nameCourses.toLowerCase().includes(search.toLowerCase())) ||
                  (row.note || "").toLowerCase().includes(search.toLowerCase())
                )
                .map((row, idx) => (
                  <tr key={row._id} className="border-b border-gray-100">
                    <td className="py-2 px-2">{idx + 1}</td>
                    <td className="py-2 px-2">{row.courseId && row.courseId.nameCourses ? row.courseId.nameCourses : "Chưa đặt tên"}</td>
                    <td className="py-2 px-2">{row.course || ""}</td>
                    <td className="py-2 px-2">{getMonthYear(row.start_time)}</td>
                    <td className={`py-2 px-2 ${row.teacherId ? "text-gray-800" : "text-red-500 font-bold"}`}>
                      {row.teacherId ? row.teacherId.name || "Đã phân công" : "Chưa có giáo viên"}
                    </td>
                    <td className="py-2 px-2">{row.students ? row.students.length : 0}/15</td>
                    <td className="py-2 px-2">{row.progress}%</td>
                    <td className={`py-2 px-2 font-bold ${getStatusColor(getStatus(row.progress))}`}>
                      {getStatus(row.progress)}
                    </td>
                    <td className="py-2 px-2">
                      <button
                        className="bg-gray-200 rounded-full px-4 py-1 font-semibold text-base"
                        onClick={() => handleViewDetail(row._id)}>
                        Chi tiết
                      </button>                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageClass;