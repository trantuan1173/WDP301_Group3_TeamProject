import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({
    profileData: {
      name: '',
    },
    password: '',
    email: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({ confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyMsg, setShowVerifyMsg] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
  });

  const navigate = useNavigate();

  const validatePassword = (password) => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'profileData.name') {
      setFormData((prev) => ({
        ...prev,
        profileData: { ...prev.profileData, name: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      if (name === 'confirmPassword') {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: value !== formData.password ? 'Passwords do not match' : '',
        }));
      }

      if (name === 'password') {
        const validated = validatePassword(value);
        setPasswordErrors(validated);

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
      setErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_ENDPOINTS.REGISTER}`, formData);
      if (response.status === 201) setShowVerifyMsg(true);
    } catch {
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
            <img src="/images/logo.png" className="h-20 w-auto" alt="Logo" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 text-center">
            Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="profileData.name"
                  value={formData.profileData.name}
                  onChange={handleChange}
                  required
                  placeholder="Full Name"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  required
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />

                {/* Eye icon */}
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setPasswordVisible((prev) => !prev)}
                >
                  {passwordVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>

                {/* Password rules */}
                {isPasswordFocused && (
                  <ul className="text-sm text-gray-600 mt-2 ml-1">
                    <li className={passwordErrors.minLength ? "text-green-600" : "text-gray-400"}>
                      • At least 8 characters
                    </li>
                    <li className={passwordErrors.hasUppercase ? "text-green-600" : "text-gray-400"}>
                      • One uppercase letter
                    </li>
                    <li className={passwordErrors.hasLowercase ? "text-green-600" : "text-gray-400"}>
                      • One lowercase letter
                    </li>
                    <li className={passwordErrors.hasNumber ? "text-green-600" : "text-gray-400"}>
                      • One number
                    </li>
                  </ul>
                )}

              </div>


              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  required
                  className={`mt-1 w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 ${errors.confirmPassword ? 'focus:ring-red-500' : 'focus:ring-indigo-500'}`}
                />

                {/* Eye icon */}
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                >
                  {confirmPasswordVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                </span>

                {/* Error text */}
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
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
            Already have an account?{' '}
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
