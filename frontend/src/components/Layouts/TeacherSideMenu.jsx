import React, { useState } from "react";
import { FaHome, FaRegCheckSquare, FaChevronDown } from "react-icons/fa";

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
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleMenuClick = (key, hasChildren) => {
    if (hasChildren) {
      setOpenDropdown((prev) => !prev);
    } else {
      onMenuSelect && onMenuSelect(key);
    }
  };

  const handleSubMenuClick = (key) => {
    onMenuSelect && onMenuSelect(key);
  };

  return (
    <div className="w-64 bg-gray-100 h-screen shadow-lg p-4">
      <ul className="space-y-4">
        {menuItems.map(({ icon: Icon, label, key, children }) => (
          <React.Fragment key={key}>
            <li
              onClick={() => handleMenuClick(key, !!children)}
              style={{ marginLeft: "-35px" }}
              className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
                ${selectedKey === key || (children && openDropdown) ? "bg-indigo-100 font-semibold" : "hover:bg-indigo-50"}
              `}
            >
              <Icon className="w-6 h-6 text-indigo-600" />
              <span>{label}</span>
            </li>
            {children && openDropdown && (
              <ul style={{ paddingRight: "12px" }} className="mt-2 space-y-3">
                {children.map(({ icon: SubIcon, label: subLabel, key: subKey }) => (
                  <li
                    key={subKey}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubMenuClick(subKey);
                    }}
                    style={{ marginLeft: "-35px" }}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition
                   ${selectedKey === subKey ? "bg-blue-400 text-white font-semibold" : "bg-indigo-50 hover:bg-indigo-100"}
                    `}
                  >

                    <SubIcon className="w-5 h-5 text-indigo-600" />
                    <span className="whitespace-nowrap">{subLabel}</span>
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