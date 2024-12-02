import React, { useState, useEffect } from 'react';
import './SuperAdminDashboard.css';
import axiosInstance from '../../../../src/utils/axiosConfig';

const SuperAdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainSuperAdminDashboard/`);
        if (response.data.estatus) {
          setDashboardData(response.data.data); 
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(true);  
      }
    };

    fetchDashboardData();
  }, []); // Only runs once after the component mounts

  if (error) {
    return (
      <div className="superAdmin-error-message">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="superAdmin-loading-message">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="superAdmin-dashboard-container">
      <div className="superAdmin-dashboard-title">Super Admin Dashboard</div>
      <div className="superAdmin-dashboard-cards">
        <div className="superAdmin-card">
          <h3>Clients Count</h3>
          <p>{dashboardData.clients_count}</p>
        </div>
        <div className="superAdmin-card">
          <h3>Active Users Count</h3>
          <p>{dashboardData.active_users_count}</p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
