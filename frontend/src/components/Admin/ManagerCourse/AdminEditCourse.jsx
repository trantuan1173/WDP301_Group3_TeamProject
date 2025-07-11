import { useState } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminEditCourse({ courseData, onClose, onSubmit, onRefresh, categories }) {
  const [form, setForm] = useState({
    ...courseData,
    name: courseData.nameCourses || "",
    courseId: courseData.courseId || "",
    courseDetailId: courseData._id || "",
    imageURL: courseData.imageURL || "",
    duration: courseData.durationDays || "",
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
      if (!categories.includes(newCat)) categories.push(newCat);
      setForm((prev) => ({ ...prev, type: newCat }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.imageURL.trim()) newErrors.imageURL = "Image URL is required";
    if (!form.type.trim()) newErrors.type = "Category is required";
    if (!form.name.trim()) newErrors.name = "Course name is required";
    if (!form.level.trim()) newErrors.level = "Level is required";
    if (!form.duration.toString().trim()) newErrors.duration = "Duration is required";
    if (!form.price.toString().trim()) newErrors.price = "Price is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const token = localStorage.getItem("token");

      // 1. Update course name
      await axios.put(
        API_ENDPOINTS.UPDATE_COURSE.replace(":courseId", form.courseId),
        { nameCourses: form.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Update course detail
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

      alert("Course updated successfully!");
      if (onSubmit) onSubmit({ ...form });
      if (onRefresh) onRefresh();
      onClose();
    } catch (err) {
      console.error("Error updating course:", err);
      alert("Failed to update the course!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-6 text-red-600 text-3xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-3xl font-bold mb-8 text-center">Edit Course</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Course image */}
          <div className="flex justify-center items-start">
            <img
              src={form.imageURL}
              alt="Image preview"
              className="rounded-xl object-contain"
              style={{ background: "#f3faff", width: "220px", height: "180px" }}
            />
          </div>

          {/* Main info */}
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Category</label>
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="bg-gray-100 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8"
                >
                  <option value="">-- Select category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <FaPen className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            {/* Course name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
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
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
          </div>
        </div>

        {/* Level / Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
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
            {errors.level && <p className="text-red-500 text-xs mt-1">{errors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
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
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Tuition */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee</label>
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
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            placeholder="Add course description..."
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
