// src/components/ AddLevelTwo.js
import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosConfig';

const  AddLevelTwo = ({ selectedCategoryIdPopup, categories, refreshCategories,onCloseDialog }) => {
  const [sectionName, setSectionName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');

  // console.log(selectedCategoryIdPopup,'selectedCategoryIdPopup');
  // console.log(categories,'categories');
  // console.log(refreshCategories,'refreshCategories');

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory1/`, {
        name: sectionName,
        category_id: selectedCategoryId,
      });

      setSectionName('');
      setSelectedCategoryId('');
      
      // Refresh categories after adding a section
      await refreshCategories(); 
      Swal.fire('Success', 'Section added successfully!', 'success').then(() => {
        window.location.reload(); // Refresh the page to show updated data
    })
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Error adding section. Please try again.');
    }
    onCloseDialog();
  };

  return (
    <div className="add-section">
      <p className="form-title">Add New Category</p>
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
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default  AddLevelTwo;
