import { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function AdminAddCourse({ onClose, onSubmit }) {
    const [form, setForm] = useState({
        imageUrl: "",
        category: "",
        name: "",
        level: "",
        duration: "",
        price: "",
        description: "",
    });

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
            setCategories((prev) => [...prev, newCategory.trim()]);
            setForm({ ...form, category: newCategory.trim() });
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
        if (!form.duration.trim()) {
            newErrors.duration = "Không được để trống.";
        } else if (isNaN(form.duration)) {
            newErrors.duration = "Phải là số.";
        }
        if (!form.price.trim()) {
            newErrors.price = "Không được để trống.";
        } else if (isNaN(form.price)) {
            newErrors.price = "Phải là số.";
        }
        if (!form.description.trim()) newErrors.description = "Không được để trống.";

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
                <h2 className="text-xl font-semibold mb-4 text-center">Thêm khóa học mới</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <input
                            type="text"
                            name="imageUrl"
                            placeholder="URL/Ảnh"
                            value={form.imageUrl}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.imageUrl ? "border-red-500" : ""}`}
                        />
                        {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                    </div>

                    {/* Dropdown danh mục */}
                    <div className="relative">
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.category ? "border-red-500" : ""}`}
                        >
                            <option value="">Danh mục khoá học</option>
                            {categories.map((cat, idx) => (
                                <option key={idx} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}

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
                    </div>

                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Tên khóa học"
                            value={form.name}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            name="level"
                            placeholder="Trình độ/Level"
                            value={form.level}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.level ? "border-red-500" : ""}`}
                        />
                        {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Thời lượng"
                            value={form.duration}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.duration ? "border-red-500" : ""}`}
                        />
                        {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                    </div>

                    <div>
                        <input
                            type="number"
                            name="price"
                            placeholder="Học phí"
                            value={form.price}
                            onChange={handleChange}
                            className={`border p-2 rounded w-full ${errors.price ? "border-red-500" : ""}`}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </div>
                </div>

                <div className="mb-4">
                    <textarea
                        name="description"
                        placeholder="Mô tả"
                        value={form.description}
                        onChange={handleChange}
                        className={`border p-2 rounded w-full ${errors.description ? "border-red-500" : ""}`}
                        rows={3}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
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
                        className="px-4 py-2 bg-indigo-600 text-white rounded"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
}
