// src/components/AddSection.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css'

const AddSection = ({ selectedCategoryIdPopup, categories, refreshCategories }) => {
  const [sectionName, setSectionName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');

  console.log(selectedCategoryIdPopup,'selectedCategoryIdPopup');
  console.log(categories,'categories');
  console.log(refreshCategories,'refreshCategories');

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_IP}/createSection/`, {
        name: sectionName,
        category_id: selectedCategoryId,
      });

      setSectionName('');
      setSelectedCategoryId('');
      
      // Refresh categories after adding a section
      await refreshCategories(); 
      alert('Section added successfully!');
    } catch (error) {
      console.error('Error adding section:', error);
      alert('Error adding section. Please try again.');
    }
  };

  return (
    <div className="add-section">
      <p className="form-title">Add New Section</p>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCategoryId} 
          onChange={(e) => setSelectedCategoryId(e.target.value)} 
          required
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Enter section name"
          required
        />
        <button type="submit">Add Section</button>
      </form>
    </div>
  );
};

export default AddSection;
