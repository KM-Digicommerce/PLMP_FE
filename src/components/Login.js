// src/components/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); // Initialize useNavigate

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
        localStorage.setItem('token', response.data.token);
        window.location.href = '/HomePage'; 
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

  return (
    <div className="login-page">
      {/* <div className="image-container">
        <img src="path/to/your/image.jpg" alt="Login" />
      </div> */}
      <div className="login-container">
        <h2 className="login-h2">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className='one'>
            <label className="label-login" htmlFor="name">Name</label>
            <input
            className="label-input"
              type="1"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className='one'>
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
          <button className='button' type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="forgot-password">
          <button
            type="button"
            className="link-button"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
