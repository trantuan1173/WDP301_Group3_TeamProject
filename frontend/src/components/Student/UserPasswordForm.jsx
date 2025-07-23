// frontend/src/components/Student/UserPasswordForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';

const UserChangePasswordForm = () => {
  const token = localStorage.getItem('token');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const passwordsMatch = newPassword === confirmPassword;
  const allFieldsFilled = currentPassword && newPassword && confirmPassword;
  const isFormValid = passwordsMatch && allFieldsFilled;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const res = await axios.post(
        API_ENDPOINTS.CHANGE_PASSWORD,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="p-6 m-4 rounded shadow" style={{ maxWidth: '500px', margin: '0 auto', backgroundColor: '#fff' }}>
      <h2 className="text-center text-xl font-semibold mb-6">Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Current Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">New Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-red-500">Passwords do not match</p>
          )}
        </div>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 text-white rounded"
            style={{
              backgroundColor: isFormValid ? '#007bff' : '#D1D5DC',
              cursor: isFormValid ? 'pointer' : 'not-allowed',
            }}
            disabled={!isFormValid}
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserChangePasswordForm;
