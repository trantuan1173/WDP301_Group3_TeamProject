import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AdminManagerViewForm({ user, onClose }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay nền mờ */}
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
  
      {/* Popup */}
      <div
        className="relative z-10 shadow p-6 w-[90%] max-w-2xl bg-white"
        style={{
          border: "1px solid #D6BDBD",
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <h2 className="text-center text-xl font-bold text-[#120B48] mb-6">
          User Information
        </h2>
  
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Full Name</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.name}
            </div>
          </div>
  
          <div>
            <label>Email</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.email}
            </div>
          </div>
  
          <div>
            <label>Birth Date</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.dob}
            </div>
          </div>
  
          <div>
            <label>Gender</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.gender}
            </div>
          </div>
  
          <div>
            <label>Phone</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.phone}
            </div>
          </div>
  
          <div>
            <label>Role</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.role.nameRole}
            </div>
          </div>
          <div>
            <label>Address</label>
            <div
              className="p-4 bg-[#EBF5FFC2]"
              style={{
                border: "1px solid #D6BDBD",
                borderRadius: "10px",
              }}
            >
              {user.address}
            </div>
            </div>
        </div>
  
        <div className="mt-6 text-right">
          <button
            className="px-6 py-3 bg-gray-300 text-black rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
