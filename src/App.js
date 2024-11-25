// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login'; // Import your Login component
import HomePage from './components/HomePage'; // Import your HomePage component
// import ProductDetail from './components/products/ProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<Login />} /> {/* Login Route */}
        <Route path="" element={<Login />} /> {/* Login Route */}
        <Route path="/HomePage/*" element={<HomePage />} /> {/* HomePage Route */}
        {/* <Route path="/product/:productId" element={<ProductDetail />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
