import React, { useState } from "react";
import { FaTachometerAlt, FaUser, FaCalendarAlt, FaChalkboardTeacher, FaUsers, FaClipboardList, FaChartBar, FaChevronDown, FaChevronRight } from "react-icons/fa";

const menuItems = [
  { key: "overview", label: "OverView", icon: FaTachometerAlt },
  { key: "profile", label: "Thông tin cá nhân", icon: FaUser },
  { key: "schedule", label: "Lịch dạy", icon: FaCalendarAlt },
  {
    key: "class-management",
    label: "Quản lý lớp",
    icon: FaChalkboardTeacher,
    children: [
      { key: "classes", label: "Lớp học", icon: FaUsers },
      { key: "exams", label: "Bài kiểm tra", icon: FaClipboardList },
      { key: "scores", label: "Điểm", icon: FaChartBar }
    ]
  }
];

export default function TeacherSideMenu({ onMenuSelect, selectedKey }) {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg p-4 rounded-xl">
      <ul className="space-y-2">
        {menuItems.map(({ icon: Icon, label, key, children }) => (
          <React.Fragment key={key}>
            <li
              onClick={() => {
                if (children) {
                  setOpenDropdown((prev) => !prev);
                } else {
                  onMenuSelect && onMenuSelect(key);
                }
              }}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition
                ${selectedKey === key ? "bg-indigo-700 text-white font-semibold" : "hover:bg-indigo-100"}`}
            >
              <Icon className={`w-5 h-5 ${selectedKey === key ? "text-white" : "text-indigo-700"}`} />
              <span>{label}</span>
              {children && (
                openDropdown ? (
                  <FaChevronDown className="ml-auto w-4 h-4" />
                ) : (
                  <FaChevronRight className="ml-auto w-4 h-4" />
                )
              )}
            </li>
            {children && openDropdown && (
              <ul className="ml-6 mt-1 space-y-2">
                {children.map(({ icon: SubIcon, label: subLabel, key: subKey }) => (
                  <li
                    key={subKey}
                    onClick={() => onMenuSelect && onMenuSelect(subKey)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition
                      ${selectedKey === subKey ? "bg-indigo-700 text-white font-semibold" : "hover:bg-indigo-100"}`}
                  >
                    <SubIcon className={`w-4 h-4 ${selectedKey === subKey ? "text-white" : "text-indigo-700"}`} />
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