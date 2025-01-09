import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './VendorSummary.css';

const VendorSummary = () => {
  const { brandId } = useParams(); // To get the vendor id from URL
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/?id=${brandId}`);
        console.log(response.data.data.brand_list,'response'); 
        setVendor(response.data.data.brand_list[0]);
        console.log(brandId,'brandId');
      } catch (error) {
        Swal.fire({
          title: 'Error',
          text: 'Failed to fetch vendor details.',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',},
        });
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [brandId]);

  if (loading) {
    return <p>Loading Vendor Details...</p>;
  }

  return (
    <div className="vendor-summary">
    <div className="vendor-header">
      <button
        className="back-to-vendor-btn"
        onClick={() => navigate('/Admin/vendor')}
      > Back to Vendor
      </button>
      <button
        className="go-to-products-btn"
        style={{display:'none'}}
        onClick={() => navigate(`/Admin/products/${brandId}`)}
      >  Go to Products
      </button>
    </div>
    <div className="vendor-card">
      <div className="vendor-card-header">
        <h2>{vendor.brand_number}</h2>
        <h3>{vendor.name}</h3>
      </div>

      <div className="vendor-card-body">
        {vendor.email && <p><strong>Email:</strong> {vendor.email}</p>}
        {vendor.mobile_number && <p><strong>Contact:</strong> {vendor.mobile_number}</p>}
        {vendor.address && <p><strong>Address:</strong> {vendor.address}</p>}
        {vendor.website && <p><strong>Website:</strong> {vendor.website}</p>}
        {vendor.product_count && <p><strong>Product Count:</strong> {vendor.product_count}</p>}
      </div>
    </div>
  </div>
);
};

export default VendorSummary;
