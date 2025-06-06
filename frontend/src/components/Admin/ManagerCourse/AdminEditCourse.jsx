import { useState } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminEditCourse({ courseData, onClose, onSubmit, onRefresh, categories }) {
  const [form, setForm] = useState({
    ...courseData,
    name: courseData.courseId?.nameCourses || "",
    courseId: courseData.courseId?._id || courseData.courseId || "",
    courseDetailId: courseData._id || "",
    imageURL: courseData.imageURL || courseData.imageUrl || "",
    duration: courseData.durationDays || courseData.duration || "",
    type: courseData.type || "",
    level: courseData.level || "",
    price: courseData.price || "",
    description: courseData.description || "",
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const newCat = newCategory.trim();
      categories.push(newCat);
      setForm((prev) => ({ ...prev, type: newCat }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.imageURL.trim()) newErrors.imageURL = "Can't be empty";
    if (!form.type.trim()) newErrors.type = "Can't be empty";
    if (!form.name.trim()) newErrors.name = "Can't be empty";
    if (!form.level.trim()) newErrors.level = "Can't be empty";
    if (!form.duration.toString().trim()) newErrors.duration = "Can't be empty";
    if (!form.price.toString().trim()) newErrors.price = "Can't be empty";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");

      // 1. Update tên khóa học
      await axios.put(
        API_ENDPOINTS.UPDATE_COURSE.replace(":courseId", form.courseId),
        { nameCourses: form.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Update chi tiết khóa học
      await axios.put(
        API_ENDPOINTS.UPDATE_COURSE_DETAIL.replace(":courseDetailId", form.courseDetailId),
        {
          type: form.type,
          level: form.level,
          price: parseFloat(form.price),
          description: form.description,
          durationDays: parseInt(form.duration),
          imageURL: form.imageURL,
          
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Cập nhật khóa học thành công!");
            if (onSubmit) onSubmit({ ...form }); // truyền dữ liệu mới ra ngoài
            if (onRefresh) onRefresh();
            onClose();
        } catch (err) {
      console.error("Lỗi cập nhật khóa học:", err);
      alert("Cập nhật khóa học thất bại!");
    }
  };

 return (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
    <div
      className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg relative"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-4 right-6 text-red-600 text-3xl font-bold"
        onClick={onClose}
      >
        ×
      </button>
      <h2 className="text-3xl font-bold mb-8 text-center">Chi tiết khóa học</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Ảnh khóa học */}
        <div className="flex justify-center items-start">
          <img
            src={form.imageURL}
            alt="Xem trước ảnh"
            className="rounded-xl object-contain"
            style={{ background: "#f3faff", width: "220px", height: "180px" }}
          />
        </div>
        {/* Thông tin chính */}
        <div className="flex flex-col gap-4">
          {/* Danh mục */}
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục khóa học</label>
  <div className="relative">
    <select
      name="type"
      value={form.type}
      onChange={handleChange}
      className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
    >
      <option value="">-- Chọn danh mục --</option>
      {categories.map((cat, idx) => (
        <option key={idx} value={cat}>{cat}</option>
      ))}
    </select>
    <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
  {/* Thông báo lỗi danh mục */}
  {errors.type && (
    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
  )}
  {!showNewCategoryInput && (
    <button
      type="button"
      onClick={() => setShowNewCategoryInput(true)}
      className="text-blue-600 text-xs mt-1 flex items-center gap-1"
    >
      <FaPlus className="text-xs" /> Thêm danh mục
    </button>
  )}
  {showNewCategoryInput && (
    <div className="mt-2 flex gap-2">
      <input
        type="text"
        placeholder="Tên danh mục mới"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="border p-1 rounded flex-1 text-sm"
      />
      <button
        onClick={handleAddCategory}
        className="text-white bg-blue-600 px-3 py-1 rounded text-sm"
      >
        Thêm
      </button>
    </div>
  )}
</div>
          {/* Tên khóa học */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 pr-8"
              />
              <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      {/* 2 cột: Trình độ/Thời lượng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ/ Level</label>
          <div className="relative">
            <input
              type="text"
              name="level"
              value={form.level}
              onChange={handleChange}
              className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 pr-8"
            />
            <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
          <div className="relative">
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 pr-8"
            />
            <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      {/* Học phí */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Học phí</label>
        <div className="relative">
          <input
            type="text"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 pr-8"
          />
          <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
      {/* Mô tả */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          name="description"
          placeholder="Thêm mô tả cho khóa học..."
          value={form.description}
          onChange={handleChange}
          className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-8 py-2 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700 transition"
        >
          Lưu
        </button>
      </div>
    </div>
  </div>
);
}