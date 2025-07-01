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
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);
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
            value !== formData.password ? 'Passwords do not match' : '',
        }));
      }

      if (name === 'password') {
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            formData.confirmPassword && formData.confirmPassword !== value
              ? 'Passwords do not match'
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
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_ENDPOINTS.REGISTER}`, formData);

      if (response.status === 201) {
        setShowVerifyMsg(true);
      }
    } catch (error) {
      alert('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner size={120} text="Registering..." />;

  return (
    <div className="min-h-screen flex">
      {/* Left form */}
      <div className="w-full md:w-7/10 lg:w-7/10 flex justify-center pt-6 py-30 lg:px-30">
        <div className="max-w-md w-full space-y-8">
          <div className="flex justify-between items-center">
            <img
              src="/images/logo.png"
              className="h-20 w-auto"
              alt="Logo"
            />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">
            Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="profileData.name"
                  placeholder="Full Name"
                  value={formData.profileData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={`mt-1 w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:opacity-90 transition duration-200"
                style={{ backgroundColor: "#0a2c63" }}
              >
                Register
              </button>
            </div>
          </form>

          {showVerifyMsg && (
            <div className="text-green-600 font-semibold text-sm text-center mt-4">
              Please check your email to verify your account.
            </div>
          )}

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer font-semibold"
              onClick={() => navigate('/login')}
            >
              Sign In
            </span>
          </div>
        </div>
      </div>

      {/* Right image */}
      <div className="hidden md:block md:w-3/10 lg:w-3/10 h-screen overflow-hidden">
        <img
          src="/images/BannerRegister.png"
          alt="Register visual"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;