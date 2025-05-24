import React from "react";

export default function CourseDetailModal({ courseData, onClose, onEdit }) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-lg relative">
                <button
                    className="absolute top-3 right-4 text-red-600 text-2xl font-bold"
                    onClick={onClose}
                >
                    ×
                </button>

                <h2 className="text-xl font-semibold mb-4 text-center">Chi tiết khóa học</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="w-full h-[150px] flex justify-center items-center border rounded">
                        <img
    src={courseData.imageURL || courseData.imageUrl}
    alt={courseData.courseId?.nameCourses || "Ảnh khóa học"}
    className="max-h-full object-contain"
/>

                    </div>

                    <div>
                        <p><strong>Danh mục:</strong> {courseData.courseId?.type || courseData.type}</p>
                        <p><strong>Tên khóa học:</strong> {courseData.courseId?.nameCourses}</p>
                        <p><strong>Trình độ:</strong> {courseData.level}</p>
                        <p><strong>Thời lượng:</strong> {courseData.duration}</p>
                        <p><strong>Học phí gốc:</strong> {courseData.price}</p>
                        <p><strong>Học phí ưu đãi:</strong> {courseData.salePrice || courseData.price}</p>
                    </div>
                </div>

                <div className="mb-4">
                    <p><strong>Mô tả:</strong></p>
                    <p className="bg-gray-100 p-2 rounded">{courseData.description}</p>
                </div>

                <div>
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
                            {courseData.classes?.map((cls, idx) => (
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
                        Xóa khóa học
                    </button>
                </div>
            </div>
        </div>
    );
}
