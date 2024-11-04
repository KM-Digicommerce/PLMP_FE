// src/components/AddLevelFive.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css';
import Swal from 'sweetalert2';

const AddLevelFive = ({ selectedCategoryIdPopup, selectedSectionIdPopup, selectedProductTypeIdPopup, selectedLevel4IdPopup, categories, refreshCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedSectionId, setSelectedSectionId] = useState(selectedSectionIdPopup || '');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState(selectedProductTypeIdPopup || '');
  const [selectedLevel4Id, setSelectedLevel4Id] = useState(selectedLevel4IdPopup || '');
  const [levelFiveName, setLevelFiveName] = useState('');

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSectionId('');
    setSelectedProductTypeId('');
    setSelectedLevel4Id('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_IP}/createCategory4/`, {
        name: levelFiveName,
        category_id: selectedLevel4Id,
      });

      setLevelFiveName('');
      setSelectedCategoryId('');
      setSelectedSectionId('');
      setSelectedProductTypeId('');
      setSelectedLevel4Id('');

      await refreshCategories();
      Swal.fire('Success', 'Level 5 category added successfully!', 'success').then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error adding level 5 category:', error);
      alert('Error adding level 5 category. Please try again.');
    }
  };

  return (
    <div className="add-level-five">
      <p className="form-title">Add Level 5 Category</p>
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
        {selectedProductTypeId && (
          <select value={selectedLevel4Id} onChange={(e) => setSelectedLevel4Id(e.target.value)} required>
            <option value="">Select a Level 4</option>
            {categories
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.find((sec) => sec._id === selectedSectionId)
              ?.level_two_category_list.find((pt) => pt._id === selectedProductTypeId)
              ?.level_three_category_list.map((levelFour) => (
                <option key={levelFour._id} value={levelFour._id}>
                  {levelFour.name}
                </option>
              ))}
          </select>
        )}
        <input
          type="text"
          value={levelFiveName}
          onChange={(e) => setLevelFiveName(e.target.value)}
          placeholder="Enter Level 5 name"
          required
        />
        <button type="submit">Add New Level 5</button>
      </form>
    </div>
  );
};

export default AddLevelFive;
