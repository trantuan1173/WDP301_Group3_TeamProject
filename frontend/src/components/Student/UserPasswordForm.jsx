// frontend/src/components/Student/UserPasswordForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const UserChangePasswordForm = () => {
  const token = localStorage.getItem('token');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'One number', test: (p) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) },
  ];

  const isNewPasswordValid = passwordRequirements.every((req) =>
    req.test(newPassword)
  );


  const passwordsMatch = newPassword === confirmPassword;
  const allFieldsFilled = currentPassword && newPassword && confirmPassword;
  const isFormValid = passwordsMatch && allFieldsFilled && isNewPasswordValid;


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

  const renderPasswordInput = (label, value, onChange, show, setShow) => (
    <div style={{ width: '500px', position: 'relative', marginBottom: '29px' }}>
      <label className="block font-medium" style={{ paddingBottom: '15px' }}>{label}</label>
      <input
        type={show ? 'text' : 'password'}
        className="w-full p-3 rounded pr-10"
        style={{
          border: '1px solid #D6BDBD',
          borderRadius: '10px',
        }}

        value={value}
        onChange={onChange}
        required
      />
      <FontAwesomeIcon
        icon={show ? faEye : faEyeSlash}
        onClick={() => setShow(!show)}
        style={{
          position: 'absolute',
          top: '58px',
          right: '15px',
          cursor: 'pointer',
          color: '#555'
        }}
      />
      {label === 'New Password' && newPassword && (
        <ul style={{ paddingTop: '10px', paddingLeft: '20px', color: '#555' }}>
          {passwordRequirements.map((req, index) => (
<li
  key={index}
  style={{
    color: req.test(newPassword) ? 'green' : '#999', // changed 'red' to '#999'
    fontSize: '14px'
  }}
>
  • {req.label}
</li>

          ))}
        </ul>
      )}

    </div>
  );

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100%',
      width: '100%',
      backgroundColor: '#F1F6FA',
      marginTop: '20px',
    }}>
      <div className="p-6 rounded shadow"
        style={{
          width: '900px',
          height: '100%',
          backgroundColor: '#fff',
          border: '1px solid #D6BDBD',
          borderRadius: '10px',
        }}>

        <h2 className="text-center text-xl font-semibold mb-6" style={{ paddingBottom: '45px' }}>Change Password</h2>
        <Container>
          <form onSubmit={handleSubmit} className="space-y-4 d-flex flex-column align-items-center">
            {renderPasswordInput('Old Password', currentPassword, (e) => setCurrentPassword(e.target.value), showCurrent, setShowCurrent)}
            {renderPasswordInput('New Password', newPassword, (e) => setNewPassword(e.target.value), showNew, setShowNew)}
            {renderPasswordInput('Confirm New Password', confirmPassword, (e) => setConfirmPassword(e.target.value), showConfirm, setShowConfirm)}

            {confirmPassword && !passwordsMatch && (
              <p className="text-sm text-red-500">Passwords do not match</p>
            )}

            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="mt-4">
              <button
                type="submit"
                className="px-6 py-3 text-white rounded"
                style={{
                  backgroundColor: isFormValid ? '#007bff' : '#D1D5DC',
                  cursor: isFormValid ? 'pointer' : 'not-allowed',
                  width: '200px'
                }}
                disabled={!isFormValid}
              >
                Change Password
              </button>
            </div>
          </form>
        </Container>
      </div>
    </div>
  );

};

export default UserChangePasswordForm;
