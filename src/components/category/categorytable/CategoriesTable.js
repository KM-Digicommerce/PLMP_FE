// src/components/category/categorytable/CategoriesTable.js
import React, { useState, useEffect } from 'react';
import './CategoriesTable.css';
import Swal from 'sweetalert2';
import AddCategory from '../categoryform/AddCategory';
import AddLevelTwo from '../categoryform/AddLevelTwo';
import AddLevelThree from '../categoryform/AddLevelThree';
import AddLevelFour from '../categoryform/AddLevelFour';
import AddLevelFive from '../categoryform/AddLevelFive';
import AddLevelSix from '../categoryform/AddLevelSix';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
// import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
// import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
// import QueueOutlinedIcon from '@mui/icons-material/QueueOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axiosInstance from '../../../utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
const CategoriesTable = ({ categories, refreshCategories }) => {
  const [products, setProducts] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedCategoryIdForallprod, setSelectedCategoryIdForallprod] = useState('');
  const [selectedCategorylevelForallprod, setSelectedCategorylevelForallprod] = useState('');
  const [selectedCategoryIdPopup, setSelectedCategoryIdPopup] = useState('');
  const [selectedLevel2Id, setSelectedLevel2Id] = useState('');
  const [selectedLevel2IdPopup, setSelectedLevel2IdPopup] = useState('');
  const [selectedLevel3IdPopup, setSelectedLevel3IdPopup] = useState('');
  const [selectedLevel4IdPopup, setSelectedLevel4IdPopup] = useState('');
  const [selectedLevel5IdPopup, setSelectedLevel5IdPopup] = useState('');
  const [searchQuerylist, setSearchQuerylist] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: 'product_name', direction: 'asc' });
  const [searchPopupVisible, setSearchPopupVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (selectedCategoryIdForallprod) {
        try {
          const response = await axiosInstance.get(
            `${process.env.REACT_APP_IP}/obtainAllProductList/`,
            {
              params: {
                category_id: selectedCategoryIdForallprod,
                level_name: selectedCategorylevelForallprod
              }
            }
          );
          setProducts(response.data.data.product_list);
        } catch (error) {
          console.error('Error fetching product list:', error);
        }
      }
    };

    fetchProducts();
  }, [selectedCategoryIdForallprod]);

  const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
  const [selectedlevel4, setSelectedlevel4] = useState('');
  const [selectedlevel5, setSelectedlevel5] = useState('');
  const [selectedlevel6, setSelectedlevel6] = useState('');
  const [showAddCategoryPopup, setShowAddCategoryPopup] = useState(false);
  const [showAddLevel2Popup, setShowAddLevel2Popup] = useState(false);
  const [showAddProductTypePopup, setShowAddLevel3Popup] = useState(false);
  const [showAddlevel4Popup, setShowAddlevel4Popup] = useState(false);
  const [showAddlevel5Popup, setShowAddlevel5Popup] = useState(false);
  const [showAddlevel6Popup, setShowAddlevel6Popup] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
  const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);

  const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
  const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
  const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryLevel2, setSearchQueryLevel2] = useState('');
  const [searchQueryLevel3, setSearchQueryLevel3] = useState('');
  const [searchQueryLevel4, setSearchQueryLevel4] = useState('');
  const [searchQueryLevel5, setSearchQueryLevel5] = useState('');
  const [searchQueryLevel6, setSearchQueryLevel6] = useState('');

  const filteredCategories = categories.category_list.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelOneCategory = categories.category_list.find(level1 => level1._id === selectedCategoryId);

  const filteredCategoriesLevel2 = levelOneCategory
    ? levelOneCategory.level_one_category_list.filter(level2 =>
      level2.name.toLowerCase().includes(searchQueryLevel2.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 =>
      level2.name.toLowerCase().includes(searchQueryLevel2.toLowerCase())
    );

  const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;

  const filteredCategoriesLevel3 = levelTwoCategory
    ? levelTwoCategory.level_two_category_list.filter(level3 =>
      level3.name.toLowerCase().includes(searchQueryLevel3.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list)
      .flatMap(level2 => level2.level_two_category_list)
      .filter(level3 =>
        level3.name.toLowerCase().includes(searchQueryLevel3.toLowerCase())
      );

  const levelThreeCategory = levelTwoCategory
    ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)
    : null;


  const filteredCategoriesLevel4 = levelThreeCategory
    ? levelThreeCategory.level_three_category_list.filter(level4 =>
      level4.name.toLowerCase().includes(searchQueryLevel4.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list)
      .flatMap(level2 => level2.level_two_category_list)
      .flatMap(level3 => level3.level_three_category_list)
      .filter(level4 =>
        level4.name.toLowerCase().includes(searchQueryLevel4.toLowerCase())
      );

  const levelFourCategory = levelThreeCategory
    ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4)
    : null;

  const filteredCategoriesLevel5 = levelFourCategory
    ? levelFourCategory.level_four_category_list.filter(level5 =>
      level5.name.toLowerCase().includes(searchQueryLevel5.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list)
      .flatMap(level2 => level2.level_two_category_list)
      .flatMap(level3 => level3.level_three_category_list)
      .flatMap(level4 => level4.level_four_category_list)
      .filter(level5 =>
        level5.name.toLowerCase().includes(searchQueryLevel5.toLowerCase())
      );

  const levelFiveCategory = levelFourCategory
    ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5)
    : null;

  const filteredCategoriesLevel6 = levelFiveCategory
    ? levelFiveCategory.level_five_category_list.filter(level6 =>
      level6.name.toLowerCase().includes(searchQueryLevel6.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list)
      .flatMap(level2 => level2.level_two_category_list)
      .flatMap(level3 => level3.level_three_category_list)
      .flatMap(level4 => level4.level_four_category_list)
      .flatMap(level5 => level5.level_five_category_list)
      .filter(level6 =>
        level6.name.toLowerCase().includes(searchQueryLevel6.toLowerCase())
      );

  const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list);
  const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
  const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list);
  const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
  const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list)
    .flatMap(level3 => level3.level_three_category_list);
  const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
  const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list)
    .flatMap(level3 => level3.level_three_category_list)
    .flatMap(level4 => level4.level_four_category_list);
  const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
  const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list)
    .flatMap(level3 => level3.level_three_category_list)
    .flatMap(level4 => level4.level_four_category_list)
    .flatMap(level5 => level5.level_five_category_list);

  const handleCategorySelectForVariants = async (id, category_level) => {
    setSelectedCategorylevelForallprod(category_level);
    setSelectedCategoryIdForallprod(id);
  };
  const handleCloseConfirmation = () => {
    if (isTyping) {
      Swal.fire({
        title: "Are you sure?",
        text: "You have unsaved changes. Are you sure you want to close without adding a category?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, close it",
        cancelButtonText: "No, stay",
         customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel'
         }
      }).then((result) => {
        if (result.isConfirmed) {
          setShowAddCategoryPopup(false);
          setShowAddLevel2Popup(false);
          setShowAddLevel3Popup(false);
          setShowAddlevel4Popup(false);
          setShowAddlevel5Popup(false);
          setShowAddlevel6Popup(false);
          setIsTyping(false);
        }
      });
    } else {
      setShowAddCategoryPopup(false);
      setShowAddLevel2Popup(false);
      setShowAddLevel3Popup(false);
      setShowAddlevel4Popup(false);
      setShowAddlevel5Popup(false);
      setShowAddlevel6Popup(false);
    }
  };

  const closeAddCategoryPopup = () => {
    setIsTyping(false);
    setShowAddCategoryPopup(false);
    setShowAddLevel2Popup(false);
    setShowAddLevel3Popup(false);
    setShowAddlevel4Popup(false);
    setShowAddlevel5Popup(false);
    setShowAddlevel6Popup(false);
  };
  const handleCategorySelect = (e) => {
    const selectedValue = e;
    setSelectedCategoryId(selectedValue);
    setSelectedCategoryIdPopup(selectedValue);
    setSelectedLevel2Id('');
    setSelectedLevel3Id('');
    setSelectedlevel4('');
    setSelectedlevel5('');
    setSelectedlevel6('');
    if (selectedValue === 'add') {
      setShowAddCategoryPopup(true);
      setSelectedCategoryId('');
    } else {
      setShowAddCategoryPopup(false);
    }
    setIsCategoryDropdownOpen(false);
    setIsLevel2DropdownOpen(false);
    setIsLevel3DropdownOpen(false);
    setSearchQuery('');
  };
  const handleLevel2Select = (e) => {
    const selectedValue = e;
    console.log(e, 'selected category id');

    if (selectedValue && selectedValue !== 'add') {
      let level1Category;
      categories.category_list.some(level1 => {
        const foundLevel2 = level1.level_one_category_list.some(level2 => level2._id === selectedValue);

        if (foundLevel2) {
          level1Category = level1;
          return true;
        }
        return false;
      });

      if (!level1Category) {
        console.error('Level 1 category not found for Level 2 category with ID:', selectedValue);
        return;
      }

      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(selectedValue);
      setSelectedCategoryIdPopup(level1Category._id);
      setSelectedLevel2IdPopup(selectedValue);

      setSelectedLevel3Id('');
      setSelectedlevel4('');
      setSelectedlevel5('');
      setSelectedlevel6('');

      setIsLevel2DropdownOpen(false);
      setIsLevel3DropdownOpen(false);
    } else {
      if (selectedValue === 'add') {
        setShowAddLevel2Popup(true);
      } else {
        setShowAddLevel2Popup(false);
      }
      setSelectedLevel2Id('');
      setSelectedLevel2IdPopup('');
      setSelectedLevel3Id('');
      setSelectedlevel4('');
      setSelectedlevel5('');
      setSelectedlevel6('');
    }
  };
  const handleLevel3Select = (e) => {
    const selectedValue = e;
    console.log(e, 'selected category id');
    if (selectedValue && selectedValue !== 'add') {
      let level1Category, level2Category;
      categories.category_list.some(level1 => {
        const foundLevel2 = level1.level_one_category_list.find(level2 =>
          level2.level_two_category_list.some(level3 => level3._id === selectedValue)
        );
        if (foundLevel2) {
          level1Category = level1;
          level2Category = foundLevel2;
          return true;
        }
        return false;
      });
      if (!level2Category || !level1Category) {
        console.error('Parent categories not found for selected Level 3 category with ID:', selectedValue);
        return;
      }
      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(level2Category._id);
      setSelectedCategoryIdPopup(level1Category._id);
      setSelectedLevel2IdPopup(level2Category._id);
      setSelectedLevel3Id(selectedValue);
      setSelectedLevel3IdPopup(selectedValue);

      setSelectedlevel4('');
      setSelectedlevel5('');
      setSelectedlevel6('');

      setIsLevel3DropdownOpen(false);
    } else {
      if (selectedValue === 'add') {
        setShowAddLevel3Popup(true);
      } else {
        setShowAddLevel3Popup(false);
      }
      setSelectedLevel3Id('');
      setSelectedLevel3IdPopup('');
      setSelectedlevel4('');
      setSelectedlevel5('');
      setSelectedlevel6('');
    }
  };
  const handlelevel4 = (e) => {
    const selectedValue = e;
    if (selectedValue && selectedValue != 'add') {
      const level3Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .find(level3 => level3._id === selectedValue);

      if (!level3Category) {
        console.error('Level 3 category not found for ID:', level3Category._id);
        return;
      }
      const level2Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .find(level2 => level2.level_two_category_list.some(level3 => level3._id === selectedValue));

      if (!level2Category) {
        console.error('Level 2 category not found for Level 3 category with ID:', level2Category._id);
        return;
      }
      const level1Category = categories.category_list.find(level1 =>
        level1.level_one_category_list.some(level2 => level2._id)
      );

      if (!level1Category) {
        console.error('Level 1 category not found for Level 2 category with ID:', level1Category._id);
        return;
      }

      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(level2Category._id);
      setSelectedLevel3Id(level3Category._id);
      setSelectedCategoryIdPopup(level1Category._id);
      setSelectedLevel2IdPopup(level2Category._id);
      setSelectedLevel3IdPopup(level3Category._id);

      setSelectedlevel4(selectedValue);
      setSelectedLevel4IdPopup(selectedValue);
      setSelectedlevel5('');
      setSelectedlevel6('');
      setIslevel4DropdownOpen(false);
    } else {
      if (selectedValue === 'add') {
        setShowAddlevel4Popup(true);
      } else {
        setShowAddlevel4Popup(false);
      }
      setSelectedlevel4('');
      setSelectedLevel4IdPopup('');
      setSelectedlevel5('');
      setSelectedlevel6('');
    }
  };
  const handlelevel5 = (e) => {
    const selectedValue = e;
    if (selectedValue && selectedValue != 'add') {
      const level4Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .flatMap(level3 => level3.level_three_category_list)
        .find(level4 => level4._id);

      if (!level4Category) {
        console.error('Level 4 category not found for ID:', level4Category._id);
        return;
      }
      const level3Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .find(level3 => level3._id);

      if (!level3Category) {
        console.error('Level 3 category not found for ID:', level3Category._id);
        return;
      }
      const level2Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

      if (!level2Category) {
        console.error('Level 2 category not found for Level 3 category with ID:', level2Category._id);
        return;
      }
      const level1Category = categories.category_list.find(level1 =>
        level1.level_one_category_list.some(level2 => level2._id)
      );

      if (!level1Category) {
        console.error('Level 1 category not found for Level 2 category with ID:', level1Category._id);
        return;
      }

      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(level2Category._id);
      setSelectedLevel3Id(level3Category._id);
      setSelectedlevel4(level4Category._id);
      setSelectedCategoryIdPopup(level1Category._id);
      setSelectedLevel2IdPopup(level2Category._id);
      setSelectedLevel3IdPopup(level3Category._id);
      setSelectedLevel4IdPopup(level4Category._id);

      setSelectedlevel5(selectedValue);
      setSelectedLevel5IdPopup(selectedValue);
      setSelectedlevel6('');

      setIslevel5DropdownOpen(false);
    } else {
      if (selectedValue === 'add') {
        setShowAddlevel5Popup(true);
      } else {
        setShowAddlevel5Popup(false);
      }
      setSelectedlevel5('');
      setSelectedLevel5IdPopup('');
      setSelectedlevel6('');
    }
  };
  const handlelevel6 = (e) => {
    const selectedValue = e;
    if (selectedValue && selectedValue != 'add') {
      const level5Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .flatMap(level3 => level3.level_three_category_list)
        .flatMap(level4 => level4.level_four_category_list)
        .find(level5 => level5._id);

      if (!level5Category) {
        console.error('Level 5 category not found for ID:', level5Category._id);
        return;
      }

      const level4Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .flatMap(level3 => level3.level_three_category_list)
        .find(level4 => level4._id);

      if (!level4Category) {
        console.error('Level 4 category not found for ID:', level4Category._id);
        return;
      }
      const level3Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .flatMap(level2 => level2.level_two_category_list)
        .find(level3 => level3._id);

      if (!level3Category) {
        console.error('Level 3 category not found for ID:', level3Category._id);
        return;
      }
      const level2Category = categories.category_list
        .flatMap(level1 => level1.level_one_category_list)
        .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

      if (!level2Category) {
        console.error('Level 2 category not found for Level 3 category with ID:', level2Category._id);
        return;
      }
      const level1Category = categories.category_list.find(level1 =>
        level1.level_one_category_list.some(level2 => level2._id)
      );

      if (!level1Category) {
        console.error('Level 1 category not found for Level 2 category with ID:', level1Category._id);
        return;
      }

      setSelectedCategoryId(level1Category._id);
      setSelectedLevel2Id(level2Category._id);
      setSelectedLevel3Id(level3Category._id);
      setSelectedlevel4(level4Category._id);
      setSelectedlevel5(level5Category._id);
      setSelectedCategoryIdPopup(level1Category._id);
      setSelectedLevel2IdPopup(level2Category._id);
      setSelectedLevel3IdPopup(level3Category._id);
      setSelectedLevel4IdPopup(level4Category._id);
      setSelectedLevel5IdPopup(level5Category._id);

      setSelectedlevel6(selectedValue);
      setIslevel6DropdownOpen(false);
    } else {
      if (selectedValue === 'add') {
        setShowAddlevel6Popup(true);
      } else {
        setShowAddlevel6Popup(false);
      }
      setSelectedlevel6('');
    }
  };

  if (!Array.isArray(filteredCategories ? filteredCategories : []) || filteredCategories.length === 0) {
    return <div>No categories available</div>;
  }

  // Delete Category API Call
  // const handleDeleteCategory = async (categoryId, category_name) => {
  //   const confirmDelete = window.confirm('Are you sure you want to delete this category?');
  //   if (!confirmDelete) return; // Exit if user cancels

  //   try {
  //     const response = await axiosInstance.delete(`${process.env.REACT_APP_IP}/deleteCategory/`, {
  //       data: { id: categoryId,category_name:category_name}, // Payload for delete API
  //     });

  //     // Check if the response indicates a successful deletion
  //     if (response.status === 204 || response.status === 200) {
  //       Swal.fire('Deleted!', 'Selected category has been deleted.', 'success');
  //       await refreshCategories(); // Refresh categories after successful deletion
  //     } else {
  //       throw new Error('Unexpected response from server'); // Handle unexpected response
  //     }
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //     alert('Error deleting category. Please try again.');
  //   }
  // };
  // const handleEditCategory = async (categoryId, name) => {
  //   try {
  //     const response = await axiosInstance.delete(`${process.env.REACT_APP_IP}/updateCategory/`, {
  //       data: {
  //         id: categoryId,
  //         name: newCategoryName,
  //       }, // Payload for delete API
  //     });
  //     // Check if the response indicates a successful deletion
  //     if (response.status === 204 || response.status === 200) {
  //       await refreshCategories(); // Refresh categories after successful deletion
  //     } else {
  //       throw new Error('Unexpected response from server'); // Handle unexpected response
  //     }
  //   } catch (error) {
  //     console.error('Error updating category:', error);
  //     alert('Error updating category. Please try again.');
  //   }
  // };


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
      inputValue: currentName,
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
          await axiosInstance.post(`${process.env.REACT_APP_IP}/updateCategory/`, {
            id: productTypeId,
            name: result.value,
            category_name: category_name,
          });

          await refreshCategories();
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

  const handleSort = (column) => {
    const direction = sortOrder.column === column && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    setSortOrder({ column, direction });
  };

  const sortProducts = (products) => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (a[sortOrder.column] < b[sortOrder.column]) {
        return sortOrder.direction === 'asc' ? -1 : 1;
      }
      if (a[sortOrder.column] > b[sortOrder.column]) {
        return sortOrder.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedProducts;
  };
  const handleSearchClick = () => {
    setSearchPopupVisible(true);
    setSearchVisible(!searchVisible);

  };

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuerylist(query);
    if (query.length > 0) {
      const matchedSuggestions = products
        .map((product) => product.product_name)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()));
      console.log(matchedSuggestions, 'sortedProducts');
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuerylist(suggestion);
    setSuggestions([]);
  };
  const sortedProducts = sortProducts(products);

  let sortedProductss = sortProducts(products);
  // console.log(sortedProductss, 'sortedProducts');
  const getFilteredAndSortedProducts = () => {
    return sortedProductss.filter((product) =>
      product.product_name.toLowerCase().includes(searchQuerylist.toLowerCase()) ||
      product.model.toLowerCase().includes(searchQuerylist.toLowerCase()) ||
      product.tags.toLowerCase().includes(searchQuerylist.toLowerCase())
    );
  };


  return (
    <div className="CategoryMain">
      <div className="CategoryTable-header">
        <h3>Categories</h3>
      </div>
      <div className='CategoryContainer'>
        <div className='DropdownsContainer'>
          <div className='DropdownColumn'>
            <label htmlFor="categorySelect">Level 1: </label>
            <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
              <div className="selected-category">
                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name
                  : 'Select Category'}
                <span className="dropdown-icons">
                  <AddOutlinedIcon onClick={() => handleCategorySelect("add")} />
                  <ChevronDownIcon style={{ fontSize: 25 }} />
                </span>
              </div>
              {isCategoryDropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                    <span>Select Category</span>
                  </div>
                  {filteredCategories.map(level1 => (
                    <div className="dropdown-option" key={level1._id} onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1'); }}
                    >
                      {editingCategoryId === level1._id ? (
                        <div>
                          {/* <input
                            type="text"
                            value={newCategoryName}
                            onChange={handleCategoryNameChange}
                          />
                          <button onClick={() => handleEditCategory(level1._id)}>Save</button>
                          <button onClick={cancelEdit}>Cancel</button> */}
                        </div>
                      ) : (
                        <div>
                          <span>{level1.name}</span>
                          {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level1._id, level1.name, 'level-1')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level1._id,'level-1');
                          }} /> */}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* <div className="dropdown-option" >
                    <QueueOutlinedIcon onClick={() => handleCategorySelect("add")} />
                  </div> */}
                </div>
              )}
            </div>
          </div>
          {/* {level2Categories.length > 0 && ( */}
          {/* <> */}
          <div className='DropdownColumn'>
            <label htmlFor="sectionSelect">Level 2:</label>
            <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
              <div className="selected-category">
                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}
                <span className="dropdown-icons">
                  < AddOutlinedIcon onClick={() => handleLevel2Select("add")} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {isLevel2DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueryLevel2}
                    onChange={(e) => { setSearchQueryLevel2(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleLevel2Select('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel2?.map(level2 => (
                    <div className="dropdown-option" key={level2._id} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
                      <span>{level2.name}</span>
                      {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level2._id, level2.name, 'level-2')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level2._id,'level-2');
                          }} /> */}
                    </div>
                  ))}
                  {/* <div className="dropdown-option">
                    <QueueOutlinedIcon onClick={() =>  handleLevel2Select("add")} />
                  </div> */}
                </div>
              )}
            </div>
          </div>
          {/* </> */}
          {/* // )} */}

          {/* {level3Categories.length > 0 && (
            <> */}
          <div className='DropdownColumn'>
            <label htmlFor="productTypeSelect">Level 3:</label>
            <div className="custom-dropdown" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
              <div className="selected-category">
                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}
                <span className="dropdown-icons">
                  <AddOutlinedIcon onClick={() => handleLevel3Select('add')} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {isLevel3DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueryLevel3}
                    onChange={(e) => { setSearchQueryLevel3(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleLevel3Select('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel3?.map(level3 => (
                    <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
                      <span>{level3.name}</span>
                      {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level3._id, level3.name, 'level-3')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level3._id,'level-3');
                          }} /> */}
                    </div>
                  ))}
                  {/* <div className="dropdown-option" >
                    <QueueOutlinedIcon onClick={() =>  handleLevel3Select('add')} />
                  </div> */}
                </div>
              )}
            </div>
          </div>
          {/* </>
          )} */}
          {/* {level4Categories.length > 0 && (
            <> */}
          <div className='DropdownColumn'>
            <label htmlFor="productTypeSelect">Level 4:</label>
            <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}
                <span className="dropdown-icons">
                  < AddOutlinedIcon onClick={() => handlelevel4('add')} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel4DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueryLevel4}
                    onChange={(e) => { setSearchQueryLevel4(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel4('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel4?.map(level4 => (
                    <div className="dropdown-option" key={level4._id} onClick={() => { handlelevel4(level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
                      <span>{level4.name}</span>
                      {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level4._id, level4.name, 'level-4')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level4._id,'level-4');
                          }} /> */}
                    </div>
                  ))}
                  {/* <div className="dropdown-option">
                    <QueueOutlinedIcon onClick={() => handlelevel4('add')} />
                  </div> */}
                </div>
              )}
            </div>
          </div>
          {/* </>
          )} */}
          {/* {level5Categories.length > 0 && (
            <> */}
          <div className='DropdownColumn'>
            <label htmlFor="productTypeSelect">Level 5:</label>
            <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}
                <span className="dropdown-icons">
                  < AddOutlinedIcon onClick={() => handlelevel5('add')} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel5DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueryLevel5}
                    onChange={(e) => { setSearchQueryLevel5(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel5('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel5?.map(level5 => (
                    <div className="dropdown-option" key={level5._id} onClick={() => { handlelevel5(level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
                      <span>{level5.name}</span>
                      {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level5._id, level5.name, 'level-5')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level5._id,'level-5');
                          }} /> */}
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
          {/* </>
    )} */}
          {/* {level6Categories.length > 0 && (
            <> */}
          <div className='DropdownColumn'>
            <label htmlFor="productTypeSelect">Level 6:</label>
            <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}
                <span className="dropdown-icons">
                  < AddOutlinedIcon onClick={() => handlelevel6('add')} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
              </div>
              {islevel6DropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text"
                    placeholder="Search category..."
                    value={searchQueryLevel6}
                    onChange={(e) => { setSearchQueryLevel6(e.target.value) }}
                    className="dropdown-search-input"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel6('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel6?.map(level6 => (
                    <div className="dropdown-option" key={level6._id} onClick={() => { handlelevel6(level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
                      <span>{level6.name}</span>
                      {/* <EditNoteOutlinedIcon onClick={() => handleEditProductType(level6._id, level6.name, 'level-6')} />
                          <DeleteOutlinedIcon onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(level6._id,'level-6');
                          }} /> */}
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>
          {/* </>
            )} */}
        </div>
        <Dialog open={showAddCategoryPopup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"> <span className="close-icon">X</span></button>
          <DialogContent>
            <AddCategory refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddLevel2Popup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"><span className="close-icon">X</span></button>
          <DialogContent>
            < AddLevelTwo selectedCategoryIdPopup={selectedCategoryIdPopup} categories={categories} refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddProductTypePopup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"><span className="close-icon">X</span></button>
          <DialogContent>
            < AddLevelThree selectedCategoryIdPopup={selectedCategoryIdPopup}
              selectedLevel2IdPopup={selectedLevel2IdPopup} categories={categories} refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddlevel4Popup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"><span className="close-icon">X</span></button>
          <DialogContent>
            <AddLevelFour selectedCategoryIdPopup={selectedCategoryIdPopup} selectedLevel2IdPopup={selectedLevel2IdPopup} selectedLevel3IdPopup={selectedLevel3IdPopup} categories={categories}
              refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddlevel5Popup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"><span className="close-icon">X</span></button>
          <DialogContent>
            <AddLevelFive selectedCategoryIdPopup={selectedCategoryIdPopup} selectedLevel2IdPopup={selectedLevel2IdPopup} selectedLevel3IdPopup={selectedLevel3IdPopup} selectedLevel4IdPopup={selectedLevel4IdPopup}
              categories={categories}
              refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddlevel6Popup} style={{ zIndex: 1400 }} onClose={() => handleCloseConfirmation()} fullWidth maxWidth="sm">
          <button onClick={() => handleCloseConfirmation()} color="secondary" className="close-button"><span className="close-icon">X</span></button>
          <DialogContent>
            <AddLevelSix selectedCategoryIdPopup={selectedCategoryIdPopup} selectedLevel2IdPopup={selectedLevel2IdPopup} selectedLevel3IdPopup={selectedLevel3IdPopup} selectedLevel4IdPopup={selectedLevel4IdPopup} selectedLevel5IdPopup={selectedLevel5IdPopup} categories={categories}
              refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
          </DialogContent>
        </Dialog>
      </div>
      {levelOneCategory && (
        <div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0px' }}>
            <h3>Products</h3>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              {searchVisible && (
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuerylist}
                  onChange={handleSearchChange}
                  style={{
                    marginRight: '10px',
                    padding: '7px',
                    fontSize: '15px',
                    width: '500px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                  }}
                />
              )}
            </div>

            {searchVisible && suggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '63%',
                  left: '54%',
                  transform: 'translateX(-50%)',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 1000,
                  width: '515px',
                  maxHeight: '150px',
                  overflowY: 'auto',
                  marginTop: '5px',
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggest_cls"
                    style={{
                      padding: '6px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      backgroundColor: 'white',
                    }}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontWeight: 'normal', marginLeft: '10px' }}>
              <FontAwesomeIcon
                icon={faSearch}
                onClick={handleSearchClick}
                style={{ cursor: 'pointer', fontSize: '18px', marginRight: searchVisible ? '10px' : '10px' }}
              /> Total Products: {getFilteredAndSortedProducts().length}
            </h3>
          </div>
          <TableContainer
            component={Paper}
            sx={{ margin: '0px 0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('image')}
                  >
                    Image
                    {sortOrder.column === 'image' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('mpn')}
                  >
                    MPN
                    {sortOrder.column === 'mpn' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('product_name')}
                  >
                    Product Name
                    {sortOrder.column === 'product_name' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('brand')}
                  >
                    Brand
                    {sortOrder.column === 'brand' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('taxonomy')}
                  >
                    Taxonomy
                    {sortOrder.column === 'taxonomy' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('price')}
                  >
                    Base Price
                    {sortOrder.column === 'price' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('msrp')}
                  >
                    Msrp
                    {sortOrder.column === 'msrp' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }}
                    onClick={() => handleSort('model')}
                  >
                    Model
                    {sortOrder.column === 'model' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredAndSortedProducts().map((product) => (
                  <TableRow key={product.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{Array.isArray(product.image) ? (
                      <img
                        src={product.image[0]}
                        // alt={product.product_name}
                        className="product-image-round"
                      />
                    ) : (
                      <img
                        src={product.image}
                        // alt={product.product_name}
                        className="product-image-round"
                      />
                    )}
                    </TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.mpn ? `$${product.mpn}` : ''}
                    </TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>
                      {product.product_name}</TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.brand}</TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.breadcrumb}</TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.base_price ? `$${product.base_price}` : ''}
                    </TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.msrp ? `$${product.msrp}` : ''}</TableCell>
                    <TableCell sx={{ padding: '15px', fontSize: '14px' }}>{product.model}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;
