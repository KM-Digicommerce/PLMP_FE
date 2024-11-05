// src/components/HomePage.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Make sure to import Route and Routes
import './HomePage.css';
import Sidebar from './sidebar/Sidebar';
import ProductList from './products/ProductList';
import ProductDetail from './products/ProductDetail';
import Header from './Header/Header';
import CategoriesTable from './category/categorytable/CategoriesTable';
import VariantList from './variants/VariantList';
import AddProduct from './products/AddProduct';
import axios from 'axios';

function HomePage() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [showCategoriesTable, setShowCategoriesTable] = useState(true); // Default to show categories
  const [showProductList, setShowProductList] = useState(false);
  const [showVariantsTable, setShowVariantsTable] = useState(false);
  const [addProduct, setAddProduct] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      setCategoriesData(res.data.data);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  
  const handleCategoriesClick = () => {
    setShowCategoriesTable(true);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllProductsClick = () => {
    setShowCategoriesTable(false);
    setShowProductList(true);
    setSelectedProductTypeId(null);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllVariantsClick = () => {
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(true);
    setAddProduct(false);
  };

  const handleAddProductsClick = () => {
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(true);
  };

  return (
    <div>
      <Header />
      <div className="main-container">
        <div className="sidebar-container">
          <Sidebar
            setSelectedProductTypeId={setSelectedProductTypeId}
            onCategoriesClick={handleCategoriesClick}
            onAllProductsClick={handleAllProductsClick}
            OnAllVariantsClick={handleAllVariantsClick}
            OnAddProductClick={handleAddProductsClick}
          />
        </div>
        <div className="right-container">
          <Routes>
            <Route path="/" element={
              showCategoriesTable ? (
                <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />
              ) : showProductList ? (
                <ProductList productTypeId={selectedProductTypeId} />
              ) : showVariantsTable ? (
                <VariantList categories={categoriesData} />
              ) : addProduct ? (
                <AddProduct categories={categoriesData} />
              ) : null
            } />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
