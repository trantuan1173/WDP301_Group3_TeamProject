import React from "react";
export default function AdminOverviewNewStudents({ accounts }) {
  const students = accounts
    .filter(acc => acc.roleId?.nameRole === "student")
    .slice(-5)
    .reverse();

  return (
    <div className="bg-white rounded bg-blue-50 shadow p-6 flex-1">
      <div className="font-bold mb-2">New Student Add</div>
      <div className="mb-2 text-sm text-gray-500">The newest students</div>
      {students.map((stu, idx) => (
        <div key={stu._id} className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div>
            <div className="font-semibold">{stu.profileId?.name || "No Name"}</div>
            <div className="text-xs text-gray-500">{stu.profileId?.address || "No Info"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}