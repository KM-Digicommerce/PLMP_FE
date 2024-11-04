// src/components/category/categorytable/CategoriesTable.js

import React, { useState, useEffect } from 'react';
import './CategoriesTable.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import AddCategory from '../categoryform/AddCategory';
import AddSection from '../categoryform/AddSection';
import AddProductType from '../categoryform/AddProductType';
import AddLevelFour from '../categoryform/AddLevelFour';
import AddLevelFive from '../categoryform/AddLevelFive';
import AddLevelSix from '../categoryform/AddLevelSix';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';


const CategoriesTable = ({ categories, refreshCategories }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryIdPopup, setSelectedCategoryIdPopup] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedSectionIdPopup, setSelectedSectionIdPopup] = useState('');
  const [selectedProductTypeIdPopup, setSelectedProductTypeIdPopup] = useState('');
  const [selectedLevel4IdPopup, setSelectedLevel4IdPopup] = useState('');
  const [selectedLevel5IdPopup, setSelectedLevel5IdPopup] = useState('');

  const [selectedProductTypeId, setSelectedProductTypeId] = useState('');
  const [selectedlevel4, setSelectedlevel4] = useState('');
  const [selectedlevel5, setSelectedlevel5] = useState('');
  const [selectedlevel6, setSelectedlevel6] = useState('');
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showAddSectionPopup, setShowAddSectionPopup] = useState(false); // State to control AddCategory popup
  const [showAddProductTypePopup, setShowAddProductTypePopup] = useState(false); // State to control AddCategory popup
  const [showAddlevel4Popup, setShowAddlevel4Popup] = useState(false);
  const [showAddlevel5Popup, setShowAddlevel5Popup] = useState(false);
  const [showAddlevel6Popup, setShowAddlevel6Popup] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
  const [isProductTypeDropdownOpen, setIsProductTypeDropdownOpen] = useState(false);

  const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
  const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
  const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null); // State to track editing category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryLevel2, setSearchQueryLevel2] = useState('');
  const [searchQueryLevel3, setSearchQueryLevel3] = useState('');
  const [searchQueryLevel4, setSearchQueryLevel4] = useState('');
  const [searchQueryLevel5, setSearchQueryLevel5] = useState('');
  const [searchQueryLevel6, setSearchQueryLevel6] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelOneCategory = categories.find(level1 => level1._id === selectedCategoryId);
  const filteredCategoriesLevel2 = levelOneCategory?.level_one_category_list.filter(level2 =>
    level2.name.toLowerCase().includes(searchQueryLevel2.toLowerCase())
  ); 
  const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedSectionId) : null;
  const filteredCategoriesLevel3 = levelTwoCategory?.level_two_category_list.filter(level3 =>
    level3.name.toLowerCase().includes(searchQueryLevel3.toLowerCase())
  );
  const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedProductTypeId) : null;
  const filteredCategoriesLevel4 = levelThreeCategory?.level_three_category_list.filter(level4 =>
    level4.name.toLowerCase().includes(searchQueryLevel4.toLowerCase())
  );
  const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;
  const filteredCategoriesLevel5 = levelFourCategory?.level_four_category_list.filter(level5 =>
    level5.name.toLowerCase().includes(searchQueryLevel5.toLowerCase())
  );
  const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;
  const filteredCategoriesLevel6 = levelFiveCategory?.level_five_category_list.filter(level6 =>
    level6.name.toLowerCase().includes(searchQueryLevel6.toLowerCase())
  );
// To make visible the next level categories
const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : [];
const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedSectionId);
const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedProductTypeId);
const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
// To make visible the next level categories

  const handleCategorySelect = (e) => {
    const selectedValue = e;
    setSelectedCategoryId(selectedValue);
    setSelectedCategoryIdPopup(selectedValue);
    setSelectedProductTypeId('');
    setSelectedlevel4('');
    setSelectedlevel5('');
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddCategoryPopup(true);
    } else {
      setShowAddCategoryPopup(false);
    }
    setIsCategoryDropdownOpen(false);
    setIsSectionDropdownOpen(false);
    setIsProductTypeDropdownOpen(false);
    setSearchQuery('');
  };
  const closeAddCategoryPopup = () => {
    setShowAddCategoryPopup(false);
    setShowAddSectionPopup(false);
    setShowAddProductTypePopup(false);
    window.location.reload();
  };
  const handleSectionSelect = (e) => {
    console.log('selectedCategoryIdPopup', selectedCategoryIdPopup);
    const selectedValue = e;
    setSelectedSectionId(selectedValue);
    setSelectedSectionIdPopup(selectedValue);
    setSelectedProductTypeId(''); // Reset product type when section changes
    setSelectedlevel4('');
    setSelectedlevel5('');
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddSectionPopup(true);
    } else {
      setShowAddSectionPopup(false);
    }
    setIsSectionDropdownOpen(false);
    setIsProductTypeDropdownOpen(false);
  };

  const handleProductTypeSelect = (e) => {
    const selectedValue = e;
    setSelectedProductTypeId(selectedValue);
    setSelectedProductTypeIdPopup(selectedValue);
    setSelectedlevel4('');
    setSelectedlevel5('');
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddProductTypePopup(true);
    } else {
      setShowAddProductTypePopup(false);
    }
    setIsProductTypeDropdownOpen(false);
  };
  const handlelevel4 = (e) => {
    const selectedValue = e;
    setSelectedlevel4(selectedValue);
    setSelectedLevel4IdPopup(selectedValue);
    setSelectedlevel5('');
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddlevel4Popup(true);
    } else {
      setShowAddlevel4Popup(false);
    }
    setIslevel4DropdownOpen(false);
  };
  const handlelevel5 = (e) => {
    const selectedValue = e;
    setSelectedlevel5(selectedValue);
    setSelectedLevel5IdPopup(selectedValue);
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddlevel5Popup(true);
    } else {
      setShowAddlevel5Popup(false);
    }
    setIslevel5DropdownOpen(false);
  };
  const handlelevel6 = (e) => {
    const selectedValue = e;
    setSelectedlevel6(selectedValue);
    if (selectedValue === 'add') {
      setShowAddlevel6Popup(true);
    } else {
      setShowAddlevel6Popup(false);
    }
    setIslevel6DropdownOpen(false);
  };

  if (!Array.isArray(filteredCategories ? filteredCategories : []) || filteredCategories.length === 0) {
    return <div>No categories available</div>;
  }

  // Delete Category API Call
  const handleDeleteCategory = async (categoryId, category_name) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteCategory/`, {
        data: { id: categoryId,category_name:category_name}, // Payload for delete API
      });

      // Check if the response indicates a successful deletion
      if (response.status === 204 || response.status === 200) {
        Swal.fire('Deleted!', 'Selected category has been deleted.', 'success');
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server'); // Handle unexpected response
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };
  const handleEditCategory = async (categoryId, name) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/updateCategory/`, {
        data: {
          id: categoryId,
          name: newCategoryName,
        }, // Payload for delete API
      });
      // Check if the response indicates a successful deletion
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server'); // Handle unexpected response
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category. Please try again.');
    }
  };

  const startEditingCategory = (categoryId, currentName) => {
    setEditingCategoryId(categoryId);
    setNewCategoryName(currentName);
  };
  const handleCategoryNameChange = (e) => {
    setNewCategoryName(e.target.value);
  };
  const cancelEdit = () => {
    setEditingCategoryId(null);
    setNewCategoryName('');
  };
  const handleEditProductType = (productTypeId, currentName, category_name) => {
    Swal.fire({
      title: 'Edit Product Type',
      input: 'text',
      inputValue: currentName, // current name will be pre-filled
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!';
        }
      }
    }).then(async (result) => {
      console.log(result, 'result');
      if (result.isConfirmed) {
        try {
          await axios.post(`${process.env.REACT_APP_IP}/updateCategory/`, {
            id: productTypeId,
            name: result.value,
            category_name: category_name,
          });

          await refreshCategories(); // Refresh categories after the update
          console.log(result.status, 'result.status');

          if (result.status != false) {
            Swal.fire('Updated!', 'Product type has been updated.', 'success');
          }
        } catch (error) {
          console.error('Error updating product type:', error);
          Swal.fire('Error!', 'There was an error updating the product type.', 'error');
        }
      }
    });
  };

  return (
    <div className="CategoryMain">
      <div className="CategoryTable-header">
        <h3>Categories</h3>
      </div>

      <div className='CategoryContainer'>
        <div className='DropdownsContainer'>
          <div className='DropdownColumn'>
            <label htmlFor="categorySelect">Level 1:</label>
            <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
              <div className="selected-category">
                {selectedCategoryId ? categories.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
              </div>
              {isCategoryDropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                  />
                  <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                    <span>Select Category</span>
                  </div>
                  {filteredCategories.map(level1 => (
                    <div className="dropdown-option" key={level1._id} >
                      {editingCategoryId === level1._id ? (
                        <div>
                          <input
                            type="text"
                            value={newCategoryName}
                            onChange={handleCategoryNameChange}
                          />
                          <button onClick={() => handleEditCategory(level1._id)}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <span onClick={() => handleCategorySelect(level1._id)}>{level1.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level1._id, level1.name, 'level-1')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level1._id,'level-1');
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="dropdown-option" >
                    <QueueOutlinedIcon onClick={() => handleCategorySelect("add")} />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Section Dropdown */}
          {level2Categories.length > 0 && (
            <>
              <div className='DropdownColumn'>
                <label htmlFor="sectionSelect">Level 2:</label>
                <div className="custom-dropdown" onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}>
                  <div className="selected-category">
                    {selectedSectionId ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedSectionId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                  </div>
                  {isSectionDropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchQueryLevel2}
                        onChange={(e) => { setSearchQueryLevel2(e.target.value) }}
                        className="dropdown-search-input"
                        onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                      />
                      <div className="dropdown-option" onClick={() => handleSectionSelect('')}>
                        <span>Select category</span>
                      </div>
                      {filteredCategoriesLevel2?.map(level2 => (
                        <div className="dropdown-option" key={level2._id} onClick={() => handleSectionSelect(level2._id)}>
                          <span>{level2.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level2._id, level2.name, 'level-2')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level2._id,'level-2');
                          }} />
                        </div>
                      ))}
                      <div className="dropdown-option">
                        <QueueOutlinedIcon onClick={() => handleSectionSelect("add")} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Product Type Dropdown */}
          {level3Categories.length > 0 && (
            <>
              <div className='DropdownColumn'>
                <label htmlFor="productTypeSelect">Level 3:</label>
                <div className="custom-dropdown" onClick={() => setIsProductTypeDropdownOpen(!isProductTypeDropdownOpen)}>
                  <div className="selected-category">
                    {selectedProductTypeId ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedProductTypeId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                  </div>
                  {isProductTypeDropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchQueryLevel3}
                        onChange={(e) => { setSearchQueryLevel3(e.target.value) }}
                        className="dropdown-search-input"
                        onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                      />
                      <div className="dropdown-option" onClick={() => handleProductTypeSelect('')}>
                        <span>Select category</span>
                      </div>
                      {filteredCategoriesLevel3?.map(level3 => (
                        <div className="dropdown-option" key={level3._id} onClick={() => handleProductTypeSelect(level3._id)}>
                          <span>{level3.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level3._id, level3.name, 'level-3')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level3._id,'level-3');
                          }} />
                        </div>
                      ))}
                      <div className="dropdown-option" >
                        <QueueOutlinedIcon onClick={() => handleProductTypeSelect('add')} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Level 4 Dropdown */}
          {level4Categories.length > 0 && (
            <>
              <div className='DropdownColumn'>
                <label htmlFor="productTypeSelect">Level 4:</label>
                <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
                  <div className="selected-category">
                    {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                  </div>
                  {islevel4DropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchQueryLevel4}
                        onChange={(e) => { setSearchQueryLevel4(e.target.value) }}
                        className="dropdown-search-input"
                        onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                      />
                      <div className="dropdown-option" onClick={() => handlelevel4('')}>
                        <span>Select category</span>
                      </div>
                      {filteredCategoriesLevel4?.map(level4 => (
                        <div className="dropdown-option" key={level4._id} onClick={() => handlelevel4(level4._id)}>
                          <span>{level4.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level4._id, level4.name, 'level-4')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level4._id,'level-4');
                          }} />
                        </div>
                      ))}
                      <div className="dropdown-option">
                        <QueueOutlinedIcon onClick={() => handlelevel4('add')} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {/* Level 5 Dropdown */}
          {level5Categories.length > 0 && (
            <>
              <div className='DropdownColumn'>
                <label htmlFor="productTypeSelect">Level 5:</label>
                <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
                  <div className="selected-category">
                    {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                  </div>
                  {islevel5DropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchQueryLevel5}
                        onChange={(e) => { setSearchQueryLevel5(e.target.value) }}
                        className="dropdown-search-input"
                        onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                      />
                      <div className="dropdown-option" onClick={() => handlelevel5('')}>
                        <span>Select category</span>
                      </div>
                      {filteredCategoriesLevel5?.map(level5 => (
                        <div className="dropdown-option" key={level5._id} onClick={() => handlelevel5(level5._id)}>
                          <span>{level5.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level5._id, level5.name, 'level-5')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level5._id,'level-5');
                          }} />
                        </div>
                      ))}
                      <div className="dropdown-option">
                        <QueueOutlinedIcon onClick={() => handlelevel5('add')} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </>
    )}

    {/* Level 6 Dropdown */}
    {level6Categories.length > 0 && (
            <>
              <div className='DropdownColumn'>
                <label htmlFor="productTypeSelect">Level 6:</label>
                <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
                  <div className="selected-category">
                    {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                  </div>
                  {islevel6DropdownOpen && (
                    <div className="dropdown-options">
                      <input
                        type="text"
                        placeholder="Search category..."
                        value={searchQueryLevel6}
                        onChange={(e) => { setSearchQueryLevel6(e.target.value) }}
                        className="dropdown-search-input"
                        onClick={(e) => e.stopPropagation()}  // Keeps dropdown open on input click
                      />
                      <div className="dropdown-option" onClick={() => handlelevel6('')}>
                        <span>Select category</span>
                      </div>
                      {filteredCategoriesLevel6?.map(level6 => (
                        <div className="dropdown-option" key={level6._id} onClick={() => handlelevel6(level6._id)}>
                          <span>{level6.name}</span>
                          <EditNoteOutlinedIcon onClick={() => handleEditProductType(level6._id, level6.name, 'level-6')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level6._id,'level-6');
                          }} />
                        </div>
                      ))}
                      <div className="dropdown-option" >
                        <QueueOutlinedIcon onClick={() => handlelevel6('add')} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              </>
            )}
            </div>
            
          {showAddCategoryPopup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddCategory refreshCategories={refreshCategories} />
              </div>
            </div>
          )}
          {showAddSectionPopup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddSection selectedCategoryIdPopup={selectedCategoryIdPopup} categories={categories} refreshCategories={refreshCategories} />
              </div>
            </div>
          )}
          {showAddProductTypePopup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddProductType selectedCategoryIdPopup={selectedCategoryIdPopup}
                  selectedSectionIdPopup={selectedSectionIdPopup} categories={categories} refreshCategories={refreshCategories} />
              </div>
            </div>
          )}
          {showAddlevel4Popup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddLevelFour
                  selectedCategoryIdPopup={selectedCategoryIdPopup}
                  selectedSectionIdPopup={selectedSectionIdPopup}
                  selectedProductTypeIdPopup={selectedProductTypeIdPopup}
                  categories={categories}
                  refreshCategories={refreshCategories}
                />
              </div>
            </div>
          )}
          {showAddlevel5Popup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddLevelFive
                  selectedCategoryIdPopup={selectedCategoryIdPopup}
                  selectedSectionIdPopup={selectedSectionIdPopup}
                  selectedProductTypeIdPopup={selectedProductTypeIdPopup}
                  selectedLevel4IdPopup={selectedLevel4IdPopup}
                  categories={categories}
                  refreshCategories={refreshCategories}
                />
              </div>
            </div>
          )}
          {showAddlevel6Popup && (
            <div className="popup">
              <div className="popup-content">
                <button onClick={closeAddCategoryPopup} className='close_btn'>Close</button>
                <AddLevelSix
                  selectedCategoryIdPopup={selectedCategoryIdPopup}
                  selectedSectionIdPopup={selectedSectionIdPopup}
                  selectedProductTypeIdPopup={selectedProductTypeIdPopup}
                  selectedLevel4IdPopup={selectedLevel4IdPopup}
                  selectedLevel5IdPopup={selectedLevel5IdPopup}
                  categories={categories}
                  refreshCategories={refreshCategories}
                />
              </div>
            </div>
          )}
        </div>

      </div>
      );
};

      export default CategoriesTable;
