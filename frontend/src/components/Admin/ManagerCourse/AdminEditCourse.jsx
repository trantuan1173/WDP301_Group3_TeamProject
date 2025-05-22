import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AdminEditCourse({ courseData, onClose, onSubmit }) {
  const [form, setForm] = useState({ ...courseData });
  const [categories, setCategories] = useState([
    "Khóa học cho Người lớn / Sinh viên / Người đi làm",
    "Khóa học ngắn hạn chuyên đề",
  ]);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() !== "") {
      const newCat = newCategory.trim();
      setCategories((prev) => [...prev, newCat]);
      setForm((prev) => ({ ...prev, category: newCat }));
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.imageUrl.trim()) newErrors.imageUrl = "Không được để trống.";
    if (!form.category.trim()) newErrors.category = "Không được để trống.";
    if (!form.name.trim()) newErrors.name = "Không được để trống.";
    if (!form.level.trim()) newErrors.level = "Không được để trống.";
    if (!form.duration.trim()) newErrors.duration = "Không được để trống.";
    if (!form.price.trim()) newErrors.price = "Không được để trống.";
    if (!form.description.trim())
      newErrors.description = "Không được để trống.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(form);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-center">
          Chỉnh sửa khóa học
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Hình ảnh khoá học
            </label>

            {/* Xem trước ảnh */}
            <div className="w-full h-[150px] flex justify-center items-center border rounded mb-2 bg-gray-50">
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="max-h-full object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">Chưa có ảnh</span>
              )}
            </div>

            {/* Input URL ảnh */}
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.imageUrl ? "border-red-500" : ""
              }`}
              placeholder="Dán URL ảnh..."
            />
            {errors.imageUrl && (
              <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Danh mục khoá học
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}

            {!showNewCategoryInput && (
              <button
                type="button"
                onClick={() => setShowNewCategoryInput(true)}
                className="text-blue-600 text-sm mt-1 flex items-center gap-1"
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

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Tên khóa học
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Trình độ / Level
              </label>
              <input
                type="text"
                name="level"
                value={form.level}
                onChange={handleChange}
                className={`border p-2 rounded w-full ${
                  errors.level ? "border-red-500" : ""
                }`}
              />
              {errors.level && (
                <p className="text-red-500 text-sm mt-1">{errors.level}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Thời lượng (vd: 60 buổi)
            </label>
            <input
              type="text"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.duration ? "border-red-500" : ""
              }`}
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Học phí (vd: 2.000.000 VNĐ)
            </label>
            <input
              type="text"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={`border p-2 rounded w-full ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className={`border p-2 rounded w-full ${
              errors.description ? "border-red-500" : ""
            }`}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-400 rounded"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
