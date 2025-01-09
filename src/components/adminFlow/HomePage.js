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
import HiddenProduct from './HiddenProduct/HiddenProduct.js';
import VendorSummary from './brand/VendorSummary.js';


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
  const [showHidden, setShowHidden] = useState(false);
  const [showRevokePrice, setShowRevokePrice] = useState(false);
  const [showVendorSummary, setShowvendorsummary] = useState(false);


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
  // const handleNavigation = (path) => {
  //       navigate(path);
  //     };

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
  const handleHiddenClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/hiddenproduct");
    }
    setShowHidden(true);
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
  const handleRevokePriceClick = () => {
    if ((location.pathname.includes("product/"))) { 
      navigate("/Admin/restoreprice");
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
  // const handlevendorSummaryClick = () => {
  //   if ((location.pathname.includes("product/"))) { 
  //     navigate("/Admin/hiddenproduct");
  //   }
  //   setShowvendorsummary(true);
  //   setShowHidden(false);
  //   setShowUser(false);
  //   setShowPrice(false);
  //   setShowImport(false);
  //   setShowExport(false);
  //   setShowBrand(false);
  //   setShowHistory(false);
  //   setShowDashboard(false);
  //   setShowCategoriesTable(false);
  //   setShowProductList(false);
  //   setShowVariantsTable(false);
  //   setAddProduct(false);
  // };
// const renderContent = () => {
//   const path = location.pathname;

//   if (path === '/' || path === '/Admin') {
//     return <Dashboard />;
//   } else if (path === '/Admin/categories') {
//     return <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />;
//   } else if (path === '/Admin/products') {
//     return <ProductList />;
//   } else if (path === '/Admin/variants') {
//     return <VariantList categories={categoriesData} />;
//   } else if (path === '/Admin/addProduct') {
//     return <AddProduct categories={categoriesData} />;
//   } else if (path === '/Admin/history') {
//     return <HistoryPage />;
//   } else if (path === '/Admin/brand') {
//     return <BrandList />;
//   } else if (path === '/Admin/export') {
//     return <ExportPage categories={categoriesData} />;
//   } else if (path === '/Admin/import') {
//     return <ApiResponseModal />;
//   } else if (path === '/Admin/price') {
//     return <Price />;
//   } else if (path === '/Admin/createuser') {
//     return <CreateUser />;
//   } else if (path === '/Admin/revokeprice') {
//     return <RevokePrice />;
//   } else if (path.startsWith('/product/:productId')) {
//     return <ProductDetail categories={categoriesData} />;
//   }

//   return null; // Default fallback
// };
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
            // OnPriceClick={() => handleNavigation('/Admin/price')}
            OnHiddenClick={handleHiddenClick}
            OnUserClick={handleCreateUserClick}
            OnRevokePriceClick={handleRevokePriceClick}
            // OnVendorSummaryClick={handlevendorSummaryClick}
            // OnRevokePriceClick={() => handleNavigation('/Admin/revokeprice')}


          />
        </div>
        <div className="right-container">
          <Routes>
            <Route path="/" element={
              showDashboard ? (
                <Dashboard />
              )  : showProductList ? (
                <ProductList productTypeId={selectedProductTypeId} />
              ) : null
            } />
            <Route path="/history" element={ showHistory ? ( <HistoryPage />):null} />
            <Route path="/categorylist"  element={showCategoriesTable ? (<CategoriesTable categories={categoriesData} refreshCategories={fetchCategories}  />) : null}  />
            <Route path="/variantlist"  element={showVariantsTable ? (<VariantList categories={categoriesData} />) : null}  />
            <Route path="/addproduct"  element={addProduct ? (<AddProduct categories={categoriesData} />) : null}  />
            <Route path="/product/:productId" element={<ProductDetail categories={categoriesData}/>} />
            <Route path="/vendor" element={  showBrand ? ( <BrandList />):null} />
            <Route path="/export" element={  showExport ? ( <ExportPage categories={categoriesData}/>):null} />
            <Route path="/import" element={  showImport ? ( <ApiResponseModal />):null} />
            <Route path="/price" element={  showPrice ? ( <Price />):null} />
            <Route path="/createuser" element={  showUser ? ( <CreateUser />):null} />
            <Route path="/hiddenproduct" element={  showHidden ? ( <HiddenProduct />):null} />
            <Route path="/restoreprice" element={  showRevokePrice ? ( <RevokePrice />):null} />
            <Route path="/vendorsummary/:brandId" element={ ( <VendorSummary />)} />
          </Routes>
          {/* {renderContent()} */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
// import React, { useState, useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import './HomePage.css';
// import Sidebar from './sidebar/Sidebar';
// import ProductList from './products/ProductList';
// import ProductDetail from './products/ProductDetail';
// import Header from '../Header/Header.js';
// import Footer from '../Footer/Footer.js';
// import CategoriesTable from './category/categorytable/CategoriesTable';
// import VariantList from './variants/VariantList';
// import AddProduct from './products/AddProduct';
// import Dashboard from './dashboard/Dashboard';
// import axiosInstance from '../../utils/axiosConfig.js';
// import HistoryPage from './History/HistoryPage.js';
// import BrandList from './brand/BrandList.js';
// import ExportPage from './Export/ExportPage.js';
// import ApiResponseModal from '../../ApiResponseModal.js';
// import Price from './Price/Price.js';
// import CreateUser from './Users/CreateUser.js';
// import RevokePrice from './Price/RevokePrice.js';

// function HomePage() {
//   const [categoriesData, setCategoriesData] = useState([]);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedProductTypeId, setSelectedProductTypeId] = useState(null);


//   // Fetch categories
//   const fetchCategories = async () => {
//     try {
//       const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
//       setCategoriesData(res.data.data);
//     } catch (err) {
//       console.error('ERROR', err);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   // Handle Sidebar Navigation
//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   if (!categoriesData) {
//     return (
//       <div className="superAdmin-error-message">
//         <p>Error loading dashboard data. Please try again later.</p>
//       </div>
//     );
//   }

//   // Determine active component based on current route
//   const renderContent = () => {
//     const path = location.pathname;

//     if (path === '/' || path === '/Admin') {
//       return <Dashboard />;
//     } else if (path === '/Admin/categories') {
//       return <CategoriesTable categories={categoriesData} refreshCategories={fetchCategories} />;
//     } else if (path === '/Admin/products') {
//       return <ProductList />;
//     } else if (path === '/Admin/variants') {
//       return <VariantList categories={categoriesData} />;
//     } else if (path === '/Admin/addProduct') {
//       return <AddProduct categories={categoriesData} />;
//     } else if (path === '/Admin/history') {
//       return <HistoryPage />;
//     } else if (path === '/Admin/vendor') {
//       return <BrandList />;
//     } else if (path === '/Admin/export') {
//       return <ExportPage categories={categoriesData} />;
//     } else if (path === '/Admin/import') {
//       return <ApiResponseModal />;
//     } else if (path === '/Admin/price') {
//       return <Price />;
//     } else if (path === '/Admin/createuser') {
//       return <CreateUser />;
//     } else if (path === '/Admin/revokeprice') {
//       return <RevokePrice />;
//     } else if (path.startsWith('/product/:productId')) {
//       return <ProductDetail categories={categoriesData} />;
//     }

//     return null; // Default fallback
//   };

//   return (
//     <div>
//       <Header />
//       <div className="main-container">
//         <div className="sidebar-container">
//           <Sidebar
//             setSelectedProductTypeId= {setSelectedProductTypeId}
//             onCategoriesClick={() => handleNavigation('/Admin/categories')}
//             onAllProductsClick={() => handleNavigation('/Admin/products')}
//             OnAllVariantsClick={() => handleNavigation('/Admin/variants')}
//             OnAddProductClick={() => handleNavigation('/Admin/addProduct')}
//             onDashboardClick={() => handleNavigation('/Admin')}
//             onHistoryClick={() => handleNavigation('/Admin/history')}
//             onBrandClick={() => handleNavigation('/Admin/brand')}
//             OnExportClick={() => handleNavigation('/Admin/export')}
//             OnImportClick={() => handleNavigation('/Admin/import')}
//             OnPriceClick={() => handleNavigation('/Admin/price')}
//             OnUserClick={() => handleNavigation('/Admin/createuser')}
//             OnRevokePriceClick={() => handleNavigation('/Admin/revokeprice')}
//           />
//         </div>
//         <div className="right-container">{renderContent()}</div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default HomePage;
