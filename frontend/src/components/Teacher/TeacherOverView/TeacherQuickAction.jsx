import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaChartBar,
} from "react-icons/fa";

export default function TeacherQuickAction({ onQuickAction }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-bold text-lg mb-1">Quick Actions</div>
      <div className="text-gray-500 text-sm mb-3">
        Quickly access your essential tools and sections
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onQuickAction("profile")}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
        >
          <FaUser /> Profile
        </button>
        <button
          onClick={() => onQuickAction("schedule")}
          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
        >
          <FaCalendarAlt /> Schedule
        </button>
        <button
          onClick={() => onQuickAction("classes")}
          className="bg-green-100 hover:bg-green-200 text-green-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
        >
          <FaChalkboardTeacher /> Classes
        </button>
        <button
          onClick={() => onQuickAction("scores")}
          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm transition text-sm"
        >
          <FaChartBar /> Scores
        </button>
      </div>
    </div>
  );
}
