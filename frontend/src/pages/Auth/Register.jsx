import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';

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
        alert('Đăng ký thành công');
      }
    } catch (error) {
      alert('Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size={120} text="ĐANG ĐĂNG KÝ" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">REGISTER</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="profileData.name"
            placeholder="Fullname"
            value={formData.profileData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-indigo-500'
              }`}
          />
          {errors.confirmPassword && (
            <p className="text-left text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 border-2 border-indigo-500 text-indigo-500 font-semibold rounded-lg hover:bg-indigo-500 hover:text-white transition duration-200"
          >
            Register
          </button>
        </form>

        {/* 👇 Dòng chữ nhỏ bên dưới form */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <span className="underline text-indigo-500 cursor-pointer hover:text-indigo-700">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
