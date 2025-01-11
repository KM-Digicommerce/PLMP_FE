import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
import './VendorSummary.css';

const VendorSummary = () => {
  const { brandId } = useParams(); // To get the vendor id from URL
  const [vendor, setVendor] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [updatedVendor, setUpdatedVendor] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/?id=${brandId}`);
        console.log(response.data.data.brand_list,'response'); 
        setVendor(response.data.data.brand_list[0]);
        setUpdatedVendor(response.data.data.brand_list[0]);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedVendor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdate = async () => {
    const updateData = { update_obj: updatedVendor };
    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/brandUpdate/`, updateData);
      Swal.fire({  title: 'Success',  text: 'Vendor details updated successfully.',  icon: 'success',  confirmButtonText: 'OK',  customClass: {  container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel',  }
      });
      setIsEditing(false);
      setVendor(updatedVendor); // Update vendor with the latest data
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to update vendor details.', icon: 'error', confirmButtonText: 'OK',
        customClass: {  container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel',  }
      });
    }
  };
  const handleClick = (brandId) => {
    localStorage.setItem('brandId', brandId);
    navigate('/Admin/allproducts');
  };
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
      <button  className="go-to-products-btn"
 onClick={() =>{ handleClick(brandId); }}>
      Go to Products
    </button>
    </div>
    <div className="vendor-card">
        <div className="vendor-card-header">
          <h2 style={{display:'inline-block'}}>Vendor Summary</h2> {/* Heading for vendor summary */}
          <button 
            className="edit-btn" style={{float:'right', width:'15%'}}
            onClick={() => setIsEditing(!isEditing)} // Toggle edit mode
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="vendor-card-body">
          {isEditing ? (
            <div className="vendor-edit-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name" style={{width:'94%'}}
                  value={updatedVendor.name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email" style={{width:'94%'}}
                  value={updatedVendor.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="mobile_number">Contact</label>
                <input
                  type="text"
                  id="mobile_number"
                  name="mobile_number" style={{width:'94%'}}
                  value={updatedVendor.mobile_number || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address" style={{width:'94%'}}
                  value={updatedVendor.address || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website" style={{width:'94%'}}
                  value={updatedVendor.website || ''}
                  onChange={handleInputChange}
                />
              </div>
              <button
                className="update-btn"
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          ) : (
            <>
              <p><strong>Id:</strong> {vendor.brand_number}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Contact:</strong> {vendor.mobile_number}</p>
              <p><strong>Address:</strong> {vendor.address}</p>
              <p><strong>Website:</strong> {vendor.website || '-'}</p>
              <p><strong>Product Count: </strong>{vendor.product_count || '0'}</p>
            </>
          )}
        </div>
      </div>
  </div>
);
};

export default VendorSummary;
