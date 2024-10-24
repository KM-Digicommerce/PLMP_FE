// src/components/category/categorytable/CategoriesTable.js

import React, { useState, useEffect } from 'react';
import './CategoriesTable.css';
import axios from 'axios';
import AddCategory from '../categoryform/AddCategory';
import AddSection from '../categoryform/AddSection';
import AddProductType from '../categoryform/AddProductType';

const CategoriesTable = ({ categories, refreshCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryIdPopup, setSelectedCategoryIdPopup] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSectionIdPopup, setSelectedSectionIdPopup] = useState('');
  const [selectedProductTypeId, setSelectedProductTypeId] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(true); // State to control dropdown open
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false); 
  const [showAddSectionPopup, setShowAddSectionPopup] = useState(false); // State to control AddCategory popup
  const [showAddProductTypePopup, setShowAddProductTypePopup] = useState(false); // State to control AddCategory popup

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleCategorySelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategoryId(selectedValue); // Reset section when category changes
    setSelectedCategoryIdPopup(selectedValue);
    setSelectedProductTypeId(''); // Reset product type when category changes
    setDropdownOpen(true);
    if (selectedValue === 'add') {
      setShowAddCategoryPopup(true);
    } else {
      setShowAddCategoryPopup(false);
    }
  };
  const closeAddCategoryPopup = () => {
    setShowAddCategoryPopup(false);
    setShowAddSectionPopup(false);
    setShowAddProductTypePopup(false);
  };
  const handleSectionSelect = (e) => {
    console.log('selectedCategoryIdPopup',selectedCategoryIdPopup);
    
    const selectedValue = e.target.value;
    setSelectedSectionId(selectedValue);
    setSelectedSectionIdPopup(selectedValue);
    setSelectedProductTypeId(''); // Reset product type when section changes
    if (selectedValue === 'add') {
      setShowAddSectionPopup(true);
    } else {
      setShowAddSectionPopup(false);
    }
  };

  const handleProductTypeSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedProductTypeId(selectedValue);
    if (selectedValue === 'add') {
      setShowAddProductTypePopup(true);
    } else {
      setShowAddProductTypePopup(false);
    }
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
        {showAddCategoryPopup && (
          <div className="popup">
            <div className="popup-content">
              <button onClick={closeAddCategoryPopup}>Close</button>
              <AddCategory refreshCategories={refreshCategories} />
            </div>
          </div>
        )}
        {showAddSectionPopup && (
          <div className="popup">
            <div className="popup-content">
              <button onClick={closeAddCategoryPopup}>Close</button>
              <AddSection  selectedCategoryIdPopup={selectedCategoryIdPopup} categories={categories} refreshCategories={refreshCategories} />
              </div>
          </div>
        )}
        {showAddProductTypePopup && (
          <div className="popup">
            <div className="popup-content">
              <button onClick={closeAddCategoryPopup}>Close</button>
              <AddProductType selectedCategoryIdPopup={selectedCategoryIdPopup}
                selectedSectionIdPopup={selectedSectionIdPopup} categories={categories} refreshCategories={refreshCategories} />
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesTable;
