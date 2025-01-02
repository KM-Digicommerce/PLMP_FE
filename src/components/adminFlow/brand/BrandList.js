import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './BrandList.css';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [brandCount, setBrandCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLetter, setFilterLetter] = useState(''); // State for letter filter
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const itemsPerPage = 15; // Number of items per page
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrandCounts(response.data.data.brand_count || []);
      const brandList = response.data.data.brand_list || [];
      setBrands(brandList);
    } catch (error) {
      console.error('Error fetching Vendors:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch vendors.',
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
  const filteredBrands = filterLetter
  ? brands.filter((brand) => brand.name[0].toUpperCase() === filterLetter.toUpperCase())
  : brands;
  const allLetters = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const handleAddBrand = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Vendor',
      html: `
        <input id="vendor-name" class="swal2-input vendor_input" placeholder="Enter Vendor Name">
    <label for="vendor-logo" style="display: inline-block; margin-top: 10px; font-size: 14px; font-weight:bold; color: #555;">Vendor Logo:</label>
    <input id="vendor-logo" type="file" accept="image/*" class="swal2-file-input" style="margin-top: 10px;">
  `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const vendorName = document.getElementById('vendor-name').value;
        const vendorLogo = document.getElementById('vendor-logo').files[0];
        if (!vendorName) {
          Swal.showValidationMessage('Please enter a vendor name');
        }
        return { vendorName, vendorLogo };
      },
      customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-brand', cancelButton: 'swal-custom-cancel-brand',
      },
    });
  
    if (formValues) {
      const { vendorName, vendorLogo } = formValues;
      const formData = new FormData();
      formData.append('name', vendorName);
      if (vendorLogo) {
        formData.append('logo', vendorLogo);
      }
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
          Swal.fire({
            title: 'Success!',
            text: 'Vendor added successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              container: 'swal-custom-container',
              popup: 'swal-custom-popup',
              title: 'swal-custom-title',
              confirmButton: 'swal-custom-confirm',
              cancelButton: 'swal-custom-cancel',
            },
          });
        } else if (response.data.data.is_created === false) {
          Swal.fire({
            title: 'Error!',
            text: response.data.data.error,
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
        }
        fetchBrands(); // Refresh brand list
      } catch (error) {
        console.error('Error adding Vendor:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to add Vendor.',
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
      }
    }
  };  
  useEffect(() => {
    fetchBrands();
  }, []);
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
    value={filterLetter}
    onChange={(e) => {
      const selectedLetter = e.target.value;
      // Allow selection of "All" or highlighted letters
      if (
        selectedLetter === "" ||
        brands.some(
          (brand) => brand.name[0].toUpperCase() === selectedLetter
        )
      ) {
        setFilterLetter(selectedLetter);
      }
    }}
  >
    <option value="">All</option>
    {allLetters.map((letter) => {
      // Check if the letter exists in the first letters of brands
      const isPresent = brands.some((brand) => brand.name[0].toUpperCase() === letter);
      return (
        <option
          key={letter}
          value={letter}
          style={{
            fontWeight: filterLetter === letter ? 'bold' : 'normal',
            color: isPresent ? 'black' : 'lightgray',
          }}
          disabled={!isPresent} // Disable letters not in the brands
        >
          {letter}
        </option>
      );
    })}
  </select>

      </div>
        <button className="add-brand-btn" onClick={handleAddBrand}>
            Add Vendor
          </button>
        </div>
      </div>
      {loading ? (
        <p>Loading Vendors...</p>
      ) : (
        <>
        <div className="brand-cards-container">
          {currentBrands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo">
                <img
                  src={
                    brand.logo ||
                    'https://img.freepik.com/free-vector/creative-furniture-store-logo_23-2148455884.jpg?semt=ais_hybrid'
                  }
                  alt={`${brand.name} Logo`}
                  className="brand-logo-image"
                />
              </div>
              <h3 className="brand-name">{brand.name}</h3>
              <p className="brand-id">ID: {brand.brand_number}</p>
            </div>
          ))}
        </div>
        <div className="pagination-container">
  {currentPage > 1 && (
    <button
      className="pagination-button prev-button"
      onClick={() => handlePageChange(currentPage - 1)}
    >
      &laquo; Prev
    </button>
  )}
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .slice(Math.max(0, currentPage - 3), currentPage + 2)
    .map((page) => (
      <button
        key={page}
        className={`pagination-button ${page === currentPage ? 'active' : ''}`}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    ))}
  {currentPage < totalPages && (
    <button
      className="pagination-button next-button"
      onClick={() => handlePageChange(currentPage + 1)}
    >
      Next &raquo;
    </button>
  )}
</div>

      </>
      )}
    </div>
  );
};

export default BrandList;
