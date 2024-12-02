import React, { useState } from 'react';
import './SuperAdminSidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faColumns, faStore } from '@fortawesome/free-solid-svg-icons';

const SuperAdminSidebar = ({ onDashboardClick, onclientsClick }) => {
  const [activeSection, setActiveSection] = useState('SuperAdminDashboard');

  const handleSectionClick = (section) => {
    setActiveSection(section); // Set active section state
    // Trigger the corresponding callback based on the section clicked
    if (section === 'SuperAdminDashboard') {
      onDashboardClick();
    } else if (section === 'client') {
      onclientsClick();
    }
  };

  return (
    <div className="sidebar">
      <ul className="topMenu">
        {/* Dashboard section */}
        <li
          onClick={() => handleSectionClick('SuperAdminDashboard')}
          className={activeSection === 'SuperAdminDashboard' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faColumns} className="icon" />
          Dashboard
        </li>
        {/* client section */}
        <li
          onClick={() => handleSectionClick('client')}
          className={activeSection === 'client' ? 'active' : ''}
        >
          <FontAwesomeIcon icon={faStore} className="icon" />
          clients
        </li>
      </ul>
    </div>
  );
};

export default SuperAdminSidebar;
