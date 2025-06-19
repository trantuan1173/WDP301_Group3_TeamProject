import React from "react";

export default function AdminOverviewLastFeedback({ feedbacks = [] }) {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="font-bold mb-2">Last FeedBack</div>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Email</th>
            <th>Comment</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {(feedbacks || [])
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(fb => (
              <tr key={fb._id}>
                <td>{fb.userId?.email || "No Email"}</td>
                <td>{fb.comment}</td>
                <td>{new Date(fb.createdAt).toLocaleString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}