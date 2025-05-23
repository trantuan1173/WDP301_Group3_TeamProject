import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminManagerViewForm({ user, onClose }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay nền mờ */}
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>

      {/* Popup */}
      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-center text-xl font-bold text-[#120B48] mb-4">Thông tin người dùng</h2>

        <div className="space-y-3">
          <p><strong>Họ và tên:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Ngày sinh:</strong> {user.dob}</p>
          <p><strong>Giới tính:</strong> {user.gender}</p>
          <p><strong>Số điện thoại:</strong> {user.phone}</p>
          
          <p><strong>Vai trò:</strong> {user.role}</p>
        </div>

        <div className="mt-6 text-right">
          <button
            className="px-4 py-2 bg-gray-300 rounded text-black"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
