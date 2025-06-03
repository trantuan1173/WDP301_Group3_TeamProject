import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import { FaRegCheckSquare } from "react-icons/fa";

const TeacherSideMenu = () => {
  const [openSubMenu, setOpenSubMenu] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 min-h-screen p-3 w-64 flex flex-col"
      style={{ background: "#f8fbff" }}>
      <div className="flex flex-col gap-3 mt-2">
        {/* OverView */}
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold bg-blue-200 text-blue-900">
          <FaHome size={22} />
          OverView
        </button>
        {/* Lịch dạy */}
        <button className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold bg-blue-50 text-gray-800">
          <FaHome size={22} />
          Lịch dạy
        </button>
        {/* Quản lý lớp */}
        <div>
          <button
            className="flex items-center gap-3 px-4 py-2 rounded-lg font-semibold bg-blue-50 text-gray-800 w-full"
            onClick={() => setOpenSubMenu(!openSubMenu)}
          >
            <FaHome size={22} />
            Quản lý lớp
          </button>
          {openSubMenu && (
            <div className="flex flex-col gap-2 mt-2 ml-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-gray-800">
                <FaRegCheckSquare size={18} />
                Lớp học
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-gray-800">
                <FaRegCheckSquare size={18} />
                Bài kiểm tra
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 text-gray-800">
                <FaRegCheckSquare size={18} />
                Điểm
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherSideMenu;