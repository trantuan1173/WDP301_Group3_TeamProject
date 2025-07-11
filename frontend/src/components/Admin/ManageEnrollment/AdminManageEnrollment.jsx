import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import AdminAssignErollmentClass from "./AdminAssignErollmentClass";
import LoadingSpinner from "../../LoadingSpinner";

const AdminManageEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [courseFilter, setCourseFilter] = useState("All");

  // Tính ngày mặc định: 1 tháng trước đến hôm nay
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [fromDate, setFromDate] = useState(oneMonthAgo.toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(today.toISOString().slice(0, 10));

  // Fetch enrollments
  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_ALL_ENROLLMENTS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollments(
          (res.data.data || []).filter((item) => item.status === "pending")
        );
      } catch (err) {
        setEnrollments([]);
      }
      setLoading(false);
    };
    fetchEnrollments();
  }, []);

  // Lấy danh sách course duy nhất từ enrollments hiện tại
  const courseList = React.useMemo(() => {
    const map = {};
    enrollments.forEach((item) => {
      if (item.courseId?._id && item.courseId?.nameCourses) {
        map[item.courseId._id] = item.courseId.nameCourses;
      }
    });
    return [
      { _id: "All", nameCourses: "All Courses" },
      ...Object.entries(map).map(([id, nameCourses]) => ({ _id: id, nameCourses })),
    ];
  }, [enrollments]);

  // Filter enrollments by search, date, and course
  const filtered = enrollments
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .filter((item) => {
      const matchSearch =
        item.studentId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        item.courseId?.nameCourses?.toLowerCase().includes(search.toLowerCase());
      const enrolledAt = item.enrolledAt ? new Date(item.enrolledAt) : null;
      const matchFrom = fromDate ? (enrolledAt ? enrolledAt >= new Date(fromDate) : false) : true;
      const matchTo = toDate ? (enrolledAt ? enrolledAt <= new Date(toDate) : false) : true;
      const matchCourse =
        courseFilter === "All" || item.courseId?._id === courseFilter;
      return matchSearch && matchFrom && matchTo && matchCourse;
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Refetch enrollments after assign
  const handleAssignSuccess = () => {
    setSelectedEnrollmentId(null);
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(API_ENDPOINTS.GET_ALL_ENROLLMENTS, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEnrollments(
          (res.data.data || []).filter((item) => item.status === "pending")
        );
      })
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  };

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">ENROLL MANAGEMENT</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <span role="img" aria-label="calendar">📅</span>
          From:{" "}
          <input
            type="date"
            className="border rounded px-2 py-1 w-36"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            max={toDate}
          />
          To:{" "}
          <input
            type="date"
            className="border rounded px-2 py-1 w-36"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate}
            max={today.toISOString().slice(0, 10)}
          />
        </div>
        {/* Dropdown chọn course */}
        <select
          className="border rounded px-2 py-1 w-56"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          {courseList.map((c) => (
            <option key={c._id} value={c._id}>{c.nameCourses}</option>
          ))}
        </select>
      </div>
      <div className="bg-white rounded border shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="py-2 px-3 text-left">No.</th>
              <th className="py-2 px-3 text-left">Full Name</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Registration Date</th>
              <th className="py-2 px-3 text-left">Course Name</th>
              <th className="py-2 px-3 text-left">Account Status</th>
              <th className="py-2 px-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">No pending enrollments found.</td>
              </tr>
            ) : (
              paginated.map((item, idx) => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 px-3">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                  <td className="py-2 px-3">{item.studentId?.profileId?.name || "N/A"}</td>
                  <td className="py-2 px-3">{item.studentId?.email}</td>
                  <td className="py-2 px-3">
                    {item.enrolledAt
                      ? new Date(item.enrolledAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-2 px-3">{item.courseId?.nameCourses}</td>
                  <td className="py-2 px-3 capitalize">{item.status}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-800 transition"
                      onClick={() => setSelectedEnrollmentId(item._id)}
                    >
                      Assign
                    </button>
                    <button
                      className="border border-gray-600 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition"
                      disabled
                    >
                      Unassign
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4 gap-2">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 rounded bg-blue-700 text-white font-medium"
            >
              Prev
            </button>
          )}
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 rounded bg-blue-600 text-white font-medium"
            >
              Next
            </button>
          )}
          <span className="ml-3 text-sm text-gray-600 self-center">
            Page {currentPage} / {totalPages}
          </span>
        </div>
      )}
      {selectedEnrollmentId && (
        <AdminAssignErollmentClass
          enrollmentId={selectedEnrollmentId}
          onClose={() => setSelectedEnrollmentId(null)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
};

export default AdminManageEnrollment;