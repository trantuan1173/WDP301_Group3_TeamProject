import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function CourseFeedbackModal({ courseName, onClose, onSave }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSave = () => {
    onSave({ rating, comment });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-200/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-xs rounded-full shadow transition duration-200"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">Đánh giá khóa học</h2>

        <div className="flex items-center gap-4">
          <img
            src="/placeholder-course.jpg"
            alt="Course"
            className="w-60 h-45 rounded-xl object-cover shadow border"
          />
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-600">Tên khóa học</label>
            <input
              type="text"
              value={courseName}
              readOnly
              className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Xếp hạng</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${
                  (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Nhận xét</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows="4"
            placeholder="Nhận xét của bạn về khóa học..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-1.5 rounded-full transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
