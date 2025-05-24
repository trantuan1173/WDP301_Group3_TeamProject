import React, { useState } from "react";
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from "react-router-dom"; // Thêm dòng này

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [language, setLanguage] = useState("vi");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Thêm dòng này

    const t = {
        vi: {
            title: "Đăng nhập vào tài khoản",
            email: "Địa chỉ Email",
            password: "Mật khẩu",
            login: "Đăng nhập",
            toggleLang: "English",
            noAccount: "Chưa có tài khoản?",
            signUp: "Đăng ký"
        },
        en: {
            title: "Sign in to your account",
            email: "Email address",
            password: "Password",
            login: "Sign in",
            toggleLang: "Tiếng Việt",
            noAccount: "Don't have an account?",
            signUp: "Sign Up"
        },
    };

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_ENDPOINTS.LOGIN}`, form);
            if (response.status === 200) {
                const { token, message, profile, role } = response.data.data;
                localStorage.setItem('token', token);
                alert(message || "Đăng nhập thành công");
                if (!profile.isUpdated) {
                    navigate("/update-profile");
                } else if (role === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data.message || "Đăng nhập thất bại";
    
                if (status === 401) {
                    alert(message); // Sai tài khoản/mật khẩu
                } else if (status === 403) {
                    alert(message); // Chưa xác thực
                } else {
                    alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
                }
            } else {
                alert("Không thể kết nối đến máy chủ.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex">
            {/* Left form */}
            <div className="w-full md:w-7/10 lg:w-7/10 flex justify-center pt-6  py-30 lg:px-30">
                <div className="max-w-md w-full space-y-8">
                    <div className="flex justify-between items-center">
                        <img
                            src="/images/logo.png"
                            className="h-20 w-auto"
                            alt="Logo"
                        />
                        <button
                            onClick={() =>
                                setLanguage(language === "vi" ? "en" : "vi")
                            }
                            className="px-4 py-2 rounded-full font-bold text-base text-white hover:opacity-70 transition duration-200"
                            style={{ backgroundColor: "#0a2c63" }}
                        >
                            {t[language].toggleLang}
                        </button>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-gray-900">
                        {t[language].title}
                    </h2>
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t[language].email}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t[language].password}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        </div>
                        {isLoading && <LoadingSpinner size={50} textSize={20}/>}
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:opacity-90 transition duration-200"
                                style={{ backgroundColor: "#0a2c63" }}
                            >
                                {t[language].login}
                            </button>
                        </div>
                        {/* Thêm dòng đăng ký */}
                        <div className="text-center mt-4 text-sm text-gray-600">
                            {t[language].noAccount}{" "}
                            <span
                                className="text-blue-600 hover:underline cursor-pointer font-semibold"
                                onClick={() => navigate("/register")}
                            >
                                {t[language].signUp}
                            </span>
                        </div>
                    </form>
                    <a href="/forgot-password">Forgot Password</a>
                </div>
            </div>

            {/* Right image */}
            <div className="hidden md:block md:w-3/10 lg:w-3/10 h-screen overflow-hidden">
                <img
                    src="/images/loginimage.png"
                    alt="Login visual"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}