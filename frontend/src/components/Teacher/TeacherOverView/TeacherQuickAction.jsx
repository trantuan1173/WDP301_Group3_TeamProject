import React from "react";

export default function TeacherQuickAction({ onQuickAction }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-4">
      <div className="font-bold mb-2">Quick Actions</div>
      <div className="text-gray-500 text-sm mb-3">Common tasks for your role</div>
      <div className="flex flex-col gap-2">
        <button
          className="border rounded px-3 py-2 text-left hover:bg-blue-50"
          onClick={() => onQuickAction("users")}
        >
          Manage Users
        </button>
        <button
          className="border rounded px-3 py-2 text-left hover:bg-blue-50"
          onClick={() => onQuickAction("courses")}
        >
          Manage Courses
        </button>
        <button
          className="border rounded px-3 py-2 text-left hover:bg-blue-50"
          onClick={() => onQuickAction("classes")}
        >
          Manage Classes
        </button>
      </div>
    </div>
  );
}