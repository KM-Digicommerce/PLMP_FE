import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';
import unauthorizedImage from '../../src/assets/401-error-unauthorized-concept-illustration_114360-5531.avif';
// assets/401-error-unauthorized-concept-illustration_114360-5531.avif'; 

// import unauthorizedImage from '../path/to/your/401-image.png'; // Replace with the actual path

function Unauthorized() {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate('/'); // Replace with your login route
  };

  return (
    <div className="unauthorized-container">
      <img src={unauthorizedImage} alt="401 Unauthorized" className="unauthorized-image" />
      <button onClick={handleBackToLogin} className="back-to-login-button">
        Back to Login
      </button>
    </div>
  );
}

export default Unauthorized;
