import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './HomePage.css';
import Sidebar from './sidebar/Sidebar';
import ProductList from './products/ProductList';
import ProductDetail from './products/ProductDetail';
import Header from './Header/Header';
import CategoriesTable from './category/categorytable/CategoriesTable';
import VariantList from './variants/VariantList';
import AddProduct from './products/AddProduct';
import Dashboard from './dashboard/Dashboard';
import axios from 'axios';

function HomePage() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [showCategoriesTable, setShowCategoriesTable] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showVariantsTable, setShowVariantsTable] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true); // Default to show dashboard  
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      console.log(res.data.data.category_list,'es.data.data');
      
      setCategoriesData(res.data.data);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoriesClick = () => {
    setShowDashboard(false);
    setShowCategoriesTable(true);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllProductsClick = () => {
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(true);
    setSelectedProductTypeId(null);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllVariantsClick = () => {
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(true);
    setAddProduct(false);
  };

  const handleAddProductsClick = () => {
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(true);
  };

  const handleDashboardClick = () => {
    setShowDashboard(true);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
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
            onDashboardClick={handleDashboardClick}
          />
        </div>
        <div className="right-container">
          <Routes>
            <Route path="/" element={
              showDashboard ? (
                <Dashboard />
              ) : showCategoriesTable ? (
                <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />
              ) : showProductList ? (
                <ProductList productTypeId={selectedProductTypeId} />
              ) : showVariantsTable ? (
                <VariantList categories={categoriesData} />
              ) : addProduct ? (
                <AddProduct categories={categoriesData} />
              ) : null (
              )
            } />
            <Route path="/product/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
