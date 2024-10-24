// src/App.js
import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Sidebar from './components/sidebar/Sidebar';
import ProductList from './components/products/ProductList';
import Header from './components/Header/Header';
import CategoriesTable from './components/category/categorytable/CategoriesTable';
import axios from 'axios';

function App() {
  const [categoriesData, setCategoriesData] = useState([]); // Initialize as an array
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [showCategoriesTable, setShowCategoriesTable] = useState(false); // State to show/hide the table
  const [showProductList, setShowProductList] = useState(false); // State to show/hide the product list

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      console.log('API Response: here', res.data); // Log the API response
      setCategoriesData(res.data.data);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoriesClick = () => {
    setShowCategoriesTable(true); // Show the Categories table when clicked
    setShowProductList(false); // Hide the product list when switching to categories
  };

  const handleAllProductsClick = () => {
    setShowCategoriesTable(false); // Hide the categories table
    setShowProductList(true); // Show the product list
    setSelectedProductTypeId(null); // Reset selected product type ID if needed
  };

  return (
    <Router> {/* Wrap your App in Router */}
      <>
        <Header />
        <div className="main-container">
          <div className="sidebar-container">
            <Sidebar
              setSelectedProductTypeId={setSelectedProductTypeId}
              onCategoriesClick={handleCategoriesClick}
              onAllProductsClick={handleAllProductsClick} // Pass the click handler
            />
          </div>
          <div className="right-container">
            {showCategoriesTable ? (
              <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />
            ) : showProductList ? ( // Corrected syntax here
              <ProductList productTypeId={selectedProductTypeId} />
            ) : null} <div className="welcome-container">
              <h1 className="welcome-title">Welcome to PLMP Project Tool</h1>
              <p className="welcome-message">Your one-stop solution for managing products and categories efficiently.</p>

            </div>
          </div>
        </div>
      </>
    </Router>
  );
}

export default App;
