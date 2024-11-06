// src/components/ AddLevelThree.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css';
import Swal from 'sweetalert2';

const  AddLevelThree = ({ selectedCategoryIdPopup, selectedSectionIdPopup, categories, refreshCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedSectionId, setSelectedSectionId] = useState(selectedSectionIdPopup || '');
  const [productTypeName, setProductTypeName] = useState('');

  console.log(selectedSectionId,'selectedSectionId 1');
  console.log(categories,'categories 2');
  console.log(refreshCategories,'refreshCategories 3');
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSectionId(''); // Reset section selection when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_IP}/createCategory2/`, {
        name: productTypeName,
        category_id: selectedSectionId,
      });
      setProductTypeName('');
      setSelectedCategoryId('');
      setSelectedSectionId('');

      await refreshCategories(); 
      Swal.fire('Success', 'Product type added successfully!', 'success').then(() => {
        window.location.reload(); // Refresh the page to show updated data
    })
    } catch (error) {
      console.error('Error adding product type:', error);
      alert('Error adding product type. Please try again.');
    }
  };

  return (
    <div className="add-product-type">
      <p className="form-title">Add New Category</p>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCategoryId} 
          onChange={handleCategoryChange} 
          required
        >
          <option value="">Select Level 1 Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategoryId && (
          <select 
            value={selectedSectionId} 
            onChange={(e) => setSelectedSectionId(e.target.value)} 
            required
          >
            <option value="">Select Level 2 Category</option>
            {categories
              .find((level2) => level2._id === selectedCategoryId)
              ?.level_one_category_list.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
          </select>
        )}
        <input
          type="text"
          value={productTypeName}
          onChange={(e) => setProductTypeName(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default  AddLevelThree;
