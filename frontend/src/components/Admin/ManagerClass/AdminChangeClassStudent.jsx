import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminChangeClassStudent({
    open,
    student,
    currentClassId,
    courseId,
    onSuccess,
    onCancel,
}) {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;
        const fetchClasses = async () => {
            try {
                setError("");
                const token = localStorage.getItem("token");
                const res = await axios.get(API_ENDPOINTS.GET_ALL_CLASSES, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const filtered = (res.data.data || []).filter(
                    (c) =>
                        c._id !== currentClassId &&
                        c.courseId &&
                        String(c.courseId._id) === String(courseId) &&
                        c.progress === 0
                );
                setClasses(filtered);
            } catch (err) {
                setError("Failed to fetch classes.");
            }
        };
        fetchClasses();
    }, [open, currentClassId, courseId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedClass) {
            setError("Please select a class to move the student.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            // Remove student from current class
            await axios.delete(
    API_ENDPOINTS.REMOVE_STUDENT_CLASS(currentClassId),
    {
        data: { studentId: student._id },
        headers: { Authorization: `Bearer ${token}` }
    }
);
            // Add student to new class
            await axios.post(
                API_ENDPOINTS.ADD_STUDENT_INTO_CLASS(selectedClass),
                { studentId: student._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to change class.");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <form
                className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleSubmit}
            >
                <h2 className="text-xl font-bold mb-4 text-center">Change Student's Class</h2>
                <div className="mb-2 text-gray-700">
                    <span className="font-semibold">Student:</span> {student?.email}
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
                        {error}
                    </div>
                )}
                <label className="block mb-3">
                    <span className="font-medium">Select new class</span>
                    <select
                        className="w-full border rounded p-2 mt-1"
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        required
                    >
                        <option value="">-- Choose class --</option>
                        {classes.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.className || c.courseId?.nameCourses || c._id}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex justify-end gap-3 mt-4">
                    <button
                        type="button"
                        className="bg-gray-300 px-4 py-2 rounded"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Confirm"}
                    </button>
                </div>
            </form>
        </div>
    );
}