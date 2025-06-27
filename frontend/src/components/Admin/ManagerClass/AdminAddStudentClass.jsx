import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminAddStudentClass({ classId, courseId,courseName, onSuccess, onCancel }) {
    const [students, setStudents] = useState([]);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(API_ENDPOINTS.GET_EROLLED_STUDENTS_BY_COURSE_ID(courseId), {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Lọc status pending
                setStudents(res.data.data.filter(e => e.status === "pending"));
            } catch {
                setStudents([]);
            }
        };
        fetchPending();
    }, [courseId]);

    const handleCheck = (enrollmentId) => {
        setSelected(prev =>
            prev.includes(enrollmentId)
                ? prev.filter(id => id !== enrollmentId)
                : [...prev, enrollmentId]
        );
    };

    const handleAdd = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            for (const enrollment of students.filter(e => selected.includes(e._id))) {
                // 1. Add student to class
                await axios.post(
                    API_ENDPOINTS.ADD_STUDENT_INTO_CLASS(classId),
                    { studentId: enrollment.studentId._id }, // phải đúng là studentId
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // 2. Update enrollment status
                await axios.put(
                    API_ENDPOINTS.UPDATE_EROLLED_STATUS(enrollment._id),
                    { status: "active" },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }
            if (onSuccess) onSuccess();
            window.location.reload();
        } catch (err) {
            console.log(err.response?.data); // Xem lỗi chi tiết
            alert("Failed to add students.");
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onCancel}>
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg relative" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Enrollment list</h2>
<div className="mb-2 font-semibold">
  Course: {courseName}
</div>
{students.length === 0 ? (
  <div className="text-gray-500">No pending students found.</div>
) : (
  <form onSubmit={e => { e.preventDefault(); handleAdd(); }}>
    <div className="max-h-72 overflow-auto mb-4">
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-blue-100">
            <th className="px-2 py-1 border">No.</th>
            <th className="px-2 py-1 border">Email</th>
            <th className="px-2 py-1 border">Select</th>
          </tr>
        </thead>
        <tbody>
          {students.map((e, idx) => (
            <tr key={e._id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="px-2 py-1 border text-center">{idx + 1}</td>
              <td className="px-2 py-1 border">{e.studentId.email}</td>
              <td className="px-2 py-1 border text-center">
                <input
                  type="checkbox"
                  checked={selected.includes(e._id)}
                  onChange={() => handleCheck(e._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-end gap-2">
      <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onCancel}>Cancel</button>
      <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded" disabled={loading || selected.length === 0}>
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  </form>
)}
            </div>
        </div>
    );
}