// src/components/AddCategory.js

import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosConfig';

const AddCategory = ({ refreshCategories,onCloseDialog }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory/`, {
        name: categoryName,
      });

      // Clear input field
      setCategoryName('');

      // Call the refresh function to update the category list
      await refreshCategories(); // Ensure it's awaited for proper sequencing
      Swal.fire({ title: 'Success', text: 'Category added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel',
        },
    }).then(() => { });    
      // Log the updated categories to verify the addition
      console.log('Updated Categories after addition:');
      const updatedCategories = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
      console.log(updatedCategories.data.data);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
    onCloseDialog();
  };

  return (
    <div className="add-category">
      <p className="form-title">Add New Category</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default AddCategory;
