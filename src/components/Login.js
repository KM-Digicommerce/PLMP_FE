// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_IP}/loginUser/`, {
        name,
        password,
      });

      if (response.data.data.valid) {
        localStorage.setItem('user_login_id', response.data.data.user_login_id);
        // window.location.href = '/HomePage';
        navigate("/HomePage");

      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Invalid name or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password submit
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    if (newPassword !== confirmPassword) {
      setOtpError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_IP}/resetPassword/`, {
        otp,
        email,
        newPassword,
      });

      if (response.data.success) {
        alert('Password updated successfully');
        setShowForgotPassword(false);
        setOtpSent(false);
      } else if (response.data.error === 'Invalid Verification Code') {
        setOtpError('Invalid Verification Code. Please try again.');
      } else if (response.data.error === 'Verification Code has expired') {
        setOtpError('Code has expired. Please request a new one.');
      } else {
        setOtpError('An error occurred while resetting your password');
      }
    } catch (err) {
      setOtpError('An error occurred while resetting your password');
      console.error(err);
    }
  };

  // Handle email submission to send Verification Code
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setLoadingEmail(true);

    if (!email) {
      setEmailError('Please enter a valid email');
      setLoadingEmail(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_IP}/sendOtp/`, { email });
      console.log(response);
      if (response.data.status) {
        setOtpSent(true);
      } else {
        setEmailError('Failed to send Verification Code, please try again');
      }
    } catch (err) {
      setEmailError('An error occurred while sending Verification Code');
      console.error(err);
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-h2">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="one">
            <label className="label-login" htmlFor="email">Name</label>
            <input
              className="label-input"
              type="text"
              id="email"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="one">
            <label className="label-login" htmlFor="password">Password</label>
            <input
              className="label-input"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="button-login" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>

        <p className="forgot-password" onClick={() => setShowForgotPassword(true)}>
          Forgot Password?
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content-reset-password">
            <button
              className="close-x-modal"
              onClick={() => {
                setShowForgotPassword(false);
                setOtpSent(false);
              }}
            >
              &times;
            </button>

            {!otpSent ? (
              <>
                <h3>Enter Your Email</h3>
                <form onSubmit={handleEmailSubmit}>
                  <div className="one">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button className="button" type="submit" disabled={loadingEmail}>
                    {loadingEmail ? 'Sending...' : 'Send Verification Code'}
                  </button>
                  {emailError && <p className="error-message">{emailError}</p>}
                </form>
              </>
            ) : (
              <>
                <h3>Reset Your Password</h3>
                <form onSubmit={handleForgotPasswordSubmit}>
                  <div className="one">
                    <label htmlFor="otp">Verification Code</label>
                    <input
                      type="text"
                      id="otp"
                      value={otp || ''}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="one">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="one">
                    <label htmlFor="confirmPassword">Re-enter Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button className="button" type="submit">
                    Submit
                  </button>
                  {otpError && <p className="error-message">{otpError}</p>}
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
