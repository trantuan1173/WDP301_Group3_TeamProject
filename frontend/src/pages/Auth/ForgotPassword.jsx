import React, { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_ENDPOINTS.FORGOT_PASSWORD}`, {
        email,
      });
      setMessage("Please check your email for the password reset link.");
    } catch (error) {
      setMessage("Failed to send. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex justify-center mb-6">
          <img src="/images/logo.png" alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Forgot Password
        </h2>
        {message && (
          <p className="text-sm text-center text-blue-600 mb-4">{message}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Send Password Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}
