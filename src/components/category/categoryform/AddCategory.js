// src/components/AddCategory.js

import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosConfig';

const AddCategory = ({ refreshCategories, onCloseDialog, setIsTyping }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleInputChange = (e) => {
    setCategoryName(e.target.value);
    setIsTyping(e.target.value.trim().length > 0);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory/`, {
        name: categoryName,
      });
      setCategoryName('');
      setIsTyping(false);
      if (response.data.data.is_created === true) {
        await refreshCategories();
        Swal.fire({
          title: 'Success', text: 'Category added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
          },
        }).then(() => { });
        const updatedCategories = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
        onCloseDialog();
      }
      else if (response.data.data.is_created === false) {
        console.log('Npe', response.data.data.error);
        Swal.fire({
          title: response.data.data.error,
          icon: "warning",
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
          },
        })
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }  };

  return (
    <div className="add-category">
      <p className="form-title">Add New Category</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={handleInputChange}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
