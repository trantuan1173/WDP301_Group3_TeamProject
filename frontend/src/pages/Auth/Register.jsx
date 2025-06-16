import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    profileData: {
      
      name: '',
    },
    password: '',
    email: '',
  });
  const [errors, setErrors] = useState({
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyMsg, setShowVerifyMsg] = useState(false); // Thêm state này
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'profileData.name') {
      setFormData((prev) => ({
        ...prev,
        profileData: {
          ...prev.profileData,
          name: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === 'confirmPassword') {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.password ? 'Mật khẩu xác nhận không khớp' : '',
        }));
      }

      if (name === 'password') {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            formData.confirmPassword && formData.confirmPassword !== value
              ? 'Mật khẩu xác nhận không khớp'
              : '',
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Mật khẩu xác nhận không khớp',
      }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINTS.REGISTER}`, formData);

      if (response.status === 201) {
        setShowVerifyMsg(true); // Hiện thông báo xác thực email
      }
    } catch (error) {
      alert('Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size={120} text="ĐANG ĐĂNG KÝ" />;

 return (
  <div className="w-full h-screen flex items-center justify-center bg-gray-100">
    <div className="flex w-[90%] max-w-5xl h-[90%] bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* Left Side: Background Image with Text Overlay */}
      <div
        className="w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/BannerRegister.png')" }} // Đổi path đúng ảnh bạn đã upload
      >
        <div className="absolute inset-0  flex flex-col items-center justify-end px-6 text-white">
          
          <p className="text-sm text-center max-w-[300px] drop-shadow-md ">
            Join us to improve your English skills with top-quality courses!
          </p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-1/2 flex flex-col justify-center px-10 py-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Registration Form</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="profileData.name"
            placeholder="First Name"
            value={formData.profileData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500">{errors.confirmPassword}</p>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Register
          </button>
        </form>

        {showVerifyMsg && (
          <p className="mt-4 text-sm text-red-500 text-center">
            Please check your email to verify your account.
          </p>
        )}

        <p className="mt-4 text-sm text-gray-600 text-center">
          Already have an account?{' '}
          <span
            className="underline text-indigo-600 cursor-pointer hover:text-indigo-800"
            onClick={() => navigate('/login')}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  </div>
);


};

export default Register;