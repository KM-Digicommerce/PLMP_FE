// src/components/AddProductType.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css'

const AddProductType = ({ categories, refreshCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [productTypeName, setProductTypeName] = useState('');

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSectionId(''); // Reset section selection when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${process.env.REACT_APP_IP}/createProductType/`, {
        name: productTypeName,
        section_id: selectedSectionId,
      });

      setProductTypeName('');
      setSelectedCategoryId('');
      setSelectedSectionId('');

      await refreshCategories(); 
      alert('Product type added successfully!');
    } catch (error) {
      console.error('Error adding product type:', error);
      alert('Error adding product type. Please try again.');
    }
  };

  return (
    <div className="add-product-type">
      <p className="form-title">Add Product Type</p>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCategoryId} 
          onChange={handleCategoryChange} 
          required
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
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
            <option value="">Select a Section</option>
            {categories
              .find((cat) => cat.category_id === selectedCategoryId)
              ?.sections.map((section) => (
                <option key={section.section_id} value={section.section_id}>
                  {section.section_name}
                </option>
              ))}
          </select>
        )}
        <input
          type="text"
          value={productTypeName}
          onChange={(e) => setProductTypeName(e.target.value)}
          placeholder="Enter product type name"
          required
        />
        <button type="submit">Add New Product Type</button>
      </form>
    </div>
  );
};

export default AddProductType;
