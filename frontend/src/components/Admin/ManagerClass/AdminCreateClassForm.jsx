import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminCreateClassForm({ onSuccess, onCancel }) {
    const [form, setForm] = useState({
        
        course: "",
        progress: 0,
        note: "",
        start_time: "",
        end_time: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            setError("Tạo lớp học thất bại. Vui lòng kiểm tra lại thông tin!");
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
                <h2 className="text-2xl font-bold mb-6 text-center">Tạo lớp học mới</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* <div>
    <label className="block mb-1 font-medium">ID giáo viên</label>
    <input
      type="text"
      name="teacherId"
      value={form.teacherId}
      onChange={handleChange}
      className="w-full bg-blue-100 p-2 rounded"
      placeholder="ID giáo viên"
    />
  </div>
  <div>
    <label className="block mb-1 font-medium">ID khóa học</label>
    <input
      type="text"
      name="courseId"
      value={form.courseId}
      onChange={handleChange}
      className="w-full bg-blue-100 p-2 rounded"
      placeholder="ID khóa học"
    />
  </div> */}
                    <div>
                        <label className="block mb-1 font-medium">Tên lớp học</label>
                        <input
                            type="text"
                            name="course"
                            value={form.course}
                            onChange={handleChange}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Tên lớp học"
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Ghi chú</label>
                        <input
                            type="text"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Ghi chú"
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Ngày bắt đầu</label>
                            <input
                                type="datetime-local"
                                name="start_time"
                                value={form.start_time}
                                onChange={handleChange}
                                className="w-full bg-blue-100 p-2 rounded"
                                placeholder="Ngày bắt đầu"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block mb-1 font-medium">Ngày kết thúc</label>
                            <input
                                type="datetime-local"
                                name="end_time"
                                value={form.end_time}
                                onChange={handleChange}
                                className="w-full bg-blue-100 p-2 rounded"
                                placeholder="Ngày kết thúc"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Tiến độ (%)</label>
                        <input
                            type="number"
                            name="progress"
                            value={form.progress}
                            onChange={handleChange}
                            min={0}
                            max={100}
                            className="w-full bg-blue-100 p-2 rounded"
                            placeholder="Tiến độ (%)"
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
                            disabled={loading}
                        >
                            {loading ? "Đang tạo..." : "Tạo lớp học"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}