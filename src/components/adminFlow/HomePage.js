import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './HomePage.css';
import Sidebar from './sidebar/Sidebar';
import ProductList from './products/ProductList';
import ProductDetail from './products/ProductDetail';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import CategoriesTable from './category/categorytable/CategoriesTable';
import VariantList from './variants/VariantList';
import AddProduct from './products/AddProduct';
import Dashboard from './dashboard/Dashboard';
import axiosInstance from '../../utils/axiosConfig.js';
import { useNavigate,useLocation } from 'react-router-dom';
import HistoryPage from './History/HistoryPage.js';
import BrandList from './brand/BrandList.js';
import ExportPage from './Export/ExportPage.js';
import ApiResponseModal from '../../ApiResponseModal.js';
import Price from './Price/Price.js';
import CreateUser from './Users/CreateUser.js';
import RevokePrice from './Price/RevokePrice.js';


function HomePage() {
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);
  const [showCategoriesTable, setShowCategoriesTable] = useState(false);
  const [showProductList, setShowProductList] = useState(false);
  const [showVariantsTable, setShowVariantsTable] = useState(false);
  const [addProduct, setAddProduct] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showRevokePrice, setShowRevokePrice] = useState(false);

  const [showDashboard, setShowDashboard] = useState(true); // Default to show dashboard  
  const navigate = useNavigate();
  const location = useLocation();
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      setCategoriesData(res.data.data);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!categoriesData) {
    return (
      <div className="superAdmin-error-message">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }
  const handleCategoriesClick = () => {
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowDashboard(false);
    setShowCategoriesTable(true);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllProductsClick = () => {
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(true);
    setSelectedProductTypeId(null);
    setShowVariantsTable(false);
    setAddProduct(false);
  };

  const handleAllVariantsClick = () => {
    console.log(location.pathname,'productId');
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(true);
    setAddProduct(false);
  };

  const handleAddProductsClick = () => {
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(true);
  };

  const handleDashboardClick = () => {
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowDashboard(true);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleHistoryClick = () => {
    if ((location.pathname.includes("product/")) || (location.pathname.includes("Admin/"))) { 
      navigate("/Admin");
    }
    setShowHistory(true);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleBrandClick = () => {
    if ( (location.pathname.includes("product/"))) { 
      navigate("/Admin/brand");
    }
    setShowBrand(true);
    setShowHistory(false);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleExportClick = () => {
    if ( (location.pathname.includes("product/"))) { 
      navigate("/Admin/export");
    }
    setShowExport(true);
    setShowBrand(false);
    setShowHistory(false);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleImportClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/import");
    }
    setShowImport(true);
    setShowExport(false);
    setShowBrand(false);
    setShowHistory(false);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handlePriceClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/price");
    }
    setShowPrice(true);
    setShowImport(false);
    setShowExport(false);
    setShowBrand(false);
    setShowHistory(false);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleCreateUserClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/createuser");
    }
    setShowUser(true);
    setShowPrice(false);
    setShowImport(false);
    setShowExport(false);
    setShowBrand(false);
    setShowHistory(false);
    setShowDashboard(false);
    setShowCategoriesTable(false);
    setShowProductList(false);
    setShowVariantsTable(false);
    setAddProduct(false);
  };
  const handleRevokePriceClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/revokeprice");
    }
    setShowRevokePrice(true);
    setShowUser(false);
    setShowPrice(false);
    setShowImport(false);
    setShowExport(false);
    setShowBrand(false);
    setShowHistory(false);
    setShowDashboard(false);
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
            onHistoryClick={handleHistoryClick}
            onBrandClick={handleBrandClick}
            OnExportClick={handleExportClick}
            OnImportClick={handleImportClick}
            OnPriceClick={handlePriceClick}
            OnUserClick={handleCreateUserClick}
            OnRevokePriceClick={handleRevokePriceClick}

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
              ) : showHistory ? (
                <HistoryPage  />
              ) : null
            } />
            <Route path="/product/:productId" element={<ProductDetail categories={categoriesData}/>} />
            <Route path="/brand" element={  showBrand ? ( <BrandList />):null} />
            <Route path="/export" element={  showExport ? ( <ExportPage categories={categoriesData}/>):null} />
            <Route path="/import" element={  showImport ? ( <ApiResponseModal />):null} />
            <Route path="/price" element={  showPrice ? ( <Price />):null} />
            <Route path="/createuser" element={  showUser ? ( <CreateUser />):null} />
            <Route path="/revokeprice" element={  showRevokePrice ? ( <RevokePrice />):null} />
          </Routes>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
