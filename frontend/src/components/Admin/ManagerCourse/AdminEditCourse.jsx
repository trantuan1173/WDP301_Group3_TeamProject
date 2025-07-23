import { useState, useEffect } from "react";
import { FaPlus, FaPen } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { useAuth } from "../../../context/AuthContext";

export default function AdminEditCourse({ courseData, onClose, onSubmit, onRefresh, categories }) {
  const { user } = useAuth();
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
    materials: courseData.materials || [],
  });
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [errors, setErrors] = useState({});
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ description: "", file: null });
  const [materials, setMaterials] = useState([]);

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

  // Upload material to server
  const uploadMaterialToServer = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("courseId", form.courseId);
    formData.append("uploadedBy", user._id); // thay bằng user ID thực tế
    formData.append("fileType", newMaterial.file?.type || "application/octet-stream");
    formData.append("courseName", form.name);
    // formData.append("file", newMaterial.file);
    newMaterial.file.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const res = await axios.post(
        `${API_ENDPOINTS.CREATE_LEARNING_MATERIAL}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const savedMaterial = res.data.learningMaterial;
      setForm((prev) => ({
        ...prev,
        materials: [...prev.materials, savedMaterial],
      }));
      setNewMaterial({ description: "", file: null });
      setShowMaterialModal(false);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload material");
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          API_ENDPOINTS.GET_ALL_LEARNING_MATERIALS_BY_COURSE_ID(form.courseId),
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
        setMaterials(res.data.learningMaterials);
      } catch (err) {
        console.error("Error fetching materials:", err);
        alert("Failed to fetch materials");
      }
    };
    fetchMaterials();
  }, [form.courseId, form.materials]);

  const handleDownloadMaterial = async (materialId, title) => {
    try {
      const res = await axios.get(
        API_ENDPOINTS.DOWNLOAD_LEARNING_MATERIAL(materialId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", title); // Tạo tên file
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading material:", err);
      alert("Failed to download material");
    }
  };
  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm("Do you want to delete this material?")) return;
    try {
      await axios.delete(API_ENDPOINTS.DELETE_LEARNING_MATERIAL(materialId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMaterials((prev) => prev.filter((material) => material._id !== materialId));
    } catch (err) {
      console.error("Error deleting material:", err);
      alert("Failed to delete material");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
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

        {/* Course Materials */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Learning Materials</label>
            <button
              onClick={() => setShowMaterialModal(true)}
              className="flex items-center gap-2 px-4 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <FaPlus /> Add Material
            </button>
          </div>
          {/* Example materials list */}
          <div className="bg-blue-100 rounded p-2 max-h-[150px] overflow-y-auto whitespace-pre-line">
            <table className="w-full text-sm text-left">
              <thead className="bg-blue-200 sticky top-0">
                <tr>
                  <th className="p-2">No.</th>
                  <th className="p-2">File name</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{material.title}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDownloadMaterial(material._id, material.title)}
                        className="text-blue-600 hover:underline"
                      >
                        Download
                      </button>
                      <span className="mx-2">|</span>
                      <button
                        onClick={() => handleDeleteMaterial(material._id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
      {/* Material Modal */}
      {showMaterialModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowMaterialModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold mb-4">Add Course Material</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select File</label>
              {/* <input
              type="file"
              onChange={(e) => setNewMaterial({ ...newMaterial, file: e.target.files[0] })}
              className="w-full"
            /> */}
              <input
                type="file"
                multiple
                onChange={(e) => setNewMaterial({ ...newMaterial, file: Array.from(e.target.files) })}
                className="w-full"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMaterialModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // if (newMaterial.file) {
                  //   uploadMaterialToServer();
                  // } else {
                  //   alert("Please select a file");
                  // }
                  if (newMaterial.file && newMaterial.file.length > 0) {
                    uploadMaterialToServer();
                  } else {
                    alert("Please select at least one file");
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
