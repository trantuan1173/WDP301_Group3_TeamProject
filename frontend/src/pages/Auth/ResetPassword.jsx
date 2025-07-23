// frontend/src/pages/Auth/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("en");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const t = {
    vi: {
      title: "Đặt lại mật khẩu",
      password: "Mật khẩu mới",
      confirm: "Xác nhận mật khẩu",
      button: "Đặt lại",
      success: "Mật khẩu đã được thay đổi! Đang truyển hướng sang đăng nhập.....",
      error: "Mật khẩu không hợp lệ hoặc không khớp",
      toggleLang: "English",
      validations: {
        length: "Ít nhất 6 ký tự",
        uppercase: "Ít nhất 1 chữ hoa",
        number: "Ít nhất 1 số",
        match: "Mật khẩu khớp nhau",
      }
    },
    en: {
      title: "Reset Password",
      password: "New Password",
      confirm: "Confirm Password",
      button: "Reset",
      success: "Password successfully changed! Redirecting to login.....",
      error: "Password is invalid or does not match",
      toggleLang: "Tiếng Việt",
      validations: {
        length: "At least 6 characters",
        uppercase: "At least 1 uppercase letter",
        number: "At least 1 number",
        match: "Passwords match",
      }
    },
  };

  const checkValid = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    match: password === confirm && confirm !== "",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allValid = Object.values(checkValid).every(Boolean);
    if (!allValid) return setMessage(t[language].error);

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
        </div>

        {message && (
          <p className={`text-center mb-4 text-sm ${message.includes("success") || message.includes("đã được") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              {t[language].password}
            </label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FontAwesomeIcon
              icon={showPass ? faEye : faEyeSlash}
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              {t[language].confirm}
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FontAwesomeIcon
              icon={showConfirm ? faEye : faEyeSlash}
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            />
          </div>

          <div className="text-sm space-y-1">
            <p className={`${checkValid.length ? "text-green-600" : "text-gray-500"}`}>• {t[language].validations.length}</p>
            <p className={`${checkValid.uppercase ? "text-green-600" : "text-gray-500"}`}>• {t[language].validations.uppercase}</p>
            <p className={`${checkValid.number ? "text-green-600" : "text-gray-500"}`}>• {t[language].validations.number}</p>
            <p className={`${checkValid.match ? "text-green-600" : "text-gray-500"}`}>• {t[language].validations.match}</p>
          </div>

          <button
            type="submit"
            disabled={!Object.values(checkValid).every(Boolean)}
            className={`w-full text-white py-2 rounded-lg transition duration-200 ${Object.values(checkValid).every(Boolean) ? "bg-blue-600 hover:opacity-90" : "bg-gray-400 cursor-not-allowed"}`}
          >
            {t[language].button}
          </button>
        </form>
      </div>
    </div>
  );
}
