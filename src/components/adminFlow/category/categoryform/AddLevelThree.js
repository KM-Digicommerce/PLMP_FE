// src/components/ AddLevelThree.js
import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../utils/axiosConfig';

const  AddLevelThree = ({ selectedCategoryIdPopup, selectedLevel2IdPopup, categories, refreshCategories,setIsTyping, onCloseDialog}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedLevel2Id, setselectedLevel2Id] = useState(selectedLevel2IdPopup || '');
  const [productTypeName, setProductTypeName] = useState('');

  console.log(selectedLevel2Id,'selectedLevel2Id 1');
  console.log(categories,'categories 2');
  console.log(refreshCategories,'refreshCategories 3');
  const handleInputChange = (e) => {
    setProductTypeName(e.target.value);
    setIsTyping(e.target.value.trim().length > 0); 
  };
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setselectedLevel2Id(''); // Reset section selection when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory2/`, {
        name: productTypeName,
        category_id: selectedLevel2Id,
      });
      setProductTypeName('');
      setSelectedCategoryId('');
      setselectedLevel2Id('');
      setIsTyping(false);

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
      console.error('Error adding level 3 Category:', error);
      alert('Error adding level 3 Category. Please try again.');
    }
  };

  return (
    <div className="add-product-type">
      <p className="form-title">Add Level 3 Category</p>
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedCategoryId} 
          onChange={handleCategoryChange} 
          required
        >
          <option value="">Select Level 1 Category</option>
          {categories.category_list.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategoryId && (
          <select 
            value={selectedLevel2Id} 
            onChange={(e) => setselectedLevel2Id(e.target.value)} 
            required
          >
            <option value="">Select Level 2 Category</option>
            {categories.category_list
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

export default  AddLevelThree;
