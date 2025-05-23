import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("vi");

  const t = {
    vi: {
      title: "Đặt lại mật khẩu",
      password: "Mật khẩu mới",
      confirm: "Xác nhận mật khẩu",
      button: "Đặt lại",
      success: "Mật khẩu đã được thay đổi! Đang truyển hướng sang đăng nhập.....",
      error: "Mật khẩu không khớp hoặc có lỗi xảy ra",
      toggleLang: "English",
    },
    en: {
      title: "Reset Password",
      password: "New Password",
      confirm: "Confirm Password",
      button: "Reset",
      success: "Password successfully changed! Redirecting to login.....",
      error: "Passwords do not match or something went wrong",
      toggleLang: "Tiếng Việt",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setMessage(t[language].error);
    }

    try {
      await axios.post(`${API_ENDPOINTS.RESET_PASSWORD}/${token}`, { newPassword: password });
      setMessage(t[language].success);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log(err);
      setMessage(t[language].error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t[language].title}</h2>
          <button
            className="text-sm text-white px-3 py-1 rounded-full"
            style={{ backgroundColor: "#0a2c63" }}
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
          >
            {t[language].toggleLang}
          </button>
        </div>

        {message && (
          <p className="text-center mb-4 text-sm text-red-600">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t[language].password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t[language].confirm}
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:opacity-90 transition duration-200"
          >
            {t[language].button}
          </button>
        </form>
      </div>
    </div>
  );
}
