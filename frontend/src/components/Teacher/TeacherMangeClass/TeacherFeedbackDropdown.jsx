import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import { FaChevronDown, FaChevronUp, FaStar, FaCommentDots } from "react-icons/fa";

export default function TeacherFeedbackDropdown({ classId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const feedbacksPerPage = 4;

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!classId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ENDPOINTS.GET_FEEDBACK_TEACHER_BY_CLASS(classId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      }
    };
    fetchFeedbacks();
  }, [classId]);

  const totalPages = Math.ceil(feedbacks.length / feedbacksPerPage);
  const startIndex = (currentPage - 1) * feedbacksPerPage;
  const currentFeedbacks = feedbacks.slice(startIndex, startIndex + feedbacksPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
  <div>
    {/* Header title */}
    <div className="pl-4 flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <FaCommentDots className="font-bold text-2xl text-indigo-500" />
        <span className="font-bold text-2xl text-indigo-700">Your feedback</span>
        <span className="text-ls text-gray-600">({feedbacks.length}) feedback(s)</span>
      </div>
    </div>

    {/* Toggle dropdown */}
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="pl-4 flex justify-between items-center cursor-pointer px-1 mb-2"
    >
      <span className="pl-8 text-sm font-medium">Click to {isOpen ? "hide" : "show"} feedbacks</span>
      {isOpen ? <FaChevronUp /> : <FaChevronDown />}
    </div>

    {/* Dropdown content with transition */}
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="pl-4 space-y-3">
        {currentFeedbacks.map((fb) => (
          <div
            key={fb._id}
            className="border rounded-md p-3 flex justify-between items-center"
          >
            <div className="font-medium">{fb.feedback}</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < fb.rating ? "text-yellow-400" : "text-gray-300"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls - align right */}
      {totalPages > 1 && (
        <div className="flex justify-end gap-2 mt-4 pr-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded shadow ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded shadow ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  </div>
);
}