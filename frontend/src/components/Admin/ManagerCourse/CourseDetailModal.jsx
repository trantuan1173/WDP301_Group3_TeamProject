import React from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function CourseDetailModal({ courseData, onClose, onEdit  }) {
   
    return (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
    <div
      className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-3 right-4 text-red-600 text-2xl font-bold"
        onClick={onClose}
      >
        ×
      </button>

      <h2 className="text-3xl font-bold mb-6 text-center">Chi tiết khóa học</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Ảnh khóa học */}
        <div className="flex justify-center items-start">
          <img
            src={courseData.imageURL || courseData.imageUrl}
            alt={courseData.courseId?.nameCourses || "Ảnh khóa học"}
            className="max-h-48 rounded-lg object-contain"
            style={{ background: "#f3faff", width: "220px", height: "180px" }}
          />
        </div>
        {/* Thông tin chính */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục khóa học</label>
            <div className="bg-blue-100 rounded p-2">{courseData.courseId?.type || courseData.type}</div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khóa học</label>
            <div className="bg-blue-100 rounded p-2">{courseData.courseId?.nameCourses}</div>
          </div>
        </div>
      </div>

      {/* 2 cột: Trình độ/Thời lượng và Học phí/Học phí ưu đãi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trình độ/ Level</label>
          <div className="bg-blue-100 rounded p-2">{courseData.level}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
          <div className="bg-blue-100 rounded p-2">{courseData.durationDays} buổi</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Học phí</label>
          <div className="bg-blue-100 rounded p-2">{courseData.price?.toLocaleString()} VNĐ</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Học phí ưu đãi</label>
          <div className="bg-blue-100 rounded p-2">{(courseData.salePrice || courseData.price)?.toLocaleString()} VNĐ</div>
        </div>
      </div>

      {/* Mô tả */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <div className="bg-blue-100 rounded p-2">{courseData.description}</div>
      </div>

      {/* Lịch học (nếu muốn giữ lại) */}
      {courseData.classes && courseData.classes.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Lịch học:</p>
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-1">Lớp học</th>
                <th className="border p-1">Ngày bắt đầu</th>
                <th className="border p-1">Giờ học</th>
                <th className="border p-1">Giảng viên</th>
                <th className="border p-1">Trạng thái</th>
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
      )}

      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={onEdit}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Chỉnh sửa
        </button>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
);
}
