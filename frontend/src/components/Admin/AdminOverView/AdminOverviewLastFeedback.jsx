import React, { useState } from "react";

export default function AdminOverviewLastFeedback({
  feedbacks = [],
  type = "teacher",
  title = "Latest Feedback",
}) {
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first

  const sortedFeedbacks = [...(feedbacks || [])].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-lg">{title}</div>
        <div>
          <label className="text-sm mr-2 font-medium">Sort:</label>
          <select
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100">
              {type === "teacher" && <th className="py-2 px-3">Teacher</th>}
              {type === "course" && <th className="py-2 px-3">Course</th>}
              <th className="py-2 px-3">Student</th>
              <th className="py-2 px-3">Feedback</th>
              <th className="py-2 px-3">Rating</th>
              <th className="py-2 px-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeedbacks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-400 italic">
                  No feedback found.
                </td>
              </tr>
            )}
            {sortedFeedbacks.slice(0, 5).map((fb) => (
              <tr key={fb._id} className="border-t">
                {type === "teacher" && (
                  <td className="py-2 px-3 font-semibold">
                    {fb.teacherId?.profileId?.name || fb.teacherId?.email || "N/A"}
                  </td>
                )}
                {type === "course" && (
                  <td className="py-2 px-3 font-semibold">
                    {fb.courseId?.nameCourses || "N/A"}
                  </td>
                )}
                <td className="py-2 px-3">
                  {type === "teacher"
                    ? fb.studentId?.profileId?.name || "N/A"
                    : fb.userId?.profileId?.name || "N/A"}
                </td>
                <td className="py-2 px-3">{fb.feedback || fb.comment}</td>
                <td className="py-2 px-3">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                    {fb.rating || "N/A"}
                  </span>
                </td>
                <td className="py-2 px-3 text-xs text-gray-500">
                  {new Date(fb.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}