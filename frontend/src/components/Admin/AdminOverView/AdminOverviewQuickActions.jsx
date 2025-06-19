import React from "react";
export default function AdminOverviewQuickActions({ onQuickAction }) {
  return (
    <div className="bg-white rounded shadow p-6 flex-1">
      <div className="font-bold mb-2">Quick Actions</div>
      <div className="mb-2">Common tasks for your role</div>
      <div className="flex flex-col gap-2">
        <button
          className="border rounded px-3 py-2 text-left"
          onClick={() => onQuickAction && onQuickAction('account')}
        >
          Manage Users
        </button>
        <button
          className="border rounded px-3 py-2 text-left"
          onClick={() => onQuickAction && onQuickAction('courses')}
        >
          Manage Courses
        </button>
        <button
          className="border rounded px-3 py-2 text-left"
          onClick={() => onQuickAction && onQuickAction('classes')}
        >
          Manage Classes
        </button>
      </div>
    </div>
  );
}