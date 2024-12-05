import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './BrandList.css';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
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

  const handleAddBrand = async () => {
    const { value: brandName } = await Swal.fire({
      title: 'Add New Brand',
      input: 'text',
      inputLabel: 'Brand Name',
      inputPlaceholder: 'Enter the brand name',
      showCancelButton: true,
    });

    if (brandName) {
      try {
        await axiosInstance.post(`${process.env.REACT_APP_IP}/createBrand/`, { name: brandName });
        Swal.fire({
          title: 'Success!',
          text: 'Brand added successfully!',
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
        fetchBrands(); // Refresh brand list
      } catch (error) {
        console.error('Error adding brand:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to add brand.',
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
        <p>Error loading brand data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="brand-page">
      <div className="brand-header">
        <h1>Brand Management</h1>
        <button className="add-brand-btn" onClick={handleAddBrand}>
          Add Brand
        </button>
      </div>
      {loading ? (
        <p>Loading brands...</p>
      ) : (
        <div className="brand-cards-container">
          {brands.map((brand) => (
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
