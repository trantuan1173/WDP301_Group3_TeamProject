import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../config";

export default function AdminAddAccount({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    email: "",
    profileData: {
      name: "",
    },
    password: "",
    
  });
 
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        profileData: { ...prev.profileData, name: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const endpoint = role === "teacher" ? API_ENDPOINTS.REGISTER_TEACHER : API_ENDPOINTS.REGISTER;
      const response = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      

      if (response.status === 201) {
        setShowVerifyMsg(true); // Hiện thông báo xác thực email
      }
    } catch (error) {
      alert('Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black opacity-40"
        onClick={onClose}
      ></div>

      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-center text-xl font-bold text-[#120B48] mb-4">
          Tạo tài khoản
        </h2>
        {showVerifyMsg && (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-3 text-center">
      Đăng ký thành công! Vui lòng báo người dùng xác thực email .
    </div>
  )}
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.profileData.name}
            onChange={handleChange}
            type="text"
            placeholder="Họ và tên"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Mật khẩu"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            name="role"
            value={role}
            onChange={(e)=> setRole(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Chọn vai trò</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 text-black"
              disabled={isLoading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
