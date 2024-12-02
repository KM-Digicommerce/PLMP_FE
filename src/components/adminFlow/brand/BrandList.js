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
        });
        fetchBrands(); // Refresh brand list
      } catch (error) {
        console.error('Error adding brand:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to add brand.',
          icon: 'error',
          confirmButtonText: 'OK',
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
        <table className="brand-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Brand Name</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id}>
                <td>{brand.id}</td>
                <td>{brand.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BrandList;
