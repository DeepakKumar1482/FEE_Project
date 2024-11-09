import React, { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';

// ForgotPasswordModal component
const ForgotPasswordModal = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = async () => {
    if (!email) {
      message.error('Please enter your email');
      return;
    }
    
    setLoading(true);
    try {
        console.log(email);
        // "http://localhost:8080/api/user/verifyotp"
      const res = await axios.post('http://localhost:8080/api/user/OtpSend', {
        email
      });
      if(!res.data.success){
        message.error(res.data.message);
      }
      if (res.data.success) {
        message.success('OTP sent successfully');
        setShowOtpModal(true);
      }
    } catch (err) {
      console.log(err);
      message.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      message.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/user/verify-forgot-otp', {
        email,
        otp
      });
      if (res.data.success) {
        message.success(res.data.message);
        setShowOtpModal(false);
        setShowResetModal(true);
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error('Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      message.error('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/user/reset-password', {
        email,
        newPassword,
        // otp
      });
      if (res.data.success) {
        message.success('Password reset successful');
        onClose();
      } else {
        message.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      message.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOtpModal(false);
    setShowResetModal(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Email Modal */}
      {!showOtpModal && !showResetModal && (
        <div className="bg-[#242526] p-6 rounded-lg w-96 border border-gray-300">
          <h2 className="text-xl text-white mb-4">Forgot Password</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email/Password"
            className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mb-4 p-2 rounded-md border border-gray-300"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="px-4 py-2 bg-[#695CFE] hover:bg-[#574cd0] text-white rounded-md"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="bg-[#242526] p-6 rounded-lg w-96 border border-gray-300">
          <h2 className="text-xl text-white mb-4">Enter OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mb-4 p-2 rounded-md border border-gray-300"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="px-4 py-2 bg-[#695CFE] hover:bg-[#574cd0] text-white rounded-md"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="bg-[#242526] p-6 rounded-lg w-96 border border-gray-300">
          <h2 className="text-xl text-white mb-4">Reset Password</h2>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mb-4 p-2 rounded-md border border-gray-300"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="bg-transparent text-white h-12 text-lg placeholder:text-gray-400 w-full mb-4 p-2 rounded-md border border-gray-300"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="px-4 py-2 bg-[#695CFE] hover:bg-[#574cd0] text-white rounded-md"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordModal;