import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { useNavigate } from "react-router-dom";
import AdminCreateClassForm from "./AdminCreateClassForm";
import LoadingSpinner from "../../LoadingSpinner";
import { FaPlus } from "react-icons/fa";

const getMonthYear = (dateStr) => {
  const d = new Date(dateStr);
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const getStatusColor = (status) => {
  if (status === "In Progress") return "text-green-600";
  if (status === "Not Started") return "text-red-500";
  if (status === "Completed") return "text-orange-500";
  return "text-gray-800";
};

const getStatus = (progress) => {
  if (progress === 0) return "Not Started";
  if (progress >= 100) return "Completed";
  return "In Progress";
};

const getAllMonths = (classes) => {
  const months = Array.from(
    new Set(
      classes
        .map((row) => row.start_time && getMonthYear(row.start_time))
        .filter(Boolean)
    )
  );
  return months.sort((a, b) => {
    const [ma, ya] = a.split("/").map(Number);
    const [mb, yb] = b.split("/").map(Number);
    return yb - ya || mb - ma;
  });
};

const statusOptions = [
  "All",
  "Not Started",
  "In Progress",
  "Completed",
];

const AdminManageClass = () => {
  const [search, setSearch] = useState("");
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [monthFilter, setMonthFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, monthFilter, statusFilter]);

  // Sắp xếp lớp từ mới nhất đến cũ nhất theo createdAt
  const sortedClasses = classes.slice().sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const months = getAllMonths(sortedClasses);

  const filteredClasses = sortedClasses.filter((row) => {
    const matchSearch =
      (row.className || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.courseId?.nameCourses || "").toLowerCase().includes(search.toLowerCase()) ||
      (row.note || "").toLowerCase().includes(search.toLowerCase());

    const matchMonth =
      monthFilter === "All" ||
      getMonthYear(row.start_time) === monthFilter;

    const matchStatus =
      statusFilter === "All" ||
      getStatus(row.progress) === statusFilter;

    return matchSearch && matchMonth && matchStatus;
  });

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
      <h2 className="font-extrabold text-2xl mb-8 tracking-wide">CLASS MANAGEMENT</h2>
      <div className="flex gap-3 mb-6 flex-wrap items-center">
        <div className="relative flex-1 min-w-[220px]">
          <input
            type="text"
            placeholder="Search class, course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-2.5 pl-4 pr-10 border border-gray-300 rounded-full text-base bg-gray-50 outline-none font-normal"
            style={{ fontWeight: 400, fontFamily: "inherit" }}
          />
          <span className="absolute right-3 top-3 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>
        {/* Month filter */}
        <select
          className="bg-blue-100 text-gray-800 rounded-full px-3 py-1 font-normal shadow-sm min-w-[110px] text-sm transition-all"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
          style={{ fontWeight: 400, fontFamily: "inherit" }}
        >
          <option value="All">All months</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        {/* Status filter */}
        <select
          className="bg-blue-100 text-gray-800 rounded-full px-3 py-1 font-normal shadow-sm min-w-[90px] text-sm transition-all"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ fontWeight: 400, fontFamily: "inherit" }}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          className="bg-blue-600 text-white rounded-full px-5 py-2 font-semibold shadow-sm flex items-center gap-2 border border-blue-600 hover:bg-blue-700 transition-all"
          onClick={() => setShowCreateForm(true)}
          style={{ fontWeight: 500, fontFamily: "inherit" }}
        >
          <FaPlus className="text-base" />
          Add class
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-200 font-semibold">
              <th className="text-left py-3 px-2 font-normal">ID</th>
              <th className="text-left py-3 px-2 font-normal">Class Name</th>
              <th className="text-left py-3 px-2 font-normal">Course</th>
              <th className="text-left py-3 px-2 font-normal">Open Month</th>
              <th className="text-left py-3 px-2 font-normal">Teacher</th>
              <th className="text-left py-3 px-2 font-normal">Students</th>
              <th className="text-left py-3 px-2 font-normal">Progress (%)</th>
              <th className="text-left py-3 px-2 font-normal">Status</th>
              <th className="text-left py-3 px-2 font-normal">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 font-normal">Loading data...</td>
              </tr>
            ) : (
              paginatedClasses.map((row, idx) => (
                <tr key={row._id} className="border-b border-gray-100">
                  <td className="py-2 px-2 font-normal">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="py-2 px-2 font-normal">{row.className || row.course || ""}</td>
                  <td className="py-2 px-2 font-normal">{row.courseId?.nameCourses || "No course"}</td>
                  <td className="py-2 px-2 font-normal">{getMonthYear(row.start_time)}</td>
                  <td className={`py-2 px-2 font-normal ${row.teacherId ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}`}>
                    {row.teacherId?.name || row.teacherId?.email || "No teacher"}
                  </td>
                  <td className="py-2 px-2 font-normal">{row.students?.length || 0}</td>
                  <td className="py-2 px-2 font-normal">{row.progress}%</td>
                  <td className={`py-2 px-2 font-semibold ${getStatusColor(getStatus(row.progress))}`}>
                    {getStatus(row.progress)}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      className="bg-gray-200 rounded-full px-4 py-1 font-normal text-base hover:bg-gray-300 transition-all"
                      onClick={() => handleViewDetail(row._id)}
                    >
                      Detail
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
          <div className="text-sm text-gray-500 font-normal">
            Page {currentPage} / {totalPages}
          </div>
          <div className="flex gap-2">
            {/* Ẩn Prev nếu ở trang đầu */}
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 rounded font-normal bg-blue-500 text-white"
              >
                Prev
              </button>
            )}
            {/* Hiện Next nếu chưa phải trang cuối */}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 rounded font-normal bg-blue-500 text-white"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageClass;