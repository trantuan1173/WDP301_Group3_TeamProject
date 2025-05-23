import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminAddCourse({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    nameCourses: "",
    category: "",
    level: "",
    price: "",
    description: "",
    durationDays: "",
    imageURL: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async () => {
    const {
      nameCourses,
      category,
      level,
      price,
      description,
      durationDays,
      imageURL,
    } = form;

    if (!nameCourses) return setError("Tên khóa học là bắt buộc");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Tạo khóa học
      const courseRes = await axios.post(
        API_ENDPOINTS.CREATE_COURSE,
        { nameCourses },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const courseId = courseRes.data.data._id;

      // Tạo chi tiết khóa học
      await axios.post(
        API_ENDPOINTS.CREATE_COURSE_DETAIL,
        {
          courseId,
          type: category,
          level,
          price: parseFloat(price),
          description,
          durationDays: parseInt(durationDays),
          imageURL,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Thêm khóa học thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Thêm khóa học mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            name="imageURL"
            value={form.imageURL}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
            placeholder="URL/ Ảnh"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
          >
            <option value="">Danh mục khóa học</option>
            <option value="ielts">Khóa học IELTS</option>
            <option value="giao_tiep">Giao tiếp</option>
            <option value="nguoi_lon">Khóa học cho Người lớn</option>
          </select>
          <input
            name="nameCourses"
            value={form.nameCourses}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
            placeholder="Tên khóa học"
          />
          <input
            name="level"
            value={form.level}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
            placeholder="Trình độ/ Level"
          />
          <input
            name="durationDays"
            value={form.durationDays}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
            placeholder="Thời lượng"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded"
            placeholder="Học phí"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="bg-blue-100 p-2 rounded col-span-1 md:col-span-2"
            rows={3}
            placeholder="Mô tả"
          />
        </div>

        {error && <p className="text-red-500 text-center mb-2">{error}</p>}

        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
          >
            {loading ? "Đang thêm..." : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
}