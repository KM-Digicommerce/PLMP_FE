import React, { useState, useRef, useEffect } from 'react';
import './Sidebar.css';
import ApiResponseModal from '../../../ApiResponseModal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faUser, faFileImport, faFileExport, faCog, faHistory, faStore, faColumns,faCreditCard   } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import { useNavigate,useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../../src/utils/axiosConfig';
import CircularProgress from '@mui/material/CircularProgress';
import { LinearProgress } from '@mui/material';

const Sidebar = ({  onCategoriesClick, onAllProductsClick, OnAllVariantsClick, OnAddProductClick, onDashboardClick, onHistoryClick,onBrandClick, OnExportClick, OnImportClick, OnPriceClick, OnHiddenClick,OnUserClick, OnRevokePriceClick }) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedFilepath, setSelectedFilepath] = useState(null);
  
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    if (path === '/Admin/allproducts') {
      setActiveSection('products');
    }
  }, [path])
  const [uploadProgress, setUploadProgress] = useState(0);
  const UserRole = localStorage.getItem('user_role');

  const showUploadErrorSwal = (message) => {
    Swal.fire({title: 'Upload Failed',text: message,icon: 'error',confirmButtonText: 'OK',customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
      }
    });
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
    setUploadProgress(0);
    navigate('/Admin'); 
    window.location.reload();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-side', cancelButton: 'swal-custom-cancel',
        },
      });
      return;
    }
    setLoading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/upload_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });
      setSelectedFilepath(response.data.data.file_path);
      if (response.data && response.data.data.status === false) {
        setApiResponse(response.data.data);
        setShowResponseModal(true);
        setShowImportModal(false);
      } else {
        Swal.fire({ title: 'Success!', text: 'File uploaded successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
          }
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showUploadErrorSwal('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  const toggleProductsSubmenu = () => {
    setShowProductsSubmenu(!showProductsSubmenu);
  };
  const toggleSettingsSubmenu = () => {
    setShowSettingsSubmenu(!showSettingsSubmenu);
  };
  const handleSectionClick = (section) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (section === 'dashboard' || section === 'all-products' || section === 'add-product') {
      navigate('/Admin');
    }
    if (section !== 'products' && section !== 'setting') {
      setShowProductsSubmenu(false);  // Close the product submenu
      localStorage.removeItem("categoryId");
      localStorage.removeItem("levelCategory");
    }
    if (section !== 'setting') {
      setShowSettingsSubmenu(false);  // Close the admin control submenu
    }
    if (section !== 'products') {
      setShowProductsSubmenu(false);  // Close the admin control submenu
    }
      if (section === 'all-products' || section === 'add-product') {  setActiveSection('products')  }
      if (section === 'all-products') { navigate('/Admin/allproducts');window.location.reload(); }
      if (section === 'add-product') { navigate('/Admin/addproduct'); }
      if (section === 'hidden') {  navigate('/Admin/hiddenproduct');  }
      if (section === 'settings' || section === 'users') {  setActiveSection('setting')  }
      if (section === 'variants') {  navigate('/Admin/variantlist'); }
      if (section === 'categories') {  navigate('/Admin/categorylist'); }
      if (section === 'history') {  navigate('/Admin/history'); }
      setActiveSection(section);
    if (section === 'brand' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/vendor'); 
    }
    else if (section === 'export' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/export'); 
    }
    else if (section === 'import' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/import'); 
    }
    else if (section === 'price' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/price'); 
    }
    else if (section === 'users' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/createuser'); 
    }
    else if (section === 'restore' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/restoreprice'); 
    }
  };
  return (
    <div className="sidebar">
      <ul className="topMenu">
        <li onClick={() => { onDashboardClick(); handleSectionClick('dashboard'); }}
          className={activeSection === 'dashboard' ? 'active' : ''}><FontAwesomeIcon icon={faColumns} className="icon" /> Dashboard</li>
        <li onClick={() => { onBrandClick(); handleSectionClick('brand'); }}
          className={activeSection === 'brand' ? 'active' : ''}>
          <FontAwesomeIcon icon={faStore} className="icon" />
          Vendors
        </li>
        <li onClick={() => { onCategoriesClick(); handleSectionClick('categories'); }}
          className={activeSection === 'categories' ? 'active' : ''}>
          <FontAwesomeIcon icon={faTags} className="icon" />
          Categories
        </li>
        <li  onClick={() => { OnAllVariantsClick(); handleSectionClick('variants'); }}
          className={activeSection === 'variants' ? 'active' : ''}>
          <FontAwesomeIcon icon={faUser} className="icon" />
          Variants
        </li>
        <li onClick={() => {toggleProductsSubmenu(); handleSectionClick('products');}} className={`productsMenu ${activeSection === 'products' ? 'active' : ''}`}>
          <FontAwesomeIcon icon={faBox} className="icon" />
          Products
          {showProductsSubmenu && (
            <ul className="subMenu">
              <li onClick={() => { onAllProductsClick(); handleSectionClick('all-products'); }}
                className={activeSection === 'all-products' ? 'active' : ''} >All Products</li>
              <li onClick={() => { OnAddProductClick(); handleSectionClick('add-product'); }}
                className={activeSection === 'add-product' ? 'active' : ''}>Add New Product</li>
            </ul>
          )}
        </li>
        <li  onClick={() => { OnPriceClick(); handleSectionClick('price'); }}
          className={activeSection === 'price' ? 'active' : ''}>
          <FontAwesomeIcon icon={faCreditCard} className="icon" />
          Pricing
        </li>
        <li onClick={() => { OnImportClick();handleImportClick(); handleSectionClick('import'); }}
          className={activeSection === 'import' ? 'active' : ''}>
          <FontAwesomeIcon icon={faFileImport} className="icon" /> Import
        </li>
        {loading ? (
        <Modal open={showImportModal} onClose={closeImportModal}>
        <div className="import-modal">
                  <div style={{ marginTop: '10px' }}>
                      <LinearProgress variant="determinate" value={uploadProgress} />
                      <p style={{ textAlign: 'center', marginTop: '5px' }}>{uploadProgress}%</p>
                    </div>
                    </div>
                    </Modal>
      ) : (
        showResponseModal && (
          <ApiResponseModal
            showResponseModal={showResponseModal}
            setShowResponseModal={setShowResponseModal}
            apiResponse={apiResponse}
            selectedFilepath={selectedFilepath ? selectedFilepath : ""}
          />
        )
      )}
        <li onClick={() => { OnExportClick(); handleSectionClick('export'); }}
          className={activeSection === 'export' ? 'active' : ''}>
          <FontAwesomeIcon icon={faFileExport} className="icon" />
          Export
        </li>
        <li onClick={() => { onHistoryClick(); handleSectionClick('history'); }}
          className={activeSection === 'history' ? 'active' : ''}>  
          <FontAwesomeIcon icon={faHistory} className="icon" />
          Logs
        </li>
        <li onClick={() => {toggleSettingsSubmenu(); handleSectionClick('setting');}} className={`productsMenu ${activeSection === 'setting' ? 'active' : ''}`}>
        <FontAwesomeIcon icon={faCog} className="icon" />
        {UserRole === 'admin' ? 'Admin control' : 'User control'}
        {UserRole === 'admin' && showSettingsSubmenu && (
        <ul className="subMenu">
          <li onClick={() => { handleSectionClick('settings'); }}
              className={activeSection === 'settings' ? 'active' : ''}>
            Settings
          </li>
          <li onClick={() => { OnHiddenClick(); handleSectionClick('hidden'); }}
              className={activeSection === 'hidden' ? 'active' : ''}>
            Inactive Products
          </li>
          <li onClick={() => { OnRevokePriceClick(); handleSectionClick('restore'); }}
              className={activeSection === 'restore' ? 'active' : ''}>
            Restore Price
          </li>
          <li onClick={() => { OnUserClick(); handleSectionClick('users'); }}
              className={activeSection === 'users' ? 'active' : ''}>
            Users
          </li>
        </ul>
      )}
      {UserRole !== 'admin' && showSettingsSubmenu && (
        <ul className="subMenu">
          <li onClick={() => { handleSectionClick('settings'); }}
              className={activeSection === 'settings' ? 'active' : ''}>
            Settings
          </li>
        </ul>
      )}
        </li>
      </ul>
      <Modal open={showImportModal} onClose={closeImportModal}>
        <div className="import-modal">
          <h2>Import File</h2>
          <p>Upload a file to import data into the system.</p>
          <a href="/import_Sample.csv" download className="download-sample">
            Download Sample File
          </a>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <div className="file-upload-section">
            <Button
              variant="contained"
              color="primary"
              className='selectFile_btn'
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              Select File
            </Button>
            {selectedFile && <span className="file-name">{selectedFile.name}</span>}
          </div>
          <div className="actions">
          <Button
              variant="contained"
              color="success"
              onClick={handleUpload}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="outlined" color="error" onClick={closeImportModal}>
              Cancel
            </Button>
          </div>
          {loading && (
            <div style={{ marginTop: '10px' }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <p style={{ textAlign: 'center', marginTop: '5px' }}>{uploadProgress}%</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;