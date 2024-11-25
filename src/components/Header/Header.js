
import React from 'react';
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/Login'); 
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          <img 
            src="https://kmdigicommerce.com/wp-content/uploads/2024/08/KM-2048x1976.png" 
            alt="Logo" 
            className="logo-image"
          />
          <div className="logo">Product Library Management Portal</div>
        </div>
      </div>
      <div className="header-right">
        <button className="logout-button" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
