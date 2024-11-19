// src/components/AddLevelFour.js
import React, { useState } from 'react';
import './AddCategory.css';
import Swal from 'sweetalert2';
import axiosInstance from '../../../utils/axiosConfig';

const AddLevelFour = ({ selectedCategoryIdPopup, selectedLevel2IdPopup, selectedLevel3IdPopup, categories, refreshCategories,setIsTyping, onCloseDialog}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
  const [selectedLevel2Id, setselectedLevel2Id] = useState(selectedLevel2IdPopup || '');
  const [selectedLevel3Id, setSelectedLevel3Id] = useState(selectedLevel3IdPopup || '');
  const [levelFourName, setLevelFourName] = useState('');
  const handleInputChange = (e) => {
    setLevelFourName(e.target.value);
    setIsTyping(e.target.value.trim().length > 0); 
  };
  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value);
    setselectedLevel2Id('');
    setSelectedLevel3Id('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory3/`, {
        name: levelFourName,
        category_id: selectedLevel3Id,
      });

      setLevelFourName('');
      setSelectedCategoryId('');
      setselectedLevel2Id('');
      setSelectedLevel3Id('');
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
        <input
          type="text"
          value={levelFourName}
          className='add_category_input'
          onChange={handleInputChange}
          placeholder="Enter Level 4 name"
          required
        />
        <button type="submit">Add New Level 4</button>
      </form>
    </div>
  );
};

export default AddLevelFour;
