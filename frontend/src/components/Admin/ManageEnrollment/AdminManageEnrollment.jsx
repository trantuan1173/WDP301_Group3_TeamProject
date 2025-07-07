import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

const AdminManageEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  const filtered = enrollments.filter(
    (item) =>
      item.studentId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.courseId?.nameCourses?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input
          type="text"
          placeholder="Search"
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border px-3 py-2 rounded">
          <option>Pending approval</option>
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-blue-600" />
          Unassigned
        </label>
        <div className="flex items-center gap-2">
          <span role="img" aria-label="calendar">📅</span>
          From: <input type="text" className="border rounded px-2 py-1 w-16" />
          To: <input type="text" className="border rounded px-2 py-1 w-16" />
        </div>
      </div>
      <div className="bg-white rounded border shadow">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="py-2 px-3 text-left">Full Name</th>
              <th className="py-2 px-3 text-left">Email</th>
              <th className="py-2 px-3 text-left">Registration Date</th>
              <th className="py-2 px-3 text-left">Course Name</th>
              
              <th className="py-2 px-3 text-left">Account Status</th>
              <th className="py-2 px-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-6">No pending enrollments found.</td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="py-2 px-3">{item.studentId?.fullName || "N/A"}</td>
                  <td className="py-2 px-3">{item.studentId?.email}</td>
                  <td className="py-2 px-3">
                    {item.enrolledAt
                      ? new Date(item.enrolledAt).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="py-2 px-3">{item.courseId?.nameCourses}</td>
                  
                  <td className="py-2 px-3 capitalize">{item.status}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-800 transition">
                      Assign
                    </button>
                    <button className="border border-gray-400 px-3 py-1 rounded text-sm font-semibold hover:bg-gray-100 transition">
                      Unassign
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageEnrollment;