import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

const AdminAssignErollmentClass = ({ enrollmentId, onClose, onSuccess }) => {
  const [enrollment, setEnrollment] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch enrollment info
  useEffect(() => {
    const fetchEnrollment = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_ENROLLMENT_BY_ID(enrollmentId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrollment(res.data.data);
      } catch (err) {
        setEnrollment(null);
      }
    };
    if (enrollmentId) fetchEnrollment();
  }, [enrollmentId]);

  // Fetch classes by courseId with progress=0 and students <= 15
  useEffect(() => {
    const fetchClasses = async () => {
      if (!enrollment?.courseId?._id) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_CLASSES_BY_COURSE_ID(enrollment.courseId._id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(
          (res.data.data || []).filter(
            (cls) => cls.progress === 0 && (cls.students?.length || 0) < 15
          )
        );
      } catch (err) {
        setClasses([]);
      }
    };
    if (enrollment?.courseId?._id) fetchClasses();
  }, [enrollment?.courseId?._id]);

  const handleAssign = async () => {
    if (!selectedClassId || !enrollment) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // 1. Add student to class
      await axios.post(
        API_ENDPOINTS.ADD_STUDENT_INTO_CLASS(selectedClassId),
        { studentId: enrollment.studentId._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // 2. Update enrollment status
      await axios.put(
        API_ENDPOINTS.UPDATE_EROLLED_STATUS(enrollment._id),
        { status: "active" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (onSuccess) onSuccess();
      alert("Assign Student Successfully");
      onClose();
    } catch (err) {
      alert("Failed to assign student.");
    }
    setLoading(false);
  };

  if (!enrollment) {
    return (
      <div className="p-8 text-center">
        <div>Loading enrollment info...</div>
      </div>
    );
  }

  return (
    <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-lg shadow-lg p-8 min-w-[400px] max-w-[95vw]"
      onClick={e => e.stopPropagation()}
    >
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-900">Assign Class</h2>
        <div className="mb-2 flex flex-col gap-2">
          <div>
            <span className="font-semibold">Student:</span> {enrollment.studentId?.fullName || "N/A"}
          </div>
          <div>
            <span className="font-semibold">Email:</span> {enrollment.studentId?.email}
          </div>
          <div>
            <span className="font-semibold">Course:</span> {enrollment.courseId?.nameCourses}
          </div>
          
          <div>
            <span className="font-semibold">Class:</span>
            <select
              className="border rounded px-3 py-2 mt-1 w-full"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.className}
                </option>
              ))}
            </select>
            {classes.length === 0 && (
              <div className="text-xs text-red-500 mt-1">No available class for this course.</div>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-700 text-white font-semibold hover:bg-blue-800"
            onClick={handleAssign}
            disabled={!selectedClassId || loading}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignErollmentClass;