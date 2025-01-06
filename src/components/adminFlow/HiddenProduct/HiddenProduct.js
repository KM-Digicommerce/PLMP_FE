import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import {faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from "sweetalert2";
import Soon from '../../../assets/image_2025_01_02T08_51_07_818Z.png';

const CreateUser = () => {
  const [users, setUsers] = useState([]); // State to store the list of users
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainInActiveProducts/`);
      console.log(response.data.data,'data  ');
      setLoading(false);
      setUsers(response.data.data.product_list || []); // Assuming the API returns an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers(); // Fetch users on initial load
  }, []);

  const handleVisibilityToggle = async (e, product) => {
    e.stopPropagation(); // Prevent click propagation if necessary
    // Toggle the visibility based on the current state of `is_active`
    const updatedVisibility = !product.is_active;
    // Update local state immediately
    setUsers(prevData =>
      prevData.map(item =>
        item.product_id === product.product_id
          ? { ...item, is_active: updatedVisibility }
          : item
      )
    );
    console.log(`Visibility toggled for product: ${product.product_name} to ${updatedVisibility ? 'Visible' : 'Invisible '}`);
    // Show confirmation dialog with SweetAlert
    Swal.fire({ title: "Are you sure?", text: `You have ${updatedVisibility ? 'enabled' : 'disabled'} changes. Are you sure you want to ${updatedVisibility ? 'enable' : 'disable'} the selected product?`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6", confirmButtonText: `Yes, ${updatedVisibility ? 'enable' : 'disable'} it`, cancelButtonText: "No, stay", customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
      }
    }).then((result) => {
      // If the user clicks "Yes", then call the API to update the product status
      if (result.isConfirmed) {
        const payload = { id: product.product_id, is_active: updatedVisibility };
        // Call the API to update product visibility in the backend
        axiosInstance.post(`${process.env.REACT_APP_IP}/UpdateProductActiveInActive/`, payload)
          .then((response) => {
            if (response.data && response.data.data && response.data.data.is_update) {
              // After successful update, optionally refetch data or update UI
              fetchUsers();
              Swal.fire({
                title: 'Success!',
                text: `The product has been ${updatedVisibility ? 'enabled' : 'disabled'}.`,
                icon: 'success',
                customClass: {
                  container: 'swal-custom-container',
                  popup: 'swal-custom-popup',
                  title: 'swal-custom-title',
                  confirmButton: 'swal-custom-confirm',
                  cancelButton: 'swal-custom-cancel'
                }
              });
            } else {
              alert("Unexpected response structure");
            }
          })
          .catch((err) => {
            setError(err.message);
            Swal.fire({
              title: 'Error',
              text: 'There was an issue updating the product status.',
              icon: 'error',
              customClass: {
                container: 'swal-custom-container',
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel'
              }
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If the user clicks "No, stay", revert the local state change
        setUsers(prevData =>
          prevData.map(item =>
            item.product_id === product.product_id
              ? { ...item, is_active: !updatedVisibility }
              : item
          )
        );
        Swal.fire({
          title: 'Cancelled',
          text: 'No changes were made.',
          icon: 'info',
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
          }
        });
      }
    });
  };
  return (
    <div style={{padding:'7px'}}>
        <h2 style={{margin:'0px 0px 20px 0px'}}>Inactive Products</h2>
        <div >       
             {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : users.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column" style={{width:'3%'}} >Image</th>
              <th className="mpn-column" style={{width:'8%'}} >MPN</th>
              <th className="product-column" style={{width: '35%'}} >Product Name</th>
              <th className="brand-column" style={{width:'10%'}} >Vendor </th>
              <th className="taxonomy-column" style={{width: '40%'}} >Taxonomy </th>
              <th className="others-column" style={{width: '5%'}}>Action</th></tr>
          </thead>
          <tbody>
            {users.map((item) => (
              <tr key={`product-${item.product_id}`} style={{cursor:'pointer'}} >
                <td className="checkbox-column">
                  {Array.isArray(item.image) ? (
                    <img src={item.image[0] || Soon } alt={item.product_name} className="product-image-round" />
                  ) : (
                    <img  src={item.image}  alt={item.product_name}  className="product-image-round"  />
                  )}
                </td>
                <td className="mpn-column" style={{width:'12%'}}>{item.mpn}</td>
                <td className="product-cell">
                  <span className="product-name">{item.product_name}</span>
                </td>
                <td className="mpn-column">{item.brand}</td>
                <td className="attributes-column">{item.category_name}</td>
                <td className="others-column">
                    <FontAwesomeIcon
                  icon={item.is_active ? faEye : faEyeSlash}
                  onClick={(e) => handleVisibilityToggle(e, item)}
                  style={{ cursor: 'pointer', fontSize: '16px' }}
                />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
        </div>
    </div>
  );
};
export default CreateUser;