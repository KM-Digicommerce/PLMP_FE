import React, { useState, useRef } from 'react';
import './Sidebar.css';
import ApiResponseModal from '../../../ApiResponseModal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faUser, faFileImport, faFileExport, faCog, faHistory, faStore, faColumns  } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import { useNavigate,useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import axiosInstance from '../../../../src/utils/axiosConfig';
import CircularProgress from '@mui/material/CircularProgress';

const Sidebar = ({  onCategoriesClick, onAllProductsClick, OnAllVariantsClick, OnAddProductClick, onDashboardClick, onHistoryClick,onBrandClick, OnExportClick, OnImportClick}) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
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
    // navigate('/HomePage'); 
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    setShowImportModal(false);
    setSelectedFile(null);
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-side', cancelButton: 'swal-custom-cancel',
        },
      });
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/upload_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSelectedFilepath(response.data.data.file_path);
      if (response.data && response.data.data.status === false) {
        setApiResponse(response.data.data);
        setShowResponseModal(true);
        // showUploadErrorSwal(response.data.message || 'Failed to upload the file.');
      } else {
        Swal.fire({ title: 'Success!', text: 'File uploaded successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
          }
        });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showUploadErrorSwal('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleProductsSubmenu = () => {
    setShowProductsSubmenu(!showProductsSubmenu);
  };
  const handleSectionClick = (section) => {
    setActiveSection(section);
    if (section === 'brand' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/brand'); 
    }
    else if (section === 'export' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/export'); 
    }
    else if (section === 'import' && ((location.pathname.includes("product/")) || (location.pathname.includes("/Admin")) ) ) {
      navigate('/Admin/import'); 
    }
  };
  return (
    <div className="sidebar">
      <ul className="topMenu">
        <li onClick={() => { onDashboardClick(); handleSectionClick('dashboard'); }}
          className={activeSection === 'dashboard' ? 'active' : ''}><FontAwesomeIcon icon={faColumns} className="icon" /> Dashboard</li>
        <li onClick={() => { onCategoriesClick(); handleSectionClick('categories'); }}
          className={activeSection === 'categories' ? 'active' : ''}>
          <FontAwesomeIcon icon={faTags} className="icon" />
          Categories
        </li>
        <li onClick={() => { onBrandClick(); handleSectionClick('brand'); }}
          className={activeSection === 'brand' ? 'active' : ''}>
          <FontAwesomeIcon icon={faStore} className="icon" />
          Brand
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
        <li onClick={() => { OnImportClick();handleImportClick(); handleSectionClick('import'); }}
          className={activeSection === 'import' ? 'active' : ''}>
          <FontAwesomeIcon icon={faFileImport} className="icon" /> Import
        </li>
        {loading ? (
        // <div className="loading-spinner-container">
        //   <CircularProgress size={50} />
        //   <span>Loading...</span>
        // </div>
        <div className="loading-spinner-container-sidebar">
        <div className="loading-spinner"></div>
      </div>
      ) : (
        showResponseModal && (
          <ApiResponseModal
            showResponseModal={showResponseModal}
            setShowResponseModal={setShowResponseModal}
            apiResponse={apiResponse}
            selectedFilepath={selectedFile ? selectedFile.name : ""}
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
          History
        </li>

        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          Settings
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} className="icon" />
          User's
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
              // disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? 'Uploading...' : 'Upload'}
            </Button>
            <Button variant="outlined" color="error" onClick={closeImportModal}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;