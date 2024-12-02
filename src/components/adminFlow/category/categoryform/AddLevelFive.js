// src/components/AddLevelFive.js
import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../../utils/axiosConfig';

const AddLevelFive = ({ selectedCategoryIdPopup, selectedLevel2IdPopup, selectedLevel3IdPopup, selectedLevel4IdPopup, categories, refreshCategories, setIsTyping, onCloseDialog}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedLevel2Id, setselectedLevel2Id] = useState(selectedLevel2IdPopup || '');
  const [selectedLevel3Id, setSelectedLevel3Id] = useState(selectedLevel3IdPopup || '');
  const [selectedLevel4Id, setSelectedLevel4Id] = useState(selectedLevel4IdPopup || '');
  const [levelFiveName, setLevelFiveName] = useState('');
  const handleInputChange = (e) => {
    setLevelFiveName(e.target.value);
    setIsTyping(e.target.value.trim().length > 0); 
  };
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setselectedLevel2Id('');
    setSelectedLevel3Id('');
    setSelectedLevel4Id('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory4/`, {
        name: levelFiveName,
        category_id: selectedLevel4Id,
      });

      setLevelFiveName('');
      setSelectedCategoryId('');
      setselectedLevel2Id('');
      setSelectedLevel3Id('');
      setSelectedLevel4Id('');
      setIsTyping(false);
      await refreshCategories();
      Swal.fire({ title: 'Success', text: 'Category added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
        container: 'swal-custom-container',
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel',
    },
}).then(() => { });  
onCloseDialog();
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
          {categories.category_list.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategoryId && (
          <select value={selectedLevel2Id} onChange={(e) => setselectedLevel2Id(e.target.value)} required>
            <option value="">Select a Level 2 Category</option>
            {categories.category_list
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
          </select>
        )}
        {selectedLevel2Id && (
          <select value={selectedLevel3Id} onChange={(e) => setSelectedLevel3Id(e.target.value)} required>
            <option value="">Select a Level 3 Category</option>
            {categories.category_list
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.find((sec) => sec._id === selectedLevel2Id)
              ?.level_two_category_list.map((productType) => (
                <option key={productType._id} value={productType._id}>
                  {productType.name}
                </option>
              ))}
          </select>
        )}
        {selectedLevel3Id && (
          <select value={selectedLevel4Id} onChange={(e) => setSelectedLevel4Id(e.target.value)} required>
            <option value="">Select a Level 4 Category</option>
            {categories.category_list
              .find((cat) => cat._id === selectedCategoryId)
              ?.level_one_category_list.find((sec) => sec._id === selectedLevel2Id)
              ?.level_two_category_list.find((pt) => pt._id === selectedLevel3Id)
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
          className='add_category_input'
          onChange={handleInputChange}
          placeholder="Enter Level 5 name"
          required
        />
        <button type="submit">Add New Category</button>
      </form>
    </div>
  );
};

export default AddLevelFive;
