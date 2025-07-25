import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";
import LoadingSpinner from "../../LoadingSpinner";


export default function AdminManageFeedback() {
  const [feedbackCourse, setFeedbackCourse] = useState([]);
  const [feedbackTeacher, setFeedbackTeacher] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [viewType, setViewType] = useState("course"); // "course" hoặc "teacher"
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };
  const usersPerPage = 15;

  useEffect(() => {
    const fetchFeedbackCourse = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_ALL_FEEDBACK_COURSE, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setFeedbackCourse(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackCourse();
  }, [refresh]);
  useEffect(() => {
    const fetchFeedbackTeacher = async () => {
      try {
        const token = localStorage.getItem("token");
        setLoading(true);
        const response = await axios.get(API_ENDPOINTS.GET_ALL_FEEDBACK_TEACHER, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setFeedbackTeacher(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching feedback teacher:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbackTeacher();
  }, [refresh]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentFeedback =
    viewType === "course"
      ? feedbackCourse.slice(indexOfFirstUser, indexOfLastUser)
      : feedbackTeacher.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages =
    viewType === "course"
      ? Math.ceil(feedbackCourse.length / usersPerPage)
      : Math.ceil(feedbackTeacher.length / usersPerPage);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(API_ENDPOINTS.DELETE_FEEDBACK_COURSE(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRefresh(r => !r);
    } catch (err) {
      alert("Delete failed!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner size={120} text="Loading..." />;

  return (
    <div className="p-6 bg-white-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">FEEDBACK</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div
          onClick={() => setViewType("course")}
          className="cursor-pointer bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow hover:opacity-90"
        >
          Total Feedback Course: {feedbackCourse.length}
        </div>
        <div
          onClick={() => setViewType("teacher")}
          className="cursor-pointer bg-[#00224D] text-white p-4 rounded-lg text-center font-semibold shadow hover:opacity-90"
        >
          Total Feedback Teacher: {feedbackTeacher.length}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-200 font-semibold">
            <tr>
              <th className="px-4 py-2">No.</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">
                {viewType === "course" ? "Course" : "Teacher"}
              </th>
              <th className="px-4 py-2">Content</th>
              <th className="px-4 py-2">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentFeedback.map((fb, idx) => (
              <tr key={fb._id}>
                <td className="px-4 py-2">{indexOfFirstUser + idx + 1}</td>
                <td className="px-4 py-2">
                    {viewType === "course"
                    ? fb.userId?.profileId?.name || "No name"
                    : fb.studentId?.profileId?.name || "No name"}</td>
                <td className="px-4 py-2">
                    {viewType === "course"
                    ? fb.userId?.email || "No email"
                    : fb.studentId?.email || "No email"}</td>
                <td className="px-4 py-2">
                  {viewType === "course"
                    ? fb.courseId?.nameCourses || "No course"
                    : fb.teacherId?.profileId?.name || "No teacher"}
                </td>
                <td className="px-4 py-2">{fb.feedback || "No content"}</td>
                <td className="px-4 py-2">{renderStars(fb.rating)}</td>
              </tr>
            ))}
            {currentFeedback.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500 italic">
                  No feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 gap-2">
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Prev
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 rounded bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Next
          </button>
        )}
        <span className="ml-3 text-sm text-gray-600 self-center">
          Page {currentPage} / {totalPages}
        </span>
      </div>

    </div>
  );
}
