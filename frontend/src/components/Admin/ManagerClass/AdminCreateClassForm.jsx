import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminCreateClassForm({ onSuccess, onCancel }) {
    const [form, setForm] = useState({
        className: "",
        courseId: "",
        progress: 0,
        note: "",
        start_time: "",
        end_time: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [courses, setCourses] = useState([]);
    const [courseQuery, setCourseQuery] = useState("");
    const [showCourseOptions, setShowCourseOptions] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(API_ENDPOINTS.GET_ALL_COURSE, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCourses(res.data.data || res.data);
            } catch (err) {}
        };
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((c) =>
        c.nameCourses.toLowerCase().includes(courseQuery.toLowerCase())
    );

    const handleSelectCourse = (course) => {
        setForm((f) => ({
            ...f,
            courseId: course._id,
        }));
        setCourseQuery(course.nameCourses);
        setShowCourseOptions(false);
    };

    const handleCourseQueryChange = (e) => {
        setCourseQuery(e.target.value);
        setShowCourseOptions(true);
        setForm((f) => ({
            ...f,
            course: e.target.value,
            courseId: "",
        }));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.courseId) {
            setError("Please select a course from the dropdown list.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                API_ENDPOINTS.CREATE_CLASS,
                {
                    ...form,
                    students: [],
                    progress: Number(form.progress),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (onSuccess) onSuccess();
        } catch (err) {
            setError("Failed to create class. Please check your information!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg relative"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Class</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="relative">
                        <label className="block mb-1 font-medium">Course</label>
                        <input
                            type="text"
                            value={courseQuery}
                            onChange={handleCourseQueryChange}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Enter course name"
                            autoComplete="off"
                            onFocus={() => setShowCourseOptions(true)}
                            readOnly={false}
                        />
                        {showCourseOptions && (
                            <ul className="absolute z-10 bg-white border rounded shadow max-h-40 overflow-auto w-full mt-1">
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((c) => (
                                        <li
                                            key={c._id}
                                            className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                                            onClick={() => handleSelectCourse(c)}
                                        >
                                            {c.nameCourses}
                                        </li>
                                    ))
                                ) : (
                                    <li className="px-3 py-1 text-gray-400">No courses found</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <input type="hidden" name="courseId" value={form.courseId} />
                    <div>
                        <label className="block mb-1 font-medium">Class Name</label>
                        <input
                            type="text"
                            name="className"
                            value={form.className}
                            onChange={handleChange}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Class name"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Note</label>
                        <input
                            type="text"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Note"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Start Date</label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                value={form.start_time}
                                onChange={handleChange}
                                className="w-full bg-blue-100 p-2 rounded"
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
