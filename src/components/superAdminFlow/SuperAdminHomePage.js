import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './SuperAdminHomePage.css';
import SuperAdminSidebar from './sidebar/SuperAdminSidebar';
import SuperAdminDashboard from './super-admin-dashboard/SuperAdminDashboard';
import Clients from './Clients/Clients';
import ClientDetails from './Clients/clientDetails';
import Header from '../Header/Header';

function SuperAdminHomePage() {
  const [activePage, setActivePage] = useState('SuperAdminDashboard');  // Default to SuperAdminDashboard
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch categories (Optional if needed for clients or Dashboard)
  const fetchCategories = async () => {
    try {
      // Uncomment and use the below line for actual category fetching
      // const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/`);
    } catch (err) {
      console.log('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === 'SuperAdminDashboard') {
      navigate('/superadmin/dashboard');  // Correct route for SuperAdminDashboard
    } else if (page === 'clients') {
      navigate('/superadmin/clients');  // Correct route for
    }
  };

  return (
    <div>
      <Header />
      <div className="superadmin-main-container">
        <div className="superadmin-sidebar-container">
          <SuperAdminSidebar
            onDashboardClick={() => handlePageChange('SuperAdminDashboard')}
            onclientsClick={() => handlePageChange('clients')}
          />
        </div>
        <div className="superadmin-right-container">
          <Routes>
            <Route path="/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/" element={<SuperAdminDashboard />} />
            <Route path="/clientDetail/:clientId" element={<ClientDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
export default SuperAdminHomePage;