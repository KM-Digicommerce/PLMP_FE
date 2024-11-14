import React, { useState, useRef } from 'react';
import './Sidebar.css';
import Swal from 'sweetalert2';
import UploadIcon from '@mui/icons-material/Upload';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTags, faUser, faFileImport, faFileExport, faCog } from '@fortawesome/free-solid-svg-icons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import axiosInstance from '../../../src/utils/axiosConfig';

const Sidebar = ({ 
  setSelectedLevel3Id, 
  refreshCategories, 
  onCategoriesClick, 
  onAllProductsClick, 
  OnAllVariantsClick, 
  OnAddProductClick,
  onDashboardClick 
}) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const showUploadErrorSwal = (message) => {
    Swal.fire({
      title: 'Upload Failed',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowImportOptions(true);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
      });
      return;
    }

    setShowImportOptions(false);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/upload_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.data.status === false) {
        showUploadErrorSwal(response.data.message || 'Failed to upload the file.');
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
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
         <li
  onMouseEnter={() => setShowImportOptions(true)}
  onMouseLeave={() => {
    if (!selectedFile) setShowImportOptions(false);
  }}
>
  <FontAwesomeIcon icon={faFileImport} className="icon" />
  Import
  {showImportOptions && (
    <div className="upload-container">
      {/* Download link for the sample file */}
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
</li>

      <li onClick={handleExport}>
        <FontAwesomeIcon icon={faFileExport} className="icon" />
        Export
      </li>
      <li>
        <FontAwesomeIcon icon={faCog} className="icon" />
        Settings
      </li>
    </ul>
  </div>
  );
};

export default Sidebar;
