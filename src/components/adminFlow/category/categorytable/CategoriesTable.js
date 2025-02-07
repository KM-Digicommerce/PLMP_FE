// src/components/category/categorytable/CategoriesTable.js
import React, { useState, useEffect, useRef } from 'react';
import './CategoriesTable.css';
import Swal from 'sweetalert2';
import AddCategory from '../categoryform/AddCategory';
import AddLevelTwo from '../categoryform/AddLevelTwo';
import AddLevelThree from '../categoryform/AddLevelThree';
import AddLevelFour from '../categoryform/AddLevelFour';
import AddLevelFive from '../categoryform/AddLevelFive';
import AddLevelSix from '../categoryform/AddLevelSix';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import axiosInstance from '../../../../utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faSort } from '@fortawesome/free-solid-svg-icons';
import Soon from '../../../../assets/image_2025_01_02T08_51_07_818Z.png';

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
  const [searchVisible, setSearchVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState(''); // default value to 'newest'
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [responseDatasearch, setResponseDatasearch] = useState([]);
  const [hoveredCategoryLevel1, setHoveredCategoryLevel1] = useState(false); 
  const [hoveredCategoryLevel2, setHoveredCategoryLevel2] = useState(false); 
  const [hoveredCategoryLevel3, setHoveredCategoryLevel3] = useState(false); 
  const [hoveredCategoryLevel4, setHoveredCategoryLevel4] = useState(false); 
  const [hoveredCategoryLevel5, setHoveredCategoryLevel5] = useState(false); 
  const [hoveredCategoryLevel6, setHoveredCategoryLevel6] = useState(false); 
  const location = useLocation();
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get('categoryId');
    const level = params.get('level');
    return { categoryId, level };
  };
  useEffect(() => {
  const { categoryId, level } = getQueryParams();
  if (categoryId && level) {
    console.log('Inside If');    
    const categoryIdForVariant = localStorage.getItem("categoryId");
    const categoryLevelForcategories = localStorage.getItem("levelCategory");
    if (categoryIdForVariant && categoryLevelForcategories) {
      setShowclearBtn(true);
      console.log("Category Info:", categoryIdForVariant, categoryLevelForcategories);
      setSelectedCategorylevelForallprod(categoryLevelForcategories);
      setSelectedCategoryIdForallprod(categoryIdForVariant);
      switch (categoryLevelForcategories) {
        case "level-1":
          handleCategorySelect(categoryIdForVariant);
          break;
        case "level-2":
          handleLevel2Select(categoryIdForVariant);
          break;
        case "level-3":
          handleLevel3Select(categoryIdForVariant);
          break;
        case "level-4":
          handlelevel4("level-4", categoryIdForVariant);
          break;
        case "level-5":
          handlelevel5("level-5", categoryIdForVariant);
          break;
        case "level-6":
          handlelevel6("level-6", categoryIdForVariant);
          break;
        default:
          console.warn("Unknown category level:", categoryLevelForcategories);
          break;
      }
    }
  }
}, []);
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
  const handleVisibilityToggle = async (e, product) => {
    e.stopPropagation(); // Prevent click propagation if necessary
    // Toggle the visibility based on the current state of `is_active`
    const updatedVisibility = !product.is_active;
    // Update local state immediately
    setResponseData(prevData =>
      prevData.map(item =>
        item.product_id === product.product_id
          ? { ...item, is_active: updatedVisibility }
          : item
      )
    );
    setProducts(prevData =>
      prevData.map(item =>
        item.product_id === product.product_id
          ? { ...item, is_active: updatedVisibility }
          : item
      )
    );
    console.log(`Visibility toggled for product: ${product.product_name} to ${updatedVisibility ? 'Visible' : 'Invisible '}`);
    // Show confirmation dialog with SweetAlert
    Swal.fire({
      title: `Are you sure you want to ${updatedVisibility ? 'enable' : 'disable'} the selected product?`,  icon: "warning",  showCancelButton: true,  confirmButtonColor: "#d33",  cancelButtonColor: "#3085d6",  confirmButtonText: `Yes, ${updatedVisibility ? 'enable' : 'disable'} it`,  cancelButtonText: "No, stay",
      customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel'
      }
    }).then((result) => {
      // If the user clicks "Yes", then call the API to update the product status
      if (result.isConfirmed) {
        const payload = { id: product.product_id, is_active: updatedVisibility };
        // Call the API to update product visibility in the backend
        axiosInstance.post(`${process.env.REACT_APP_IP}/UpdateProductActiveInActive/`, payload)
          .then((response) => {
            if (response.data && response.data.data && response.data.data.is_update) {
              // After successful update, optionally refetch data or update UI
              fetchData();
              if (selectedCategoryIdForallprod) {
                try {
                  const response =  axiosInstance.get(
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
              Swal.fire({  title: 'Success!',  text: `The product has been ${updatedVisibility ? 'enabled' : 'disabled'}.`,  icon: 'success',
                customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel'
                }
              });
            } else {
              alert("Unexpected response structure");
            }
          })
          .catch((err) => {
            Swal.fire({  title: 'Error',  text: 'There was an issue updating the product status.',  icon: 'error',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel'
              }
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If the user clicks "No, stay", revert the local state change
        setResponseData(prevData =>
          prevData.map(item =>
            item.product_id === product.product_id
              ? { ...item, is_active: !updatedVisibility }
              : item
          )
        );
        setProducts(prevData =>
          prevData.map(item =>
            item.product_id === product.product_id
              ? { ...item, is_active: !updatedVisibility }
              : item
          )
        );
        Swal.fire({  title: 'Cancelled',  text: 'No changes were made.',  icon: 'info',  customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel'
          }
        });
      }
    });
  };
  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;    
    if (selectedOption !== '') {
      setSortOption(selectedOption);
    const filter = selectedOption === 'newest' ? true : false;
    fetchData(filter);
    }
    else{  setSortOption('');  }
  };
 
  const fetchData = async (filter) => {
    setResponseDatasearch([]);
    if (selectedCategoryIdForallprod && selectedCategorylevelForallprod) {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllProductList/`, {
          params: {
            category_id: selectedCategoryIdForallprod,
            level_name: selectedCategorylevelForallprod,
            filter } });
  
        if (response.data && response.data.data && response.data.data.product_list) {
          setResponseData(response.data.data.product_list);
          setLoading(false);
        } else {
          alert("Unexpected response structure");
        }
      } catch (err) { // setError(err.message);
      } finally {  setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchData(true); // By default, load newest products
  }, []);

  const [clearBtn, setShowclearBtn] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueryLevel2, setSearchQueryLevel2] = useState('');
  const [searchQueryLevel3, setSearchQueryLevel3] = useState('');
  const [searchQueryLevel4, setSearchQueryLevel4] = useState('');
  const [searchQueryLevel5, setSearchQueryLevel5] = useState('');
  const [searchQueryLevel6, setSearchQueryLevel6] = useState('');

  const categoryDropdownRef = useRef(null);
  const categoryDropdown2Ref = useRef(null);
  const categoryDropdown3Ref = useRef(null);
  const categoryDropdown4Ref = useRef(null);
  const categoryDropdown5Ref = useRef(null);
  const categoryDropdown6Ref = useRef(null);

  const handleClickOutside = (event) => {
    if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) { setIsCategoryDropdownOpen(false); }
    if (categoryDropdown2Ref.current && !categoryDropdown2Ref.current.contains(event.target)) { setIsLevel2DropdownOpen(false); }
    if (categoryDropdown3Ref.current && !categoryDropdown3Ref.current.contains(event.target)) { setIsLevel3DropdownOpen(false); }
    if (categoryDropdown4Ref.current && !categoryDropdown4Ref.current.contains(event.target)) { setIslevel4DropdownOpen(false); }
    if (categoryDropdown5Ref.current && !categoryDropdown5Ref.current.contains(event.target)) { setIslevel5DropdownOpen(false); }
    if (categoryDropdown6Ref.current && !categoryDropdown6Ref.current.contains(event.target)) { setIslevel6DropdownOpen(false); }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if (!categories.category_list) {
    return (
      <div className="superAdmin-error-message">
        <p>Error loading Categories data. Please try again later.</p>
      </div>
    );
  }
  const filteredCategories = categories.category_list.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const levelOneCategory = categories.category_list.find(level1 => level1._id === selectedCategoryId);

  const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(searchQueryLevel2.toLowerCase()) )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 =>
      level2.name.toLowerCase().includes(searchQueryLevel2.toLowerCase())
    );

  const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;

  const filteredCategoriesLevel3 = levelTwoCategory ? levelTwoCategory.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(searchQueryLevel3.toLowerCase())
    )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 => level3.name.toLowerCase().includes(searchQueryLevel3.toLowerCase()));

  const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;


  const filteredCategoriesLevel4 = levelThreeCategory? levelThreeCategory.level_three_category_list.filter(level4 =>  level4.name.toLowerCase().includes(searchQueryLevel4.toLowerCase()))
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 =>  level4.name.toLowerCase().includes(searchQueryLevel4.toLowerCase()));

  const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;

  const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(searchQueryLevel5.toLowerCase()) )
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 =>  level5.name.toLowerCase().includes(searchQueryLevel5.toLowerCase()));

  const levelFiveCategory = levelFourCategory? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5): null;

  const filteredCategoriesLevel6 = levelFiveCategory ? levelFiveCategory.level_five_category_list.filter(level6 =>  level6.name.toLowerCase().includes(searchQueryLevel6.toLowerCase()))
    : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 =>  level6.name.toLowerCase().includes(searchQueryLevel6.toLowerCase()));

  const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list);
  const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
  const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list);
  const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
  const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list)
    .flatMap(level2 => level2.level_two_category_list)
    .flatMap(level3 => level3.level_three_category_list);
  const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
  const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list);
  const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
  const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list);
  if (!level6Categories) {
    console.log(level6Categories);
}
  const handleCategorySelectForVariants = async (id, category_level) => {
    setShowclearBtn(true);
    setSelectedCategorylevelForallprod(category_level);
    setSelectedCategoryIdForallprod(id);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('categoryId', id);
    urlParams.set('level', category_level);
    window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
    localStorage.setItem("categoryId", id);
    localStorage.setItem("levelCategory", category_level);
      setResponseDatasearch([]);
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
      setIsCategoryDropdownOpen(false);
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
    if (selectedValue && selectedValue !== 'add') {
      let level1Category, level2Category, level3Category;
      categories.category_list.some(level1 => {
          const foundLevel2 = level1.level_one_category_list.find(level2 => 
              level2.level_two_category_list.some(level3 => 
                  level3.level_three_category_list.some(level4 => level4._id === selectedValue) ) );
          if (foundLevel2) {
              const foundLevel3 = foundLevel2.level_two_category_list.find(level3 => 
                  level3.level_three_category_list.some(level4 => level4._id === selectedValue)
              );
              if (foundLevel3) {
                  level1Category = level1;
                  level2Category = foundLevel2;
                  level3Category = foundLevel3;
                  return true;
              }
          }
          return false;
      });
      if (!level1Category || !level2Category || !level3Category) {
          console.error('Parent categories not found for selected Level 4 category with ID:', selectedValue);
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
    if (selectedValue && selectedValue !== 'add') {
      let level4Category, level3Category, level2Category, level1Category;
      categories.category_list.some(level1 => {
        return level1.level_one_category_list.some(level2 => {
          return level2.level_two_category_list.some(level3 => {
            return level3.level_three_category_list.some(level4 => {
              if (level4.level_four_category_list.some(level5 => level5._id === selectedValue)) {
                level1Category = level1;
                level2Category = level2;
                level3Category = level3;
                level4Category = level4;
                return true;  }
              return false;
            });
          });
        });
      });
      if (!level1Category || !level2Category || !level3Category || !level4Category) {
        console.error('Parent categories not found for Level 5 category with ID:', selectedValue);
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
    if (selectedValue && selectedValue !== 'add') {
      let level5Category, level4Category, level3Category, level2Category, level1Category;
      categories.category_list.some(level1 => {
        return level1.level_one_category_list.some(level2 => {
          return level2.level_two_category_list.some(level3 => {
            return level3.level_three_category_list.some(level4 => {
              return level4.level_four_category_list.some(level5 => {
                if (level5.level_five_category_list.some(level6 => level6._id === selectedValue)) {
                  level1Category = level1;
                  level2Category = level2;
                  level3Category = level3;
                  level4Category = level4;
                  level5Category = level5;
                  return true;
                }
                return false;
              });
            });
          });
        });
      });
      if (!level1Category || !level2Category || !level3Category || !level4Category || !level5Category) {
        console.error('Parent categories not found for Level 6 category with ID:', selectedValue);
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
  
const handleLevelClear = (e) => {
  setSelectedCategoryId(e);
  setSelectedLevel2Id(e);
  setSelectedLevel3Id(e);
  setSelectedlevel4(e);
  setSelectedlevel5(e);
  setSelectedlevel6(e);
  setShowclearBtn(false);
  setIsCategoryDropdownOpen(false);
  setIsLevel2DropdownOpen(false);
  setIsLevel3DropdownOpen(false);
  setIslevel4DropdownOpen(false);
  setIslevel5DropdownOpen(false);
  setIslevel6DropdownOpen(false);
  localStorage.removeItem("categoryId");
  localStorage.removeItem("levelCategory");
   navigate(`/Admin/categorylist`);
}
  const handleProductSelect = (productId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/Admin/product/${productId}`);
  };
  const handleSort = (column) => {
    const direction = sortOrder.column === column && sortOrder.direction === 'asc' ? 'desc' : 'asc';
    setSortOrder({ column, direction });
  };
  const sortProducts = (products) => {
    const sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (a[sortOrder.column] < b[sortOrder.column]) {
        return sortOrder.direction === 'asc' ? -1 : 1; }
      if (a[sortOrder.column] > b[sortOrder.column]) {
        return sortOrder.direction === 'asc' ? 1 : -1; }
      return 0;
    });
    return sortedProducts;
  };
  const handleSearchClick = () => {
    setSearchVisible(!searchVisible);
    setSearchQuerylist('');
    if (sortVisible) {
      fetchData(true);
      setSortVisible(!sortVisible);
    }
  };
  const handleSortClick = () => {
    setSortOption('');
    setSortVisible(!sortVisible);
    if (searchVisible) {
      fetchData(true);
      setSearchVisible(!searchVisible);
    }
  };

  const handleSearchChange = async(event) => {
    const query = event.target.value;
    setSearchQuerylist(query);
    if (query !== '') {
      setResponseData([]);
      setProducts([]);
    }
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_IP}/obtainAllProductList/`,
        {
          params: {
            category_id: selectedCategoryIdForallprod,
            level_name: selectedCategorylevelForallprod,
            search:query
          }
        }
      );   
      setResponseDatasearch(response.data.data.product_list);
    } catch (error) {
      console.error('Error fetching product list:', error);
    }
    if (query.length > 0 && Array.isArray(responseDatasearch)) {
      const matchedSuggestions = responseDatasearch
        .map((product) => product.product_name)
        .filter((name) => name.toLowerCase().includes(query.toLowerCase()));
  
      setSuggestions(matchedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuerylist(suggestion);
    setSuggestions([]);
  };
  let sortedProductss = [];
  if (responseDatasearch.length > 0) {
    sortedProductss = sortProducts(responseDatasearch);
  } else if (responseData.length > 0) {
    sortedProductss = sortProducts(responseData);
  } 
  if (products.length > 0) {
    sortedProductss = sortProducts(products);
  }
  const getFilteredAndSortedProducts = () => {
    return sortedProductss.filter((product) => {
      const productName = product.product_name?.toLowerCase() || '';
      const model = product.model?.toLowerCase() || '';
      const tags = product.tags?.toLowerCase() || '';
      const mpn = product.mpn?.toLowerCase() || '';
      const query = searchQuerylist.toLowerCase();
      return (
        productName.includes(query) ||
        model.includes(query) ||
        tags.includes(query) ||
        mpn.includes(query)
      );
    });
  };
  return (
    <div className="CategoryMain">
      <div className="CategoryTable-header">
        <h2>Category Schema</h2>
      </div>
      <div className='CategoryContainer'>
      {clearBtn && (
      <button className='clear_cat_btn' onClick={() => handleLevelClear('')} >Clear all</button>
      )}
        <div className='DropdownsContainer'>
          <div className='DropdownColumn' ref={categoryDropdownRef}>
            <label htmlFor="categorySelect">Level 1: </label>
            <div className="custom-dropdown"  onClick={() => {
      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
    }}>
              <div className="selected-category" >
                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name
                  : 'Select Category'}
                <span className="dropdown-icons">
                  <AddOutlinedIcon onClick={() => handleCategorySelect("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel1(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel1(false)} />
                  <ChevronDownIcon style={{ fontSize: 25 }} />
                </span>
                {hoveredCategoryLevel1 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-1 Category
            </span>
          )}
              </div>
              {isCategoryDropdownOpen && (
                <div className="dropdown-options">
                  <input
                    type="text" placeholder="Search category..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value) }} className="dropdown-search-input" onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                    <span>Select Category</span>
                  </div>
                  {filteredCategories.map(level1 => (
                    <div className="dropdown-option" onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1'); }}
                    >
                        <div>
                        </div>
                        <div>
                          <span>{level1.name}</span>
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {level2Categories.length > 0 && ( */}
          <div className='DropdownColumn'  ref={categoryDropdown2Ref}>
            <label htmlFor="sectionSelect">Level 2:</label>
            <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
              <div className="selected-category">
                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}
                <span className="dropdown-icons">
                <AddOutlinedIcon onClick={() => handleLevel2Select("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel2(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel2(false)} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
                {hoveredCategoryLevel2 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-2 Category
            </span>
          )}
              </div>
              {isLevel2DropdownOpen && (
                <div className="dropdown-options">
                  <input type="text" placeholder="Search category..." value={searchQueryLevel2} onChange={(e) => { setSearchQueryLevel2(e.target.value) }} className="dropdown-search-input" onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleLevel2Select('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel2?.map(level2 => (
                    <div className="dropdown-option"  onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
                      <span>{level2.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {level3Categories.length > 0 && (  <> */}
          <div className='DropdownColumn' ref={categoryDropdown3Ref}>
            <label htmlFor="productTypeSelect">Level 3:</label>
            <div className="custom-dropdown" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
              <div className="selected-category">
                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}
                <span className="dropdown-icons">
                <AddOutlinedIcon onClick={() => handleLevel3Select("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel3(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel3(false)} />
                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
                {hoveredCategoryLevel3 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-3 Category
            </span>
          )}
              </div>
              {isLevel3DropdownOpen && (
                <div className="dropdown-options">
                  <input  type="text"  placeholder="Search category..."  value={searchQueryLevel3}  onChange={(e) => { setSearchQueryLevel3(e.target.value) }}  className="dropdown-search-input"  onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handleLevel3Select('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel3?.map(level3 => (
                    <div className="dropdown-option" onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
                      <span>{level3.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {level4Categories.length > 0 && ( <> */}
          <div className='DropdownColumn' ref={categoryDropdown4Ref}>
            <label htmlFor="productTypeSelect">Level 4:</label>
            <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}
                <span className="dropdown-icons">
                <AddOutlinedIcon onClick={() => handlelevel4("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel4(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel4(false)} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
                {hoveredCategoryLevel4 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-4 Category
            </span>
          )}
              </div>
              {islevel4DropdownOpen && (
                <div className="dropdown-options">
                  <input type="text" placeholder="Search category..." value={searchQueryLevel4} onChange={(e) => { setSearchQueryLevel4(e.target.value) }} className="dropdown-search-input" onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel4('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel4?.map(level4 => (
                    <div className="dropdown-option"  onClick={() => { handlelevel4(level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
                      <span>{level4.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {level5Categories.length > 0 && (  <> */}
          <div className='DropdownColumn' ref={categoryDropdown5Ref}>
            <label htmlFor="productTypeSelect">Level 5:</label>
            <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}
                <span className="dropdown-icons">
                <AddOutlinedIcon onClick={() => handlelevel5("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel5(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel5(false)} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
                {hoveredCategoryLevel5 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-5 Category
            </span>
          )}
              </div>
              {islevel5DropdownOpen && (
                <div className="dropdown-options">
                  <input  type="text"  placeholder="Search category..."  value={searchQueryLevel5}  onChange={(e) => { setSearchQueryLevel5(e.target.value) }}  className="dropdown-search-input"  onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel5('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel5?.map(level5 => (
                    <div className="dropdown-option"  onClick={() => { handlelevel5(level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
                      <span>{level5.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* {level6Categories.length > 0 && (  <> */}
          <div className='DropdownColumn' ref={categoryDropdown6Ref}>
            <label htmlFor="productTypeSelect">Level 6:</label>
            <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
              <div className="selected-category">
                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}
                <span className="dropdown-icons">
                  <AddOutlinedIcon onClick={() => handlelevel6("add")}  style={{ cursor: 'pointer', fontSize: 24 }}
              onMouseEnter={() => setHoveredCategoryLevel6(true)} // Set hovered category ID
              onMouseLeave={() => setHoveredCategoryLevel6(false)} />
                  <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                </span>
                {hoveredCategoryLevel6 && (
            <span
              style={{  position: 'absolute',  top: '-28px',  left: '86%',  transform: 'translateX(-50%)',   backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000', }} >
                Add Level-6 Category
            </span>
          )}
              </div>
              {islevel6DropdownOpen && (
                <div className="dropdown-options">
                  <input type="text" placeholder="Search category..." value={searchQueryLevel6} onChange={(e) => { setSearchQueryLevel6(e.target.value) }} className="dropdown-search-input" onClick={(e) => e.stopPropagation()}
                  />
                  <div className="dropdown-option" onClick={() => handlelevel6('')}>
                    <span>Select category</span>
                  </div>
                  {filteredCategoriesLevel6?.map(level6 => (
                    <div className="dropdown-option" onClick={() => { handlelevel6(level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
                      <span>{level6.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
            <AddLevelFive selectedCategoryIdPopup={selectedCategoryIdPopup} selectedLevel2IdPopup={selectedLevel2IdPopup} selectedLevel3IdPopup={selectedLevel3IdPopup} selectedLevel4IdPopup={selectedLevel4IdPopup} categories={categories} refreshCategories={refreshCategories} setIsTyping={setIsTyping} onCloseDialog={closeAddCategoryPopup} />
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

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0px' }}>
            <h3>Products</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {sortVisible && (
                <div className="sort-container" style={{ display: 'flex', flexDirection: 'column', width: '350px' }}>
                  <select
                    onChange={handleSortChange}
                    value={sortOption}
                    className="sort-dropdown"
                    style={{ width: '100%', padding: '7px', fontSize: '15px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#aaa',  }} >
                    <option value="">Sort by Products</option>
                    <option value="newest">Newest Products</option>
                    <option value="oldest">Oldest Products</option>
                  </select>
                </div>
              )}
              {searchVisible && (
                <div style={{ display: 'flex', flexDirection: 'column', width: '500px', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input type="text" placeholder="Search products..." className='search_prods_input' value={searchQuerylist} onChange={handleSearchChange}  />
                    {searchQuerylist && (
                      <button
                        onClick={() => {
                          setSearchQuerylist('');
                          setSuggestions([]);
                          setResponseDatasearch([]);
                          fetchData(true);
                        }}
                        style={{
                          position: 'absolute', right: '6px', background: 'transparent', border: 'none', fontSize: '16px', color: '#aaa', cursor: 'pointer', width: '7%',
                        }}
                      >    ✕     </button>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div
                      style={{  backgroundColor: 'white',  border: '1px solid #ddd',  borderRadius: '4px',  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',  position: 'absolute',  top: '100%',  left: 0,  width: '98%',  maxHeight: '200px',  overflowY: 'auto',  zIndex: 1000,  }}  >
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="suggest_cls"
                          style={{ padding: '8px', cursor: 'pointer', fontSize: '14px', backgroundColor: 'white', borderBottom: '1px solid #f1f1f1', display: 'flex', alignItems: 'center', gap: '10px', }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}  >
                          <span style={{ flex: 1 }}>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <h3 style={{ fontWeight: 'normal', marginLeft: '10px' }}>
              <FontAwesomeIcon
                icon={faSearch}
                onClick={handleSearchClick}
                style={{ cursor: 'pointer', fontSize: '18px', marginRight: '10px' }}    />
              <FontAwesomeIcon
                icon={faSort}
                onClick={handleSortClick}
                style={{ cursor: 'pointer', fontSize: '18px', marginRight: '10px' }}
              />    Total Products: {getFilteredAndSortedProducts().length}  </h3>
          </div>

          <TableContainer
            component={Paper}
            sx={{ margin: '0px 0', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}
          >
            <Table>
              <TableHead style={{background:'#e9e9e9'}}>
                <TableRow>
                  <TableCell
                    align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('image')} >
                    Image
                    {sortOrder.column === 'image' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('mpn')} >
                    MPN
                    {sortOrder.column === 'mpn' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('product_name')} >
                    Product Name
                    {sortOrder.column === 'product_name' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('brand')} >
                    Vendor
                    {sortOrder.column === 'brand' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} onClick={() => handleSort('taxonomy')} >
                    Taxonomy
                    {sortOrder.column === 'taxonomy' && (sortOrder.direction === 'asc' ? ' ↑' : ' ↓')}
                  </TableCell>
                  <TableCell align="left" sx={{ fontWeight: 'bold', fontSize: '14px', padding: '10px', cursor: 'pointer' }} >   Action </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {getFilteredAndSortedProducts().length > 0 ? (
    getFilteredAndSortedProducts().map((product) => (
      <TableRow   key={product.product_id}  sx={{ '&:hover': { backgroundColor: '#f5f5f5' }, cursor: 'pointer' }}  >
        <TableCell sx={{ padding: '15px', fontSize: '14px' }}>
          {Array.isArray(product.image) ? (
            <img src={product.image[0] || Soon} alt={product.product_name} className="product-image-round"
            /> ) : (
            <img src={product.image} alt={product.product_name} className="product-image-round" onClick={() => handleProductSelect(product.product_id)} />   )} </TableCell>
        <TableCell sx={{ padding: '15px', fontSize: '14px' }} onClick={() => handleProductSelect(product.product_id)} >  {product.mpn}  </TableCell>
        <TableCell sx={{ padding: '15px', fontSize: '14px' }} className="product-cell" onClick={() => handleProductSelect(product.product_id)} >  {product.product_name}</TableCell>
        <TableCell sx={{ padding: '15px', fontSize: '14px' }} onClick={() => handleProductSelect(product.product_id)} >  {product.brand} </TableCell>
        <TableCell sx={{ padding: '15px', fontSize: '14px' }} onClick={() => handleProductSelect(product.product_id)}>  {product.category_name} </TableCell>
        <TableCell sx={{ padding: '15px', fontSize: '14px' }} className="others-column">
          <FontAwesomeIcon icon={product.is_active ? faEye : faEyeSlash} onClick={(e) => handleVisibilityToggle(e, product)} style={{ cursor: 'pointer', fontSize: '16px' }}  />
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={6} sx={{ textAlign: 'center', padding: '20px', fontSize: '16px', color: '#888' }}>  No products found for the selected category.  </TableCell>
    </TableRow>
  )}
</TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
};

export default CategoriesTable;
