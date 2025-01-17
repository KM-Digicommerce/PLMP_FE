import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './BrandList.css';
import { useNavigate } from 'react-router-dom';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [brandCount, setBrandCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLetter, setFilterLetter] = useState(''); // State for letter filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 15; // Number of items per page
  const navigate = useNavigate();
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrandCounts(response.data.data.brand_count || []);
      const brandList = response.data.data.brand_list || [];
      setBrands(brandList);
    } catch (error) {
      console.error('Error fetching Vendors:', error);
      Swal.fire({  title: 'Error',  text: 'Failed to fetch vendors.',  icon: 'error',  confirmButtonText: 'OK',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  const filteredBrands = filterLetter
  ? brands.filter((brand) => brand.name[0].toUpperCase() === filterLetter.toUpperCase())
  : brands;
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const handleAddBrand = async () => {
    const { value: formValues } = await Swal.fire({
      html: ` <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
  <button 
    id="close-popup-btn" 
    style="position: absolute; top: -20px; right: -71px; background: transparent; border: none; font-size: 26px; font-weight: bold; cursor: pointer; color: #555;">
    &times;
  </button>
  <h2 style="margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333;">Add New Vendor</h2>
</div>
<div>
 <label for="vendor-name" style="font-size: 16px;float:left;font-family: sans-serif;">Vendor Name <span style="color: red; font-size: 16px;">*</span></label>
<input id="vendor-name" class="swal2-input vendor_input" autocomplete="off" placeholder="Vendor Name" style="margin-bottom: 10px; font-size: 16px;" required>
    <input id="vendor-email" type="email" class="swal2-input vendor_input" autocomplete="off" placeholder="Vendor Email Id" style="margin-bottom: 10px;font-size: 16px;">
  <input id="contact-info" class="swal2-input vendor_input" autocomplete="off" placeholder="Contact Information" style="margin-bottom: 10px;font-size: 16px;">
  <textarea id="vendor-address" class="swal2-input vendor_input" autocomplete="off" placeholder="Vendor Address" style="margin-bottom: 10px; width: 96%; height: 80px; padding:6px 6px 6px 12px; font-size:16px;font-family: sans-serif;"></textarea>
  <input id="vendor-website" type="url" class="swal2-input vendor_input" autocomplete="off" placeholder="Vendor Website" style="margin-bottom: 10px;font-size: 16px;">
    <label for="vendor-logo" style="display: inline-block; margin-top: 10px; font-size: 14px; font-weight: bold; color: #555;">Vendor Logo:</label>
  <input id="vendor-logo" type="file" accept="image/*" class="swal2-file-input" style="margin-top: 10px;">
</div>
    `,
      showCancelButton: true,
      focusConfirm: false,
      didOpen: () => {
        // Add close functionality to the button after the popup renders
        const closeButton = document.getElementById('close-popup-btn');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            Swal.close();
          });
        }
      },
      preConfirm: () => {
        const vendorName = document.getElementById('vendor-name').value;
        const vendorEmail = document.getElementById('vendor-email').value;
        const vendorAddress = document.getElementById('vendor-address').value;
        const vendorWebsite = document.getElementById('vendor-website').value;
        const vendorContact = document.getElementById('contact-info').value;
        const vendorLogo = document.getElementById('vendor-logo').files[0];
        if (!vendorName) {
          Swal.showValidationMessage('Please enter a vendor name');
        }
        return { vendorName, vendorEmail,vendorAddress,vendorWebsite,vendorContact, vendorLogo };
      },
      customClass: { container: 'swal-custom-container swal-overflow', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-brand', cancelButton: 'swal-custom-cancel-brand',
      },
    });
  
    if (formValues) {
      const { vendorName, vendorLogo, vendorEmail, vendorAddress, vendorWebsite, vendorContact } = formValues;
      const formData = new FormData();
      formData.append('name', vendorName);
      if (vendorLogo) {  formData.append('logo', vendorLogo); }
      if (vendorEmail) {  formData.append('email', vendorEmail); }
      if (vendorAddress) {  formData.append('address', vendorAddress); }
      if (vendorWebsite) {  formData.append('website', vendorWebsite); }
      if (vendorContact) {  formData.append('mobile_number', vendorContact); }
      try {
        const response = await axiosInstance.post(
          `${process.env.REACT_APP_IP}/createBrand/`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
  
        if (response.data.data.is_created === true) {
          Swal.fire({  title: 'Success!',  text: 'Vendor added successfully!',  icon: 'success',  confirmButtonText: 'OK',
            customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
            },
          });
        } else if (response.data.data.is_created === false) {
          Swal.fire({  title: 'Error!',  text: response.data.data.error,  icon: 'error',  confirmButtonText: 'OK',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
            },
          });
        }
        fetchBrands(); // Refresh brand list
      } catch (error) {
        console.error('Error adding Vendor:', error);
        Swal.fire({  title: 'Error',  text: 'Failed to add Vendor.',  icon: 'error',  confirmButtonText: 'OK',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
          },
        });
      }
    }
  };   
  useEffect(() => {
    fetchBrands();
  }, []);
  const handleBrandClick = (brandId) => {
    navigate(`/Admin/vendorsummary/${brandId}`); // Navigate to the vendor summary page
  };
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentBrands = filteredBrands.slice(startIndex, startIndex + itemsPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  if (!brands) {
    return (
      <div className="superAdmin-error-message">
        <p>Error loading Vendor data. Please try again later.</p>
      </div>
    );
  }
  return (
    <div className="brand-page">
      <div className="brand-header">
        <div className="brand-header-info">
          <h1 className="brand-title">Vendor Management</h1>
          <div className="brand-count-container">
            <span className="total-brands-text">Total Vendors:</span>
            <span className="brand-count">{brandCount}</span>
          </div>
        </div>
        <div style={{display:'inline-block',width:'50%',textAlign:'end'}}>
        <div className="alphabetical-dropdown">
        <label htmlFor="alphabetical-filter" style={{display:'inline-block', padding:'0px 8px 0px 0px'}} className="dropdown-label-vendor">  Filter by  </label>
        <select
    id="alphabetical-filter"
    className="dropdown-select"
    style={{cursor:'pointer'}}
    value={filterLetter}
    onChange={(e) => {
      const selectedLetter = e.target.value;
      // Allow selection of "All" or highlighted letters
      if ( selectedLetter === "" ||  brands.some(  (brand) => brand.name[0].toUpperCase() === selectedLetter )  ) {  setFilterLetter(selectedLetter);  }
    }} >
    <option value="">All</option>
    {allLetters.map((letter) => {
      // Check if the letter exists in the first letters of brands
      const isPresent = brands.some((brand) => brand.name[0].toUpperCase() === letter);
      return (
        <option  key={letter}  value={letter}  style={{ fontWeight: filterLetter === letter ? 'bold' : 'normal', color: isPresent ? 'black' : 'lightgray',  }}
          disabled={!isPresent} >  {letter}   </option> );
    })}
  </select>
      </div>
        <button className="add-brand-btn" onClick={handleAddBrand}>  Add Vendor  </button>
        </div>
      </div>
      {loading ? (
        <p>Loading Vendors...</p>
      ) : (
        <>
        <div className="brand-cards-container">
          {currentBrands.map((brand) => (
            <div key={brand.id} className="brand-card" onClick={() => handleBrandClick(brand.id)}>
              <div className="brand-logo">
                <img  src={ brand.logo || 'https://img.freepik.com/free-vector/creative-furniture-store-logo_23-2148455884.jpg?semt=ais_hybrid'  } alt={`${brand.name} Logo`} className="brand-logo-image"  />
              </div>
              <h3 className="brand-name">{brand.name}</h3>
              <p className="brand-id">ID: {brand.brand_number}</p>
            </div>
          ))}
        </div>
        <div className="pagination-container">
        {totalPages > 1 && currentPage > 1 && (
  <button className="pagination-button prev-button" onClick={() => handlePageChange(currentPage - 1)}> &laquo; Prev </button> )}
{totalPages > 1 && (
  Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(Math.max(0, currentPage - 3), currentPage + 2)  // Adjust range of pages to display
    .map((page) => (   // Don't show page "1" if the totalPages is 1
      (totalPages > 1 || page > 1) && (
        <button  key={page}  className={`pagination-button ${page === currentPage ? 'active' : ''}`}  onClick={() => handlePageChange(page)} >    {page}  </button>  )
    ))
)}
{totalPages > 1 && currentPage < totalPages && (
  <button className="pagination-button next-button" onClick={() => handlePageChange(currentPage + 1)} >
    Next &raquo; </button>)}
</div>   </>
      )}
    </div>
  );
};
export default BrandList;