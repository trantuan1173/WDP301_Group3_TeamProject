import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function CourseDetailModal({ courseData, onClose, onEdit, onDelete }) {

  const [materials, setMaterials] = useState([]);
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(
        API_ENDPOINTS.DELETE_COURSE.replace(":courseId", courseData.courseId),
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      alert("Course has been deleted!");
      if (typeof onDelete === "function") onDelete(courseData._id);
      onClose();
    } catch (err) {
      alert("Failed to delete the course!");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await axios.get(
          API_ENDPOINTS.GET_ALL_LEARNING_MATERIALS_BY_COURSE_ID(courseData.courseId),
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
        setMaterials(res.data.learningMaterials);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMaterials();
  }, [courseData.courseId]);


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

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-4 text-red-600 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-3xl font-bold mb-6 text-center">Course Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Course Image */}
          <div className="flex justify-center items-start">
            <img
              src={courseData.imageURL}
              alt={courseData.nameCourses || "Course Image"}
              className="max-h-48 rounded-lg object-contain"
              style={{ background: "#f3faff", width: "220px", height: "180px" }}
            />
          </div>
          {/* Basic Info */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <div className="bg-blue-100 rounded p-2">{courseData.type}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
              <div className="bg-blue-100 rounded p-2">{courseData.nameCourses}</div>
            </div>
          </div>
        </div>

        {/* Two-column: Level/Duration and Tuition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <div className="bg-blue-100 rounded p-2">{courseData.level}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <div className="bg-blue-100 rounded p-2">{courseData.durationDays} sessions</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee</label>
            <div className="bg-blue-100 rounded p-2">{courseData.price?.toLocaleString()} VND</div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <div className="bg-blue-100 rounded p-2 max-h-[150px] overflow-y-auto whitespace-pre-line">
            {courseData.description}
          </div>
        </div>
        {/* Learning Materials */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Learning Materials</label>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule (if any)
        {courseData.classes && courseData.classes.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Class Schedule:</p>
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-1">Class</th>
                  <th className="border p-1">Start Date</th>
                  <th className="border p-1">Time</th>
                  <th className="border p-1">Teacher</th>
                  <th className="border p-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {courseData.classes.map((cls, idx) => (
                  <tr key={idx}>
                    <td className="border p-1 text-center">{cls.name}</td>
                    <td className="border p-1 text-center">{cls.startDate}</td>
                    <td className="border p-1 text-center">{cls.time}</td>
                    <td className="border p-1 text-center">{cls.teacher}</td>
                    <td className="border p-1 text-center">{cls.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )} */}

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onEdit}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Course
          </button>
        </div>
      </div>
    </div>
  );
}
