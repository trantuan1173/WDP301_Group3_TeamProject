import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function TeacherFeedbackModal({
  teacherName,
  className,
  onClose,
  onSave,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleSubmit = () => {
    const feedback = {
      rating,
      comment,
    };
    onSave(feedback);
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

        {/* Header */}
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
          Nhận xét giáo viên
        </h2>

        {/* Avatar & Info */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/921/921038.png"
            alt="Teacher avatar"
            className="w-16 h-16 rounded-full mb-2"
          />
          <p className="text-base font-semibold">
            {teacherName || "Tên giáo viên"}
          </p>
          <p className="text-sm text-gray-600">{className || "Tên lớp"}</p>
        </div>

        {/* Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl transition-colors duration-200 ${
                (hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        {/* Comment box */}
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          placeholder="Góp ý..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-1.5 rounded-full transition"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
