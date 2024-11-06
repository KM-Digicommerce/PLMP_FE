// src/components/AddLevelFour.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css';
import Swal from 'sweetalert2';

const AddLevelFour = ({ selectedCategoryIdPopup, selectedSectionIdPopup, selectedProductTypeIdPopup, categories, refreshCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedSectionId, setSelectedSectionId] = useState(selectedSectionIdPopup || '');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(selectedProductTypeIdPopup || '');
  const [levelFourName, setLevelFourName] = useState('');

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSectionId('');
    setSelectedProductTypeId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_IP}/createCategory3/`, {
        name: levelFourName,
        category_id: selectedProductTypeId,
      });

      setLevelFourName('');
      setSelectedCategoryId('');
      setSelectedSectionId('');
      setSelectedProductTypeId('');

      await refreshCategories();
      Swal.fire('Success', 'Level 4 category added successfully!', 'success').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error adding level 4 category:', error);
      alert('Error adding level 4 category. Please try again.');
    }
  };

  return (
    <div className="add-level-four">
      <p className="form-title">Add Level 4 Category</p>
      <form onSubmit={handleSubmit}>
        <select value={selectedCategoryId} onChange={handleCategoryChange} required>
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategoryId && (
          <select value={selectedSectionId} onChange={(e) => setSelectedSectionId(e.target.value)} required>
            <option value="">Select a Section</option>
            {categories
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
          </select>
        )}
        {selectedSectionId && (
          <select value={selectedProductTypeId} onChange={(e) => setSelectedProductTypeId(e.target.value)} required>
            <option value="">Select a Product Type</option>
            {categories
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.find((sec) => sec._id === selectedSectionId)
              ?.level_two_category_list.map((productType) => (
                <option key={productType._id} value={productType._id}>
                  {productType.name}
                </option>
              ))}
          </select>
        )}
        <input
          type="text"
          value={levelFourName}
          onChange={(e) => setLevelFourName(e.target.value)}
          placeholder="Enter Level 4 name"
          required
        />
        <button type="submit">Add New Level 4</button>
      </form>
    </div>
  );
};

export default AddLevelFour;
