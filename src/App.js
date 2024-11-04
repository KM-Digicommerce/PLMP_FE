// src/App.js
import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import Route and Routes
import Sidebar from './components/sidebar/Sidebar';
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import Header from './components/Header/Header';
import CategoriesTable from './components/category/categorytable/CategoriesTable';
import VariantList from './components/variants/VariantList';
import axios from 'axios';

function App() {
  const [categoriesData, setCategoriesData] = useState([]); // Initialize as an array
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [showCategoriesTable, setShowCategoriesTable] = useState(false); // State to show/hide the table
  const [showProductList, setShowProductList] = useState(false); // State to show/hide the product list
  const [showVariantsTable, setShowVariantsTable] = useState(false); // State to show/hide the table

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      // console.log('API Response: here', res.data); // Log the API response
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
  const handleAllVariantsClick = () => {
    setShowCategoriesTable(false); // Hide the categories table
    setShowProductList(false); // Show the product list
    setShowVariantsTable(true);
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
              OnAllVariantsClick={handleAllVariantsClick}
            />
          </div>
          <div className="right-container">
          <Routes>
              {/* Categories Table or Product List */}
              <Route
                path="/"
                element={
                  showCategoriesTable ? (
                    <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />
                  ) : showProductList ? (
                    <ProductList productTypeId={selectedProductTypeId} />
                  ) :showVariantsTable ? (
                    <VariantList  path="/variants/" categories={categoriesData} />
                  ) : null
                }
              />

              {/* Product Detail Page */}
              <Route path="/product/:productId" element={<ProductDetail />} />
              {/* <Route path="/variants/" element={<VariantList />} /> */}

            </Routes>
          </div>
        </div>
      </>
    </Router>
  );
}

export default App;
