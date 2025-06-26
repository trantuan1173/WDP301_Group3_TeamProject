import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { useNavigate } from "react-router-dom";
import AdminCreateClassForm from "./AdminCreateClassForm";
import LoadingSpinner from "../../LoadingSpinner";


const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const handleViewDetail = (id) => {
    navigate(`/admin/class/${id}`, {
      state: { from: "classes" },
    });
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchClasses();
  };

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
      console.error("Lỗi khi fetch lớp học:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredClasses = classes.filter((row) =>
    (row.className || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.courseId?.nameCourses || "").toLowerCase().includes(search.toLowerCase()) ||
    (row.note || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="bg-white min-h-screen p-8">
      {showCreateForm && (
        <AdminCreateClassForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
      <h2 className="font-extrabold text-2xl mb-8 tracking-wide">QUẢN LÝ LỚP HỌC</h2>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Tìm kiếm lớp, giáo viên, khóa học..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
        <button
          className="bg-white text-gray-800 rounded-full px-5 py-2 font-bold shadow-sm flex items-center gap-1 border border-gray-200"
          onClick={() => setShowCreateForm(true)}
        >
          <span className="text-xl font-bold">+</span> Thêm lớp học
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-200 font-semibold">
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
              paginatedClasses.map((row, idx) => (
                <tr key={row._id} className="border-b border-gray-100">
                  <td className="py-2 px-2">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="py-2 px-2">{row.className || ""}</td>
                  <td className="py-2 px-2">{row.courseId?.nameCourses || "Chưa có khóa học"}</td>
                  <td className="py-2 px-2">{getMonthYear(row.start_time)}</td>
                  <td className={`py-2 px-2 ${row.teacherId ? "text-green-500 font-bold" : "text-red-500 font-bold"}`}>
                    {row.teacherId?.name || row.teacherId?.email || "Chưa có giáo viên"}
                  </td>
                  <td className="py-2 px-2">{row.students?.length || 0}</td>
                  <td className="py-2 px-2">{row.progress}%</td>
                  <td className={`py-2 px-2 font-bold ${getStatusColor(getStatus(row.progress))}`}>
                    {getStatus(row.progress)}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-gray-200 rounded-full px-4 py-1 font-semibold text-base"
                      onClick={() => handleViewDetail(row._id)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <div className="text-sm text-gray-500">
            Trang {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={`px-3 py-1 rounded ${currentPage === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-3 py-1 rounded ${currentPage === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-blue-500 text-white"}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageClass;
