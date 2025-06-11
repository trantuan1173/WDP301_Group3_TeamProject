import React from "react";
import { FaHome } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";

const menuItems = [
  { key: "overview", label: "OverView", icon: FaHome },
  { key: "schedule", label: "Lịch dạy", icon: FaHome },
  {
    key: "class-management",
    label: "Quản lý lớp",
    icon: FaHome,
    children: [
      { key: "classes", label: "Lớp học", icon: FaRegCheckSquare },
      { key: "exams", label: "Bài kiểm tra", icon: FaRegCheckSquare },
      { key: "scores", label: "Điểm", icon: FaRegCheckSquare }
    ]
  }
];

export default function TeacherSideMenu({ onMenuSelect, selectedKey }) {
  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg p-4">
      <ul className="space-y-2">
        {menuItems.map(({ icon: Icon, label, key, children }) => (
          <React.Fragment key={key}>
            <li
              onClick={() => onMenuSelect && onMenuSelect(key)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer 
                ${selectedKey === key ? "bg-indigo-100 font-semibold" : "hover:bg-indigo-50"}`}
            >
              <Icon className="w-5 h-5 text-indigo-600" />
              <span>{label}</span>
            </li>
            {children && selectedKey === key && (
              <ul className="ml-7 mt-1 space-y-1">
                {children.map(({ icon: SubIcon, label: subLabel, key: subKey }) => (
                  <li
                    key={subKey}
                    onClick={() => onMenuSelect && onMenuSelect(subKey)}
                    className={`flex items-center gap-2 p-2 rounded-md cursor-pointer pl-[120%]
                      ${selectedKey === subKey ? "bg-indigo-100 font-semibold" : "hover:bg-indigo-50"}`}
                  >
                    <SubIcon className="w-4 h-4 text-indigo-600" />
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