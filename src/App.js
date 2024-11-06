// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import HomePage from './components/HomePage'; // Import your HomePage component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Route */}
        <Route path="/HomePage" element={<HomePage />} /> {/* HomePage Route */}
      </Routes>
    </Router>
  );
}

export default App;
