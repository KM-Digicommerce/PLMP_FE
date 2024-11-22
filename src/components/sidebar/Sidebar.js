import React, { useState, useRef } from 'react';
import './Sidebar.css';
import ApiResponseModal from '../../ApiResponseModal';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faUser, faFileImport, faFileExport, faCog, faHistory } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import DashboardIcon from '@mui/icons-material/Dashboard';
import axiosInstance from '../../../src/utils/axiosConfig';

const Sidebar = ({
  setSelectedLevel3Id,
  refreshCategories,
  onCategoriesClick,
  onAllProductsClick,
  OnAllVariantsClick,
  OnAddProductClick,
  onDashboardClick,
  onHistoryClick
}) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [selectedFilepath, setSelectedFilepath] = useState(null);

  const showUploadErrorSwal = (message) => {
    Swal.fire({
      title: 'Upload Failed',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        container: 'swal-custom-container',
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      }
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);

      setShowImportOptions(true);
    }
  };
  const handleImportClick = () => {
    setShowImportModal(true);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setSelectedFile(null);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    setShowImportModal(false);
    setSelectedFile(null);
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK', customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm-side',
          cancelButton: 'swal-custom-cancel',
        },
      });
      return;
    }

    setShowImportOptions(false);
    // setLoading(true);

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
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
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
  const [data, setData] = useState([]);
  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/exportAll/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire({
        title: 'Success!',
        text: 'File exported successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel'
        }
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Swal.fire({
        title: 'Export Failed',
        text: 'An error occurred while exporting the data.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  const toggleProductsSubmenu = () => {
    setShowProductsSubmenu(!showProductsSubmenu);
  };

  return (
    <div className="sidebar">
      <ul className="topMenu">
        <li onClick={onDashboardClick}><DashboardIcon />Dashboard</li>
        <li onClick={onCategoriesClick}>
          <FontAwesomeIcon icon={faTags} className="icon" />
          Categories
        </li>
        <li onClick={toggleProductsSubmenu} className="productsMenu">
          <FontAwesomeIcon icon={faBox} className="icon" />
          Products
          {showProductsSubmenu && (
            <ul className="subMenu">
              <li onClick={onAllProductsClick}>All Products</li>
              <li onClick={OnAddProductClick}>Add New Product</li>
            </ul>
          )}
        </li>
        <li onClick={OnAllVariantsClick}>
          <FontAwesomeIcon icon={faUser} className="icon" />
          Variants
        </li>
        {/* <li
  onMouseEnter={() => setShowImportOptions(true)}
  onMouseLeave={() => {
    if (!selectedFile) setShowImportOptions(false);
  }}
>
  <FontAwesomeIcon icon={faFileImport} className="icon" />
  Import
  {showImportOptions && (
    <div className="upload-container">
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
      <IconButton onClick={triggerFileInput} color="primary" aria-label="upload file">
        <UploadIcon />
      </IconButton>
      {selectedFile && <span className="file-name">{selectedFile.name}</span>}
      <button onClick={handleUpload} disabled={loading} className='upload_btn'>
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  )}
</li> */}
        <li onClick={handleImportClick}>
          <FontAwesomeIcon icon={faFileImport} className="icon" /> Import
        </li>
        <ApiResponseModal
          showResponseModal={showResponseModal}
          setShowResponseModal={setShowResponseModal}
          apiResponse={apiResponse}
          selectedFilepath={selectedFilepath}
        />
        <li onClick={handleExport}>
          <FontAwesomeIcon icon={faFileExport} className="icon" />
          Export
        </li>
        <li onClick={onHistoryClick}>  
          <FontAwesomeIcon icon={faHistory} className="icon" />
          History
        </li>

        <li>
          <FontAwesomeIcon icon={faCog} className="icon" />
          Settings
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
            <Button variant="contained" color="success" onClick={handleUpload} disabled={loading}>
              Upload
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
