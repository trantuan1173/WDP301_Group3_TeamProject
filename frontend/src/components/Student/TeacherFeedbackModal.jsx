import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function TeacherFeedbackModal({
  teacherName,
  className,
  teacherId,
  classId,
  studentId,
  onClose,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // ✅ message text
  const [messageType, setMessageType] = useState("success"); // ✅ "success" | "error"

  const handleSubmit = async () => {
    if (!rating) {
      setMessage("Please select a star rating.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_ENDPOINTS.FEEDBACK_TEACHER,
        {
          studentId,
          teacherId,
          classId,
          feedback: comment,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Feedback submitted successfully!");
      setMessageType("success");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 2000);
    } catch (err) {
      setMessage("Failed to submit feedback.");
      setMessageType("error");
    }
    setLoading(false);
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
          Teacher Feedback
        </h2>

        {/* Avatar & Info */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/921/921038.png"
            alt="Teacher avatar"
            className="w-16 h-16 rounded-full mb-2"
          />
          <p className="text-base font-semibold">
            {teacherName || "Teacher Name"}
          </p>
          <p className="text-sm text-gray-600">{className || "Class Name"}</p>
        </div>

        {/* Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-2xl transition-colors duration-200 ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"
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
          placeholder="Your feedback..."
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Message */}
        {message && (
          <div
            className={`mt-3 text-sm font-medium text-center rounded p-2 ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-1.5 rounded-full transition ${loading ? "opacity-60 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
