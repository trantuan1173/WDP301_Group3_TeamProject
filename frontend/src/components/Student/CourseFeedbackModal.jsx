import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function CourseFeedbackModal({ courseName, courseId, userId, imageURL, onClose, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleSave = async () => {
    if (!rating) {
      setMessage("Please select a star rating.");
      setMessageType("error");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        API_ENDPOINTS.FEEDBACK_COURSE,
        {
          userId,
          courseId,
          feedback: comment,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Course feedback submitted successfully!");
      setMessageType("success");
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 2000);
    } catch (err) {
      setMessage("Failed to submit course feedback.");
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

        <h2 className="text-xl font-bold text-center text-indigo-700 mb-4">Course Feedback</h2>

        <div className="flex items-center gap-4">
          <img
            src={imageURL || "/placeholder-course.jpg"}
            alt="Course"
            className="w-60 h-45 rounded-xl object-cover shadow border"
          />
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-600">Course Name</label>
            <input
              type="text"
              value={courseName}
              readOnly
              className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-600 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl ${(hover || rating) >= star ? "text-yellow-400" : "text-gray-300"}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-600 mb-1">Comment</label>
          <textarea
            className="w-full border rounded-md px-3 py-2 text-sm"
            rows="4"
            placeholder="Your feedback about the course..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mt-4 text-sm font-medium text-center rounded p-2 ${
              messageType === "success"
                ? "text-green-700 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-1.5 rounded-full transition ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}
