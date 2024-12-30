import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './BrandList.css';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [brandCount, setBrandCounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLetter, setFilterLetter] = useState(''); // State for letter filter

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrandCounts(response.data.data.brand_count || []);
      const brandList = response.data.data.brand_list || [];
      const sortedBrands = brandList.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
      );
      setBrands(sortedBrands);
    } catch (error) {
      console.error('Error fetching brands:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch brands.',
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
  ? brands.filter((brand) => brand.name.startsWith(filterLetter))
  : brands;
  const handleAddBrand = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Add New Vendor',
      html: `
        <input id="vendor-name" class="swal2-input vendor_input" placeholder="Enter Vendor Name">
        <input id="vendor-logo" type="file" accept="image/*" class="swal2-file-input" style="margin-top: 10px;">
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const vendorName = document.getElementById('vendor-name').value;
        const vendorLogo = document.getElementById('vendor-logo').files[0];
        if (!vendorName || !vendorLogo) {
          Swal.showValidationMessage('Please enter a vendor name and select a logo');
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
      formData.append('logo', vendorLogo);
  
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
            <span className="total-brands-text">Total Brands:</span>
            <span className="brand-count">{brandCount}</span>
          </div>
        </div>
          <button className="add-brand-btn" onClick={handleAddBrand}>
            Add Vendor
          </button>
      </div>
      <div className="alphabetical-dropdown">
        <label htmlFor="alphabetical-filter" className="dropdown-label-vendor">
          Filter by Alphabet:
        </label>
        <select
          id="alphabetical-filter"
          className="dropdown-select"
          value={filterLetter}
          onChange={(e) => setFilterLetter(e.target.value)}
        >
          <option value="">All</option>
          {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
            <option key={letter} value={letter}>
              {letter}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <p>Loading Vendors...</p>
      ) : (
        <div className="brand-cards-container">
          {filteredBrands.map((brand) => (
            <div key={brand.id} className="brand-card">
              <div className="brand-logo">
                <img
                  src={brand.logo || 'https://img.freepik.com/free-vector/creative-furniture-store-logo_23-2148455884.jpg?semt=ais_hybrid'} // Fallback to default logo if not available
                  alt={`${brand.name} Logo`}
                  className="brand-logo-image"
                />
              </div>
              <h3 className="brand-name">{brand.name}</h3>
              <p className="brand-id">ID: {brand.brand_number}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrandList;
