import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import './Header.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; 
import { useNavigate } from 'react-router-dom'; 

const Header = () => {
  const navigate = useNavigate(); 
  const [fetchobtainClientNameData, setfetchobtainClientNameData] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/'); 
  };
  useEffect(() => {
    const fetchobtainClientNameData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainClientName/`);        
        if (response.data) {
          setfetchobtainClientNameData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Handle Unauthorized Error
        } else {
          console.error('Error fetching dashboard data:', error);
          console.error('Error fetching dashboard data:', error.response);

        }
      }
    };
    fetchobtainClientNameData();
  }, []);

  // Check if the data is available before rendering
  if (!fetchobtainClientNameData) {
    return (
      <header className="header">
      <div className="header-left">
        <div className="logo-container">
            <img 
              src='#'
              alt="Logo" 
              className="logo-image"
            />
          <div className="logo">SuperAdmin</div>
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
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          {fetchobtainClientNameData.logo ? (
            <img 
              src={fetchobtainClientNameData.logo} 
              alt="Logo" 
              className="logo-image"
            />
          ) : (
            <div>No logo available</div> // Handle case where no logo is provided
          )}
          <div className="logo">{fetchobtainClientNameData.name}</div>
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