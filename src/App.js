import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import HomePage from './components/HomePage'; // Import your HomePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
                <Route path="*" element={<Navigate to="" />} /> 
        {/* <Route path="/Login" element={<Login />} /> */}
        {/* <Route path="*" element={<Navigate to="/Login" />} />  */}
        {/* Redirect unmatched routes */}
        <Route path="/HomePage/*" element={<HomePage />} /> {/* HomePage Route */}
      </Routes>
    </Router>
  );
}

export default App;
