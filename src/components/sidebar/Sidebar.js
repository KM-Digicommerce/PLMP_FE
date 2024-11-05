import React, { useState, useRef } from 'react';
import './Sidebar.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import UploadIcon from '@mui/icons-material/Upload';
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons'; 

const Sidebar = ({ setSelectedProductTypeId, refreshCategories, onCategoriesClick, onAllProductsClick, OnAllVariantsClick,OnAddProductClick }) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false); 
  const [selectedFile, setSelectedFile] = useState(null);

  // Create a reference for the file input
  const fileInputRef = useRef(null);

  // Function to show error message
  const showUploadErrorSwal = (message) => {
    Swal.fire({
      title: 'Upload Failed',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowImportOptions(true); // Keep the import options open after selecting a file
    }
  };

  // Trigger file input click using useRef
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Toggle the Products submenu
  const handleProductsClick = () => {
    setShowProductsSubmenu(!showProductsSubmenu);
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      Swal.fire({
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    // Close hover immediately after clicking upload
    setShowImportOptions(false);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_IP}/upload_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
      
      if (response.data && response.data.data.status === false) {
        showUploadErrorSwal(response.data.message || 'Failed to upload the file.');
      } else {
        Swal.fire({
          title: 'Success!',
          text: 'File uploaded successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        setSelectedFile(null); 
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      showUploadErrorSwal('An error occurred while uploading the file.');
    }
  };
  const [data, setData] = useState([]); // Ensure you have data in state
    const handleExport = () => {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = `${process.env.REACT_APP_IP}/exportAll/`;
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.product_name || 'product'}_details.json`; // Ensure `data` has `product_name`
        a.click();
        window.URL.revokeObjectURL(url); // Clean up the URL object
    };
  return (
    <div className="sidebar">
      <ul className="topMenu">
        <li onClick={onCategoriesClick}>Categories</li>
        <li onClick={handleProductsClick}>
          Products
          {showProductsSubmenu && (
            <ul className="subMenu">
              <li onClick={onAllProductsClick}>All Products</li>
              <li onClick={OnAddProductClick}>Add New Product</li>
            </ul>
          )}
        </li>
        <li onClick={OnAllVariantsClick}>Variants</li>
        
        <li 
          onMouseEnter={() => setShowImportOptions(true)} // Open on hover
          onMouseLeave={() => {
            if (!selectedFile) setShowImportOptions(false); // Close on leave if no file selected
          }}
        >
          Import
          {showImportOptions && (
            <div className="upload-container" onMouseEnter={() => setShowImportOptions(true)}>
              <input
                type="file"
                id="file-input"
                style={{ display: 'none' }}
                ref={fileInputRef}  // Use the ref instead of document.getElementById
                onChange={handleFileChange}
              />
              <IconButton onClick={triggerFileInput} color="primary" aria-label="upload file">
                <UploadIcon />
              </IconButton>
              {selectedFile && (
                <span className="file-name">{selectedFile.name}</span>
              )}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevent the hover from closing on button click
                  handleUpload(); 
                }}
              >
                Upload
              </button>
            </div>
          )}
        </li>
        
        <li className="top-menu export-button btn" onClick={handleExport} > Export <FontAwesomeIcon icon={faDownload} /> </li>
        <li>Settings</li>
      </ul>

      {/* Add a separate "Reupload" button outside the Swal dialog */}
     
    </div>
  );
};

export default Sidebar;
