import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminHomePage from './components/adminFlow/HomePage'; 
import SuperAdminHomePage from './components/superAdminFlow/SuperAdminHomePage'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
                <Route path="*" element={<Navigate to="" />} />
        <Route path="/Admin/*" element={<AdminHomePage />} />
        <Route path="/SuperAdmin/*" element={<SuperAdminHomePage />} /> 
      </Routes>
    </Router>
  );
}
export default App;