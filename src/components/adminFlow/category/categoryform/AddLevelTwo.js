// src/components/ AddLevelTwo.js
import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../utils/axiosConfig';

const  AddLevelTwo = ({ selectedCategoryIdPopup, categories, refreshCategories, setIsTyping, onCloseDialog }) => {
  const [sectionName, setSectionName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const handleInputChange = (e) => {
    setSectionName(e.target.value);
    setIsTyping(e.target.value.trim().length > 0); 
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory1/`, {
        name: sectionName,
        category_id: selectedCategoryId,
      });

      setSectionName('');
      setSelectedCategoryId('');
      setIsTyping(false);
      // Refresh categories after adding a section
      await refreshCategories(); 
      Swal.fire({ title: 'Success', text: 'Category added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
        container: 'swal-custom-container',
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
    },
}).then(() => {    })
onCloseDialog();
    } catch (error) {
      console.error('Error adding level 2 Category:', error);
      alert('Error adding level 2 Category. Please try again.');
    }
  };

  return (
    <div className="add-section">
      <p className="form-title">Add Level 2 Category</p>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCategoryId} 
          onChange={(e) => setSelectedCategoryId(e.target.value)} 
          required
        >
          <option value="">Select a Category</option>
          {categories.category_list.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={sectionName}
          className='add_category_input'
          onChange={handleInputChange}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default  AddLevelTwo;
