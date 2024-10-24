// src/components/category/categorytable/CategoriesTable.js

import React, { useState } from 'react';
import './CategoriesTable.css';
import axios from 'axios';
import AddCategory from '../categoryform/AddCategory';
import AddSection from '../categoryform/AddSection';
import AddProductType from '../categoryform/AddProductType';

const CategoriesTable = ({ categories, refreshCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCategorySelect = (e) => {
    setSelectedCategoryId(e.target.value);
    setSelectedSectionId(''); // Reset section when category changes
    setSelectedProductTypeId(''); // Reset product type when category changes
  };

  const handleSectionSelect = (e) => {
    setSelectedSectionId(e.target.value);
    setSelectedProductTypeId(''); // Reset product type when section changes
  };

  const handleProductTypeSelect = (e) => {
    setSelectedProductTypeId(e.target.value);
  };

  if (!Array.isArray(filteredCategories) || filteredCategories.length === 0) {
    return <div>No categories available</div>;
  }

  // Delete Category API Call
  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteCategory/`, {
        data: { id: categoryId }, // Payload for delete API
      });

      // Check if the response indicates a successful deletion
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server'); // Handle unexpected response
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this section?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteSection/`, {
        data: { id: sectionId },
      });
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section. Please try again.');
    }
  };

  const handleDeleteProductType = async (productTypeId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product type?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteProductType/`, {
        data: { id: productTypeId },
      });
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting product type:', error);
      alert('Failed to delete product type. Please try again.');
    }
  };

  return (
    <div className="CategoryMain">
      <div className="CategoryTable-header">
        <h3>Categories</h3>
      </div>

      <div className='CategoryContainer'>
        <div className='DropdownsContainer'>
          <div className='DropdownColumn'>
            <label htmlFor="categorySelect">Select a Category:</label>
            <select id="categorySelect" value={selectedCategoryId} onChange={handleCategorySelect}>
              <option value="">Select a Category</option>
              {categories.map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
              <option value="add">Add New Category</option>
            </select>
          </div>

          <div className='DropdownColumn'>
            <label htmlFor="sectionSelect">Select a Section:</label>
            <select id="sectionSelect" value={selectedSectionId} onChange={handleSectionSelect}>
              <option value="">Select a Section</option>
              {categories.find(cat => cat.category_id === selectedCategoryId)?.sections.map(section => (
                <option key={section.section_id} value={section.section_id}>
                  {section.section_name}
                </option>
              ))}
              <option value="add">Add New Section</option>
            </select>
          </div>

          <div className='DropdownColumn'>
            <label htmlFor="productTypeSelect">Select a Product Type:</label>
            <select id="productTypeSelect" value={selectedProductTypeId} onChange={handleProductTypeSelect}>
              <option value="">Select a Product Type</option>
              {categories.find(cat => cat.category_id === selectedCategoryId)
                ?.sections.find(sec => sec.section_id === selectedSectionId)
                ?.product_types.map(productType => (
                  <option key={productType.id} value={productType.id}>
                    {productType.name}
                  </option>
              ))}
              <option value="add">Add New Product Type</option>
            </select>
          </div>
        </div>
        <div className='CategoryContainerRight'>
          <p>Categories Forms</p>
          <AddCategory refreshCategories={refreshCategories} />
          <AddSection categories={categories} refreshCategories={refreshCategories} />
          <AddProductType categories={categories} refreshCategories={refreshCategories} />
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;
