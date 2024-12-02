import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
      console.log('Response',response.data.data.brand_list);
      
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
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/createBrand/`, {
          name: brandName,
        });
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

  return (
    <div className="brand-page">
      <h1>Brand Management</h1>
      <button className="add-brand-btn" onClick={handleAddBrand}>
        Add Brand
      </button>
      {loading ? (
        <p>Loading brands...</p>
      ) : (
        <ul>
          {brands.map((brand) => (
            <li key={brand.id}>{brand.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BrandList;
