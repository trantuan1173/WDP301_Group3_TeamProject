// frontend/src/components/Layouts/TeacherSideMenu.jsx
import React, { useState } from "react";
import {
  FaTachometerAlt, FaCalendarAlt, FaChalkboardTeacher,
  FaUsers, FaClipboardList, FaChartBar, FaChevronDown, FaChevronRight
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

// Menu configuration
const menuItems = [
  { key: "overview", label: "OverView", icon: FaTachometerAlt },
  { key: "schedule", label: "Lịch dạy", icon: FaCalendarAlt },
  {
    key: "class-management", label: "Quản lý lớp", icon: FaChalkboardTeacher, children: [
      { key: "exams", label: "Bài kiểm tra", icon: FaClipboardList },
      { key: "scores", label: "Xem điểm", icon: FaChartBar }
    ]
  }
];

export default function TeacherSideMenu() {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const toggleDropdown = (key) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (routeKey) => currentPath.includes(`/teacher/${routeKey}`);

  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg p-4 rounded-xl overflow-y-auto">
      <ul className="space-y-2">
        {menuItems.map(({ icon: Icon, label, key, children }) => (
          <React.Fragment key={key}>
            <li
              onClick={() => {
                if (children) {
                  toggleDropdown(key);
                } else {
                  navigate(`/teacher/${key}`);
                }
              }}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${isActive(key) ? "bg-indigo-700 text-white font-semibold" : "hover:bg-indigo-100"}`}
            >
              <Icon className={`w-5 h-5 ${isActive(key) ? "text-white" : "text-indigo-700"}`} />
              <span>{label}</span>
              {children && (
                openDropdowns[key]
                  ? <FaChevronDown className="ml-auto w-4 h-4" />
                  : <FaChevronRight className="ml-auto w-4 h-4" />
              )}
            </li>

            {/* Sub-menu items */}
            {children && openDropdowns[key] && (
              <ul className="ml-6 mt-1 space-y-2">
                {children.map(({ icon: SubIcon, label: subLabel, key: subKey }) => (
                  <li
                    key={subKey}
                    onClick={() => navigate(`/teacher/${subKey}`)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition
                      ${isActive(subKey) ? "bg-indigo-700 text-white font-semibold" : "hover:bg-indigo-100"}`}
                  >
                    <SubIcon className={`w-4 h-4 ${isActive(subKey) ? "text-white" : "text-indigo-700"}`} />
                    <span>{subLabel}</span>
                  </li>
                ))}
              </ul>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}
