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
      const endpoint =
        role === "teacher" ? API_ENDPOINTS.REGISTER_TEACHER : API_ENDPOINTS.REGISTER;

      const response = await axios.post(endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setShowVerifyMsg(true);
        if (onSubmit) onSubmit();
      }
    } catch (error) {
      alert("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing form when clicking inside
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Create New Account</h2>

        {showVerifyMsg && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-3 text-center">
            Registration successful! Please ask the user to verify their email.
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={formData.profileData.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full bg-blue-100 p-2 rounded"
            required
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="w-full bg-blue-100 p-2 rounded"
            required
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="w-full bg-blue-100 p-2 rounded"
            required
          />
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-blue-100 p-2 rounded"
            required
          >
            <option value="">Roles</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
              disabled={isLoading}
            >
              Close
            </button>
            <button
              type="submit"
              className="bg-indigo-900 text-white px-6 py-2 rounded hover:bg-indigo-800"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}