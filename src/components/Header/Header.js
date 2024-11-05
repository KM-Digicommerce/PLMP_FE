import React from 'react';
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <header className="header">
      <div className="image-container1">
        <img src="https://kmdigicommerce.com/wp-content/uploads/2024/08/KM-2048x1976.png" alt="Login" />
      </div>
      <div className="logo">Product Library Management Portal</div>
      <div className="header-actions">
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
