import React, { useEffect, useState,useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductDetail.css';
import { Button, Modal, Box } from '@mui/material';
import axiosInstance from '../../../../src/utils/axiosConfig';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import Soon from '../../../assets/image_2025_01_02T08_51_07_818Z.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash,faEdit } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill'; // React wrapper for Quill
import 'react-quill/dist/quill.snow.css';

const ProductDetail = ({ categories }) => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [categoryLevel, setCategoryLevel] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [variantData, setVariantData] = useState([]);
    const [view, setView] = useState('productDetail');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedLevel2Id, setselectedLevel2Id] = useState('');
    const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
    const [selectedlevel4, setSelectedlevel4] = useState('');
    const [selectedlevel5, setSelectedlevel5] = useState('');
    const [selectedlevel6, setSelectedlevel6] = useState('');

    const [categoryIdForVariant, setCategoryIdForVariant] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryIds, setCategoryIds] = useState('');

    const [categoryName, setCategoryName] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isupdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
    const [selectedVariants, setSelectedVariants] = useState({
        sku_number: '',
        unfinishedPrice: '',
        finishedPrice: '',
        totalPrice: 0,
        retailPrice: 0,
        quantity: '',
    });
    const [variantOptions, setVariantOptions] = useState([]);
    const [brand, setBrand] = useState([]);
    const quillRef = useRef();
    const [editorReady, setEditorReady] = useState(false);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
    const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
    const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
    const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
    const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
      const categoryDropdownRef = useRef(null);
      const categoryDropdown2Ref = useRef(null);
      const categoryDropdown3Ref = useRef(null);
      const categoryDropdown4Ref = useRef(null);
      const categoryDropdown5Ref = useRef(null);
      const categoryDropdown6Ref = useRef(null);
      useEffect(() => {
        if (editorReady && quillRef.current) {
          const quill = quillRef.current.getEditor();
          quill.keyboard.addBinding({ key: 'Enter' }, function (range, context) {
            const currentLine = quill.getText(range.index - 1, 1);
    
            if (/[a-zA-Z]\.$/.test(currentLine)) {
              const lines = quill.getText().split('\n');
              const subPoints = lines.filter(line => /^[a-zA-Z]\.$/.test(line.trim()));
              const nextLetter = String.fromCharCode(97 + subPoints.length);
              quill.insertText(range.index, '\n' + nextLetter + '. ');
              return false;
            } else {
              quill.insertText(range.index, '\n* ');
              return false;
            }
          });
        }
      }, [editorReady]); // Runs when the editor is ready
    
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
    const [RetailPrice, setShowRetailPrice] = useState([0]);
    const [RetailPriceOption, setShowRetailPriceOption] = useState([]);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    const filteredCategories = categories?.category_list?.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories?.category_list?.find(level1 => level1._id === selectedCategoryId);
    const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';
    const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory?.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)) : categories?.category_list?.flatMap(level1 => level1.level_one_category_list).filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery) );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;
    const filteredCategoriesLevel3 = levelTwoCategory
    ? levelTwoCategory?.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery)) : categories?.category_list?.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 =>
        level3.name.toLowerCase().includes(safeSearchQuery) );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;
    const filteredCategoriesLevel4 = levelThreeCategory ? levelThreeCategory.level_three_category_list.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery)) : categories?.category_list?.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;
    const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery)) : categories?.category_list?.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));

    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;
    const filteredCategoriesLevel6 = levelFiveCategory ? levelFiveCategory.level_five_category_list.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery)) : categories?.category_list?.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));

    const handleSearchChange = (level, value) => {
        setSearchQueries(prev => ({ ...prev, [level]: value }));
    };
    const handleCategorySelectForVariants = async (id, category_name) => {
        setCategoryId(id);
        setCategoryIds(id);
        setCategoryName(category_name);
        // setSelectedCategoryForVariant(id);
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        setselectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };
    const handleLevel2Select = (id) => {
        const selectedValue = id;
        if (selectedValue !== '') {
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
            setselectedLevel2Id(selectedValue);
            setSelectedLevel3Id('');
            setSelectedlevel4('');
            setSelectedlevel5('');
            setSelectedlevel6('');
            setIsLevel2DropdownOpen(false);
        }
        else {
            setselectedLevel2Id('');
        }
    };
    const handleLevel3Select = (id) => {
        const selectedValue = id;
        if (selectedValue !== '') {
            let level1Category, level2Category;
            categories.category_list.some(level1 => {
                const foundLevel2 = level1.level_one_category_list.find(level2 =>
                    level2.level_two_category_list.some(level3 => level3._id === selectedValue));
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
            setselectedLevel2Id(level2Category._id);
            setSelectedLevel3Id(selectedValue);
            setSelectedlevel4('');
            setSelectedlevel5('');
            setSelectedlevel6('');
            setIsLevel3DropdownOpen(false);
        }
        else {
            setSelectedLevel3Id('');
        }
    };
    const handleLevelSelect = (level, id) => {
        const selectedValue = id || '';        
        if (selectedValue !== '') {
            switch (level) {
                case 4:
                    let level1Category, level2Category, level3Category;
                    categories.category_list.some(level1 => {
                        const foundLevel2 = level1.level_one_category_list.find(level2 => 
                            level2.level_two_category_list.some(level3 => 
                                level3.level_three_category_list.some(level4 => level4._id === selectedValue)
                            )
                        );
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
                    setselectedLevel2Id(level2Category._id);
                    setSelectedLevel3Id(level3Category._id);
                    setSelectedlevel4(selectedValue);
                    setSelectedlevel5('');
                    setSelectedlevel6('');
                    break;
    
                case 5:
                    let level4Category, level3CategoryForLevel5, level2CategoryForLevel5, level1CategoryForLevel5;
                    categories.category_list.some(level1 => {
                      return level1.level_one_category_list.some(level2 => {
                        return level2.level_two_category_list.some(level3 => {
                          return level3.level_three_category_list.some(level4 => {
                            if (level4.level_four_category_list.some(level5 => level5._id === selectedValue)) {
                              level1CategoryForLevel5 = level1;
                              level2CategoryForLevel5 = level2;
                              level3CategoryForLevel5 = level3;
                              level4Category = level4;
                              return true;  }
                            return false;
                          });
                        });
                      });
                    });
                    if (!level1CategoryForLevel5 || !level2CategoryForLevel5 || !level3CategoryForLevel5 || !level4Category) {
                      console.error('Parent categories not found for Level 5 category with ID:', selectedValue);
                      return;
                    }
                    setSelectedCategoryId(level1CategoryForLevel5._id);
                    setselectedLevel2Id(level2CategoryForLevel5._id);
                    setSelectedLevel3Id(level3CategoryForLevel5._id);
                    setSelectedlevel4(level4Category._id);
                    setSelectedlevel5(selectedValue);
                    break;
                case 6:
                    let level5Category, level4CategoryForLevel6, level3CategoryForLevel6, level2CategoryForLevel6, level1CategoryForLevel6;
                    categories.category_list.some(level1 => {
                      return level1.level_one_category_list.some(level2 => {
                        return level2.level_two_category_list.some(level3 => {
                          return level3.level_three_category_list.some(level4 => {
                            return level4.level_four_category_list.some(level5 => {
                              if (level5.level_five_category_list.some(level6 => level6._id === selectedValue)) {
                                level1CategoryForLevel6 = level1;
                                level2CategoryForLevel6 = level2;
                                level3CategoryForLevel6 = level3;
                                level4CategoryForLevel6 = level4;
                                level5Category = level5;
                                return true;
                              }
                              return false;
                            });
                          });
                        });
                      });
                    });
                    if (!level1CategoryForLevel6 || !level2CategoryForLevel6 || !level3CategoryForLevel6 || !level4CategoryForLevel6 || !level5Category) {
                      console.error('Parent categories not found for Level 6 category with ID:', selectedValue);
                      return;
                    }
                    setSelectedCategoryId(level1CategoryForLevel6._id);
                    setselectedLevel2Id(level2CategoryForLevel6._id);
                    setSelectedLevel3Id(level3CategoryForLevel6._id);
                    setSelectedlevel4(level4CategoryForLevel6._id);
                    setSelectedlevel5(level5Category._id);
                    setSelectedlevel6(selectedValue);
                    break;
                
                default:
                    break;
            }
        } else {
            switch (level) {
                case 4:
                    setSelectedlevel4('');
                    break;
                case 5:
                    setSelectedlevel5('');
                    break;
                case 6:
                    setSelectedlevel6('');
                    break;
                default:
                    break;
            }
        }
    };
    const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : [];
    const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
    const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
    const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
    const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
    const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
    const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
    const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
    const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
    if (!level6Categories) {
        console.log(level6Categories);
    }
    const fetchProductDetail = async (productId) => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainProductDetails/`, { id: productId, });
            if (response.data && response.data.data) {
                const productCategory = response.data.data.category_level;
                const RetailPrice = response.data.data.category_brand_price.price;
                const RetailPriceOption = response.data.data.category_brand_price.price_option;
                setShowRetailPrice(RetailPrice);
                setShowRetailPriceOption(RetailPriceOption);
                const productObj = response.data.data.product_obj;
                setCategoryIds(response.data.data.category_id);
                setCategoryIdForVariant(response.data.data.category_id);
                if (response.data.data.category_name === 'level-1') {
                    handleCategorySelect(response.data.data.category_id);
                }
                if (response.data.data.category_name === 'level-2') {
                    handleLevel2Select(response.data.data.category_id);
                }
                if (response.data.data.category_name === 'level-3') {
                    handleLevel3Select(response.data.data.category_id);
                }
                if (response.data.data.category_name === 'level-4') {
                    handleLevelSelect('level-4', response.data.data.category_id);
                }
                if (response.data.data.category_name === 'level-5') {
                    handleLevelSelect('level-5', response.data.data.category_id);
                }
                if (response.data.data.category_name === 'level-6') {
                    handleLevelSelect('level-6', response.data.data.category_id);
                }
                setCategoryLevel(productCategory);
                setFormData(productObj);
                setOriginalData(productObj);
            } else {
                setError('Product not found');
            }

            const variantResponse = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainAllVarientList/`, {
                product_id: productId,
            });
            if (variantResponse.data && variantResponse.data.data) {
                setVariantData(variantResponse.data.data || []);
            }
            try {
                const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
                setBrand(res.data.data.brand_list);
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
        } catch (err) {
            console.log(err, 'err');
            setError('Error fetching product details');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (productId) {
            fetchProductDetail(productId);
        }
    }, [productId]);
    const fetchVariantDetail = async () => {
        try {
            const variantResponse = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainAllVarientList/`, {   product_id: productId,  });
            if (variantResponse.data && variantResponse.data.data) {      setVariantData(variantResponse.data.data || []);   }
        } catch (err) {    setError('Error fetching product details 2');   } finally {      setLoading(false);   } };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, });
        if (JSON.stringify(formData) !== JSON.stringify(originalData)) {
            setUnsavedChanges(true);
        }
    };
    const [mainImage, setMainImage] = useState(Soon);
    useEffect(() => {
        if (Array.isArray(formData.image) && formData.image.length > 0) {
            setMainImage(formData.image[0]);
        }
    }, [formData.image]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (view !== 'taxonomy' && view !== 'variants') {
            if (JSON.stringify(formData) === JSON.stringify(originalData)) {
                Swal.fire({
                    title: 'Warning!',
                    text: 'Please edit something! No changes detected',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                    customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel'  }
                });
                return;
            }
            try {
                const payload = {
                    id: formData.product_id || '',
                    update_obj: {  product_name: formData.product_name,  url: formData.url,  base_price: formData.base_price,  breadcrumb: formData.breadcrumb,  mpn: formData.mpn,  brand_id: formData.brand_id,  tags: formData.tags,  key_features: formData.key_features,  msrp: formData.msrp,   height: formData.height, width: formData.width, depth: formData.depth,length: formData.length, unit: formData.unit, features: formData.features,  long_description: formData.long_description,  short_description: formData.short_description,  attributes: formData.attributes,option_str:formData.option_str,features_notes:formData.features_notes, model: formData.model,  upc_ean: formData.upc_ean,
                    }
                };
                await axiosInstance.put(`${process.env.REACT_APP_IP}/productUpdate/`, payload);
                Swal.fire({
                    title: 'Success!', text: 'Product updated successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
                    }
                }).then(() => {
                    fetchProductDetail(productId);
                });
                setFormData('');
            } catch (err) {
                alert('Error updating product');
            }
        }
        setUnsavedChanges(false); 
    };

    const handleBackClick = () => {
        let categoryId = localStorage.getItem("categoryId");
        let category_level = localStorage.getItem("levelCategory");
        if (categoryId && category_level) {
          const params = new URLSearchParams();
          params.set('categoryId', categoryId);
          params.set('level', category_level);
                navigate(`/Admin/categorylist?${params.toString()}`);
        } else {
          console.log("Category ID or level not found in localStorage");
           navigate(`/Admin`);
        }
      };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    const swapProductToCategory = async () => {
        if (categoryIds) {
            try {
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateTaxonomyForProduct/`, {  product_id: productId,  category_id: categoryId,  category_level: categoryName
                });
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Success!', text: 'Category updated successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel' }
                    })
                    setCategoryIds('');
                    setCategoryName('');
                    setCategoryIdForVariant(categoryId);
                } else {
                    alert('Failed to update category');
                }
            } catch (error) {
                console.error('Error updating category:', error);
                alert('Error updating category');
            }
        } else if (view === 'taxonomy') {
            alert('Please selected the category to updated');
        }
    };
    const handleVariantDetailChange = (e) => {
        const { name, value } = e.target;

        setSelectedVariants((prevVariants) => {
            const updatedVariants = { ...prevVariants };
            updatedVariants[name] = value;
            if (RetailPriceOption === 'finished_price' && name === 'finishedPrice') {
                updatedVariants.retailPrice = RetailPrice * parseFloat(value || 0);
            }
            else if (RetailPriceOption === 'unfinished_price' && name === 'unfinishedPrice') {
                updatedVariants.retailPrice = RetailPrice * parseFloat(value || 0);
            }
            return updatedVariants;
        });
    };
    const handleVariantChange = (typeId, optionId) => {        
        setSelectedVariants((prev) => ({
            ...prev,
            [typeId]: optionId,
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (selectedVariants.sku !== '') {
            try {
                const options = variantOptions
                    .map((variant) => {
                        const selectedOption = selectedVariants[variant.type_id];
                        if (selectedOption) {
                            return {
                                option_name_id: variant.type_id,
                                option_value_id: selectedOption,
                            };
                        }
                        return null;
                    })
                    .filter((option) => option !== null);
                const res = await axiosInstance.post(`${process.env.REACT_APP_IP}/createAndAddVarient/`, {
                    product_id: productId,
                    varient_obj: {
                        sku_number: selectedVariants.sku,
                        un_finished_price: selectedVariants.unfinishedPrice,
                        finished_price: selectedVariants.finishedPrice,
                        retail_price: selectedVariants.retailPrice,
                        total_price: RetailPrice,
                        quantity: selectedVariants.quantity,
                        options: options,
    
                    },
                });
                const resd = res.data.data.status;
                if (resd === true) {
                    Swal.fire({
                        title: 'Success!', text: 'Sucessfully variants added!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel' }
                    })
                    fetchVariantDetail();
                }
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
            setIsPopupOpen(false);
        }
        else{
            Swal.fire({
                title: 'Warning!',
                text: 'Please Enter the SKU to add variant!',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    container: 'swal-custom-container',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel'
                }
            });
        }
      
    };
    const handleAddVariantClick = async () => {
        setSelectedVariants({
            sku: '',
            unfinishedPrice: '',
            finishedPrice: '',
            retailPrice: 0,
            quantity: '',
        });
        setIsPopupOpen(true);
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${categoryIdForVariant}`);
            setVariantOptions(res.data.data.varient_list);
        } catch (err) {
            console.error('Error fetching variants:', err);
        }
    };
    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const handleThumbnailClick = (image) => {
        setMainImage(image);
    };
    const handleScrollNext = () => {
        const container = document.querySelector(".thumbnail-section");
        container.scrollLeft += 120; // Adjust scroll distance
    };

    const handleScrollPrev = () => {
        const container = document.querySelector(".thumbnail-section");
        container.scrollLeft -= 120; // Adjust scroll distance
    };
    const handleNavigation = (targetView) => {        
        if (unsavedChanges) {
          const shouldNavigate = window.confirm("You have some unsaved changes, do you want to continue?");
          if (!shouldNavigate)   return; // Don't change the view
        else { setFormData(originalData); setUnsavedChanges(false); }
        }
        setView(targetView);
      };
      const formatFeature = (feature) => {
        if (feature && !feature.trim().startsWith('*')) {
          return `* ${feature}`;
        }
        return feature;
      };
      const handleVisibilityToggle = async (e, variant) => {
        e.stopPropagation(); // Prevent click propagation if necessary
        // Toggle the visibility based on the current state of `is_active`
        const updatedVisibility = !variant.is_active;
        // Update local state immediately
        console.log(updatedVisibility,'updatedVisibility');
        console.log(variant.id,'updatedVisibility');
        console.log(`Visibility toggled for variant: ${variant.sku_number} to ${updatedVisibility ? 'Visible' : 'Invisible '}`);
        // Show confirmation dialog with SweetAlert
        Swal.fire({
          title: "Are you sure?",
          text: `You have ${updatedVisibility ? 'enabled' : 'disabled'} changes. Are you sure you want to ${updatedVisibility ? 'enable' : 'disable'} the selected variant?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: `Yes, ${updatedVisibility ? 'enable' : 'disable'} it`,
          cancelButtonText: "No, stay",
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
          }
        }).then((result) => {
          // If the user clicks "Yes", then call the API to update the product status
          if (result.isConfirmed) {
            const payload = { id: variant.id, is_active: updatedVisibility };
            // Call the API to update product visibility in the backend
            axiosInstance.post(`${process.env.REACT_APP_IP}/UpdateVarientActiveInActive/`, payload)
              .then((response) => {
                if (response.data && response.data.data && response.data.data.is_update) {
                  // After successful update, optionally refetch data or update UI
                  fetchVariantDetail();
                  Swal.fire({
                    title: 'Success!',
                    text: `The variant has been ${updatedVisibility ? 'enabled' : 'disabled'}.`,
                    icon: 'success',
                    customClass: {
                      container: 'swal-custom-container',
                      popup: 'swal-custom-popup',
                      title: 'swal-custom-title',
                      confirmButton: 'swal-custom-confirm',
                      cancelButton: 'swal-custom-cancel'
                    }
                  });
                } else {
                  alert("Unexpected response structure");
                }
              })
              .catch((err) => {
                setError(err.message);
                Swal.fire({
                  title: 'Error',
                  text: 'There was an issue updating the variant status.',
                  icon: 'error',
                  customClass: {
                    container: 'swal-custom-container',
                    popup: 'swal-custom-popup',
                    title: 'swal-custom-title',
                    confirmButton: 'swal-custom-confirm',
                    cancelButton: 'swal-custom-cancel'
                  }
                });
              })
              .finally(() => {
                setLoading(false);
              });
          } else {
            Swal.fire({
              title: 'Cancelled',
              text: 'No changes were made.',
              icon: 'info',
              customClass: {
                container: 'swal-custom-container',
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel'
              }
            });
          }
        });
      };
      const handleEditClick = async(variant) => {
        console.log(variant,'Varaint fuill data');
        setSelectedVariants({
          id:variant.id,
          sku: variant.sku_number,
          unfinishedPrice: variant.un_finished_price,
          finishedPrice: variant.finished_price,
          retailPrice: variant.retail_price,
          quantity: variant.quantity || 0,
          options:variant.varient_option_list
        });
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${categoryIdForVariant}`);
            setVariantOptions(res.data.data.varient_list);
        } catch (err) {
            console.error('Error fetching variants:', err);
        }
        setIsUpdatePopupOpen(true);  // Open the modal
      };
      const handleUpdateFormSubmit = async (e) => {
        e.preventDefault();
        const options = variantOptions
        .map((variant) => {
            const selectedOption = selectedVariants[variant.type_id];
            if (selectedOption) {
                return {
                    option_name_id: variant.type_id,
                    option_value_id: selectedOption,
                };
            }
            return null;
        })
        .filter((option) => option !== null);
        try {
          setLoading(true);
          const response = await axiosInstance.post( `${process.env.REACT_APP_IP}/VarientUpdate/`,  {
            id:selectedVariants.id,
            sku: selectedVariants.sku,
            unfinishedPrice: selectedVariants.unfinishedPrice,
            finishedPrice: selectedVariants.finishedPrice,
            retailPrice: selectedVariants.retailPrice,
            quantity: selectedVariants.quantity,
            options: options,}  );
          if (response.data && response.data.data && response.data.data.is_updated) {
            fetchVariantDetail(); // Re-fetch the data after updating
            Swal.fire({
              title: 'Success!',
              text: 'Variant data has been updated successfully.',
              icon: 'success',
              customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
              }
            });
            setIsUpdatePopupOpen(false);  // Close the modal after successful update
          } else {
            alert('Unexpected response structure');
          }
        } catch (err) {
          setError(err.message);
          Swal.fire({
            title: 'Error',
            text: 'There was an issue updating the variant data.',
            icon: 'error',
            customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
              }
          });
        } finally {
          setLoading(false);
        }
      };
      const handleTextareaChange = (e, fieldName) => {
        const { name, value } = e.target;
        if (e.key === ' ') {
            e.preventDefault(); // Prevent default space action
            const cursorPosition = e.target.selectionStart;
            const updatedValue = value.slice(0, cursorPosition) + ' ' + value.slice(cursorPosition); 
            handleChange({ target: { name, value: updatedValue, }, });
        } else if (e.key === 'Enter') {
            e.preventDefault(); // Prevent default Enter action
            const cursorPosition = e.target.selectionStart;
            const updatedValue = value.slice(0, cursorPosition) + '\n* ' + value.slice(cursorPosition); 
            handleChange({ target: { name, value: updatedValue, }, });
        }
    };    
    const handlePaste = (e, fieldName) => {
        const { name } = e.target;
        e.preventDefault(); // Prevent the default paste behavior
        const pastedText = e.clipboardData.getData('text');
        const formattedText = pastedText.split('\n').map(line => `* ${line.trim()}`) .join('\n');
        handleChange({ target: { name, value: formattedText, },
        });
    };
      const handleEditorChange = (value) => {
        handleChange({
          target: {
            name: 'option_str',
            value,
          },
        });
      };
      const handleEditorReady = () => {
        setEditorReady(true);
      };
    return (
        <div>
            <div className='section_container'>
                <div className="section_sidebar">
                    <button onClick={handleBackClick} className="back-button">← Back to Products</button>
                    <div className="section-buttons">
            <button onClick={() => handleNavigation('productDetail')} className={view === 'productDetail' ? 'productDetail active' : 'productDetail'}>Product Detail</button>
            <button onClick={() => handleNavigation('taxonomy')} className={view === 'taxonomy' ? 'taxonomy active' : 'taxonomy'}>Taxonomy</button>
            <button onClick={() => handleNavigation('variants')} className={view === 'variants' ? 'variants active' : 'variants'}>Variants & Pricing</button>
            <button onClick={() => handleNavigation('keyDetails')} className={view === 'keyDetails' ? 'keyDetails active' : 'keyDetails'}>Key Details</button>
            <button onClick={() => handleNavigation('rawData')} className={view === 'rawData' ? 'rawData active' : 'rawData'}>Raw Data</button>
            <button onClick={() => handleNavigation('options')} className={view === 'options' ? 'options active' : 'options'}>Options</button>
          </div>
                </div>
            </div>
            <div className="product-detail">
                <form onSubmit={handleSubmit} className="product-edit-form">
                    <div className="product-edit-container">

                        {view === 'productDetail' && (
                            <div className="product-info-section">
                                <div className="product-image-section">
                                    <div className="main-product-image">
                                        <img src={mainImage} alt="Main Product" className="product-image-large"  />
                                    </div>
                                    <div className="thumbnail-container">
                                        {formData.image && (
                                            formData.image.length > 2 && (
                                                <span
                                                    className="thumbnail-scroll-btn prev-btn"
                                                    onClick={handleScrollPrev} >    &lt; </span>
                                            )
                                        )}
                                        <div className="thumbnail-section">
                                            {Array.isArray(formData.image) &&
                                                formData.image.map((image, index) => (
                                                    <img  key={index}  src={image}  alt={`Thumbnail ${index + 1}`}  className={`product-thumbnail ${mainImage === image ? "active-thumbnail" : ""
                                                            }`}
                                                        onClick={() => handleThumbnailClick(image)}   />
                                                ))}
                                        </div>
                                        {formData.image && (
                                            formData.image.length > 2 && (
                                                <span
                                                    className="thumbnail-scroll-btn next-btn"
                                                    onClick={handleScrollNext}
                                                >    &gt;  </span> )
                                        )}
                                    </div>
                                </div>
                                <div className="product-detail-section">
                                    <div className="CategoryTable-header-edit">
                                        <h3>Edit Product Details</h3>
                                        {categoryLevel && (
                                            <span className='categoryLevel'>{categoryLevel}</span>   )}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="mpn">MPN</label>
                                        <input type="text" id="mpn" className='input_pdps' name="mpn" value={String(formData.mpn || '')} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="product_name">Product Name</label>
                                        <input type="text" id="product_name" className='input_pdps' name="product_name" value={formData.product_name ? formData.product_name.toLowerCase().replace(/^(\w)/, (match) => match.toUpperCase()) : ''} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="brand">Vendor</label>
                                        <select
                                            id="brand-select"
                                            name="brand_id"
                                            value={String(formData.brand_id || '')}
                                            onChange={(e) => {
                                                const selectedOption = brand.find(item => item.id === Number(e.target.value));
                                                handleChange({
                                                    target: {
                                                        name: 'brand_id',
                                                        value: e.target.value,
                                                        brand_name: selectedOption ? selectedOption.name : '',
                                                    }
                                                });
                                            }}
                                            className="dropdown"
                                            style={{ width: '100%', margin: '6px 4px 6px 2px',border:'1px solid #ccc',borderRadius:'4px', }}  >
                                            {brand.map((item) => (
                                                <option value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* <div className="form-group">
                                        <label htmlFor="base_price">Base Price</label>
                                        <input type="text" id="base_price" className='input_pdps' name="base_price" value={String(`$${formData.base_price}` || '')}
                                            onChange={(e) => {
                                                const inputValue = e.target.value.replace(/[^0-9.]/g, '');
                                                handleChange({
                                                    target: {
                                                        name: 'base_price',
                                                        value: inputValue,
                                                    },
                                                });
                                            }}
                                        />
                                    </div> */}
                                    <div className="form-group">
                                        <label htmlFor="model">Model</label>
                                        <input type="text" id="model" className='input_pdps' name="model" value={formData.model ? formData.model.toLowerCase().replace(/^(\w)/, (match) => match.toUpperCase()) : ''} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="upc_ean">UPC_EAN</label>
                                        <input type="text" id="upc_ean" name="upc_ean" className='input_pdps' value={String(formData.upc_ean || '')} onChange={handleChange}   />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dimensions">Dimensions</label>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="height" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Height</label>
                                                <input type="text" id="height" name="height" className="dimensions" style={{ width: '60%' }} value={String(formData.height || '')} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="width" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Width</label>
                                            <input type="text" id="width" name="width" className="dimensions" style={{ width: '60%' }} value={String(formData.width || '')} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="depth" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Depth</label>
                                                <input type="text" id="depth" name="depth" className="dimensions" style={{ width: '60%' }} value={String(formData.depth || '')} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="length" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Length</label>
                                                <input type="text" id="length" name="length" className="dimensions" style={{ width: '60%' }} value={String(formData.length || '')} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="unit" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}} >Unit</label>
                                                <select id="unit" name="unit" className="dimensions-unit" style={{ width: '80%' }} value={formData.unit || ''} onChange={handleChange} >
                                                    <option value="in">Inches - in</option>
                                                    <option value="mm">Millimeters -mm</option>
                                                    <option value="ft">Feet - ft</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {view === 'taxonomy' && (
                            <div className="taxonomy-section" >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px', borderBottom:'2px solid #007bff' }}>
                                    <h3>Taxonomy</h3>
                                    <div className="product-info-display">
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>MPN: </label>
                                            <span>{formData.mpn ? formData.mpn : 'N/A'}</span>
                                        </div>
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>Product Name: </label>
                                            <span>{formData.product_name ? formData.product_name : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='DropdownsContainer'>
                                    {/* Level 1 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdownRef}>
                                        <label htmlFor="categorySelect">Level 1:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {isCategoryDropdownOpen && (
                                                <div className="dropdown-options" >
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level1}
                                                        onChange={(e) => handleSearchChange('level1', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleCategorySelect('')}>
                                                        <span>Select Category</span>
                                                    </div>
                                                    {filteredCategories.map(level1 => (
                                                        <div className=" dropdown-option" key={level1._id || ''} onClick={() => {
                                                            handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1');
                                                        }} >
                                                            <span>{level1.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 2 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdown2Ref}>
                                        <label htmlFor="sectionSelect">Level 2:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {isLevel2DropdownOpen && (
                                                <div className="dropdown-options" >
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level2}
                                                        onChange={(e) => handleSearchChange('level2', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleLevel2Select('')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel2?.map(level2 => (
                                                        <div className=" dropdown-option" key={level2._id || ''} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
                                                            <span>{level2.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 3 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdown3Ref}>
                                        <label htmlFor="productTypeSelect">Level 3:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {isLevel3DropdownOpen && (
                                                <div className="dropdown-options">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level3}
                                                        onChange={(e) => handleSearchChange('level3', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleLevel3Select('')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel3?.map(level3 => (
                                                        <div className=" dropdown-option" key={level3._id || ''} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
                                                            <span>{level3.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 4 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdown4Ref}>
                                        <label htmlFor="level4Select">Level 4:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel4DropdownOpen && (
                                                <div className="dropdown-options">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level4}
                                                        onChange={(e) => handleSearchChange('level4', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleLevelSelect(4, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel4?.map(level4 => (
                                                        <div className=" dropdown-option" key={level4._id || ''} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
                                                            <span>{level4.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 5 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdown5Ref}>
                                        <label htmlFor="level5Select">Level 5:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel5DropdownOpen && (
                                                <div className="dropdown-options">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level5}
                                                        onChange={(e) => handleSearchChange('level5', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleLevelSelect(5, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel5?.map(level5 => (
                                                        <div className=" dropdown-option" key={level5._id || ''} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
                                                            <span>{level5.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 6 Dropdown */}
                                    <div className='DropdownColumn' ref={categoryDropdown6Ref}>
                                        <label htmlFor="level6Select">Level 6:</label>
                                        <div className="custom-dropdown custom-width" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel6DropdownOpen && (
                                                <div className="dropdown-options">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level6}
                                                        onChange={(e) => handleSearchChange('level6', e.target.value)}
                                                        className="dropdown-search-input pdp-search"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option" onClick={() => handleLevelSelect(6, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel6?.map(level6 => (
                                                        <div className=" dropdown-option" key={level6._id || ''} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
                                                            <span>{level6.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'variants' && (
                            <div className="variant-section">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px', borderBottom:'2px solid #007bff' }}>
                                    <h3>Product Variants</h3>
                                    <div className="product-info-display">
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>MPN: </label>
                                            <span>{formData.mpn ? formData.mpn : 'N/A'}</span>
                                        </div>
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>Product Name: </label>
                                            <span>{formData.product_name ? formData.product_name : 'N/A'}</span>
                                        </div>
                                    </div>
                                    <button className='cls_addvariant'
                                        variant="contained"
                                        color="primary"
                                        sx={{ position: 'relative', top: '20px', right: '20px', margin: 0, }}
                                        onClick={handleAddVariantClick}>
                                        Add Variant Option
                                    </button>
                                </div>
                                <table className="variant-table pdp-variant-table">
                                    <thead>
                                        <tr>
                                            <th>Variant SKU</th>
                                            <th>Unfinished Price</th>
                                            <th>Finished Price</th>
                                            <th>Retail Price</th>
                                            <th>Options</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantData.map((variant) => (
                                            <tr>
                                                <td>{variant.sku_number}</td>
                                                <td>{variant.un_finished_price ? `$${parseFloat(variant.un_finished_price).toFixed(2)}` : ''}</td>
                                                <td>{variant.finished_price ? `$${parseFloat(variant.finished_price).toFixed(2)}` : ''}</td>
                                                <td>{variant.retail_price ? `$${parseFloat(variant.retail_price).toFixed(2)}` : ''}</td>
                                                <td>
                                                    {variant.varient_option_list.map((option, index) =>
                                                        option.type_value ? (
                                                            <div key={index}>{option.type_name}: {option.type_value}</div>
                                                        ) : null
                                                    )}
                                                </td>
                                                <td className="others-column">
                                                     <FontAwesomeIcon
                                                                      icon={variant.is_active ? faEye : faEyeSlash}
                                                                      onClick={(e) => handleVisibilityToggle(e, variant)}
                                                                      style={{ cursor: 'pointer', fontSize: '16px' }}
                                                                    />
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                        onClick={() => handleEditClick(variant)}
                                                        style={{ cursor: 'pointer', fontSize: '16px', marginLeft: '10px' }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Modal open={isPopupOpen} onClose={handleClosePopup}  aria-labelledby="variant-modal-title" aria-describedby="variant-modal-description" className="variant_model_pdp" >
                                    <Box  sx={{
                                            width: 450, padding: 2, maxHeight: '90vh', overflowY: 'auto', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', top: '1%', position: 'absolute', left: '50%', transform: 'translateX(-50%)', boxShadow: 3,
                                        }}    >
                                        <h3 id="variant-modal-title" style={{ textAlign: 'center', margin: '0' }}>Variant Details</h3>
                                        <form onSubmit={handleFormSubmit}>
                                        <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>SKU <span className="required">*</span></label>
                                        <input type="text" name="sku" className="input_pdp" value={selectedVariants.sku} onChange={handleVariantDetailChange}  />
                                            <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Unfinished Price <span className="required">*</span></label>
                                            <input type="text" name="sku" className="input_pdp" value={selectedVariants.unfinishedPrice || ''}  onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        handleVariantDetailChange({ target: { name: 'unfinishedPrice', value } });
                                                    }  }}  />
                                            <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Finished Price <span className="required">*</span></label>
                                            <input  type="text"  name="finishedPrice"  className="input_pdp"  value={selectedVariants.finishedPrice}  onChange={(e) => {  const value = e.target.value;    if (/^\d*\.?\d{0,2}$/.test(value)) {  handleVariantDetailChange({ target: { name: 'finishedPrice', value } });  } }}  />
                                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Retail Price <span className="required">*</span></label>
                                                {RetailPrice === 1 ? (
                                                    <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>  {RetailPrice ? `${RetailPrice}X ` : '0X'}(by default)</label>
                                                ) : (
                                                    <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>  {RetailPrice ? `${RetailPrice}X` : '0X'}</label>
                                                )}
                                            </div>
                                            <input type="text" className="input_pdp"  name="totalPrice" value={parseFloat(selectedVariants.retailPrice || 0).toFixed(2)} readOnly />
                                            <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Quantity <span className="required">*</span></label>
                                            <input type="number" name="quantity" className="input_pdp" value={selectedVariants.quantity}  onChange={(e) => { const value = e.target.value; if (/^\d*$/.test(value)) {  handleVariantDetailChange({ target: { name: 'quantity', value } });  } }} onWheel={(e) => e.target.blur()} />
                                            {variantOptions?.map((variant) => (
                                                <div key={variant.type_id}>
                                                      <label htmlFor="totalPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>{variant.type_name}  {variant.type_name.toLowerCase().includes("wood type") && (
        <span className="required" style={{ color: 'red' }}>*</span> )}</label>
                                                    <select id="brand-select" name="brand_id" required={variant.type_name.toLowerCase().includes("wood type")} value={selectedVariants[variant.type_id] || ''} onChange={(e) => handleVariantChange(variant.type_id, e.target.value)} className="dropdown" style={{ width: '100%', margin: '6px 0px 6px 0px',padding:'10px 0px 10px 0px',border:'1px solid #ccc',borderRadius:'4px',color:'rgba(0, 0, 0, 0.6)' }} >
                                                        <option value="">Select Variant Value</option>
                                                        {variant.option_value_list?.map((option) => (
                                                            <option value={option.type_value_id}>
                                                                {option.type_value_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            ))}
                                            <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', marginTop: 2 }}  >
                                                Save Variant
                                            </Button>
                                        </form>
                                    </Box>
                                </Modal>
                                <Modal open={isupdatePopupOpen} onClose={() => setIsUpdatePopupOpen(false)}   aria-labelledby="variant-modal-title" aria-describedby="variant-modal-description" className="variant_model_pdp"  >
        <Box sx={{
          width: 450, padding: 2, maxHeight: '90vh', overflowY: 'auto', margin: 'auto', backgroundColor: 'white', borderRadius: '8px', top: '1%', position: 'absolute', left: '50%', transform: 'translateX(-50%)', boxShadow: 3,  }}>
          <h3 id="variant-modal-title" style={{ textAlign: 'center', margin: '0' }}>Variant Details</h3>
          <form onSubmit={handleUpdateFormSubmit}>
            <label htmlFor="sku" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>SKU <span className="required">*</span></label>
            <input  type="text"  name="sku"  className="input_pdp"  value={selectedVariants.sku}  onChange={handleVariantDetailChange}
            />
            <label htmlFor="unfinishedPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Unfinished Price <span className="required">*</span></label>
            <input type="text" name="unfinishedPrice" className="input_pdp" value={selectedVariants.unfinishedPrice || ''}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleVariantDetailChange({ target: { name: 'unfinishedPrice', value } });
                }
              }}  />
            <label htmlFor="finishedPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Finished Price <span className="required">*</span></label>
            <input type="text" name="finishedPrice" className="input_pdp" value={selectedVariants.finishedPrice}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) {
                  handleVariantDetailChange({ target: { name: 'finishedPrice', value } });
                }
              }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="retailPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Retail Price <span className="required">*</span></label>
              <label htmlFor="retailPrice" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>
                {RetailPrice === 1 ? `${RetailPrice}X` : '0X'}
              </label>
            </div>
            <input type="text" className="input_pdp" name="retailPrice" value=  {parseFloat(selectedVariants.retailPrice || 0).toFixed(2)}  readOnly  />
            <label htmlFor="quantity" style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>Quantity <span className="required">*</span></label>
            <input type="number" name="quantity" className="input_pdp" value={selectedVariants.quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {  handleVariantDetailChange({ target: { name: 'quantity', value } });   }   }}     onWheel={(e) => e.target.blur()}  />
             {variantOptions?.map((variant) => (
        <div key={variant.type_id}>
          <label htmlFor={variant.type_id} style={{ margin: "0px 0px 0px 1px", color: 'rgba(0, 0, 0, 0.6)' }}>
            {variant.type_name} {variant.type_name.toLowerCase().includes("wood type") && (
              <span className="required" style={{ color: 'red' }}>*</span>
            )}
          </label>
          <select  
            id={`variant-select-${variant.type_id}`}
            name={variant.type_id}
            required={variant.type_name.toLowerCase().includes("wood type")}
            value={selectedVariants[variant.type_id] || ''} // Preselect the option based on selectedVariants
            onChange={(e) => handleVariantChange(variant.type_id, e.target.value)}
            className="dropdown"
            style={{  width: '100%',  margin: '6px 0px 6px 0px',  padding: '10px 0px 10px 0px',  border: '1px solid #ccc',  borderRadius: '4px',  color: 'rgba(0, 0, 0, 0.6)', }}  >
            <option value="">Select Variant Value</option>
            {variant.option_value_list?.map((option) => (
              <option value={option.type_value_id} key={option.type_value_id}>
                {option.type_value_name}
              </option>
            ))}
          </select>
        </div>
      ))}
            <Button type="submit" variant="contained" color="primary" sx={{ width: '100%', marginTop: 2 }}>   Update Variant </Button> </form>  </Box>
      </Modal>          </div>
                        )}
                        {/* {view === 'pricing' && (
                            <div className="pricing-section">
                                <h3>Pricing Details</h3>
                                <div className="form-group">
                                    <label htmlFor="msrp">MSRP</label>
                                    <input type="text" id="msrp" name="msrp" className='input_pdps'
                                        value={String(`$${formData.msrp}` || '')}
                                        // onChange={handleChange} required 
                                        onChange={(e) => {
                                            const inputValue = e.target.value.replace(/[^0-9.]/g, '');
                                            handleChange({
                                                target: {
                                                    name: 'msrp',
                                                    value: inputValue,
                                                },
                                            });
                                        }}
                                    />
                                </div>
                            </div>
                        )} */}
                        {view === 'keyDetails' && (
                            <div className="other-details-section">
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px', borderBottom:'2px solid #007bff' }}>
                                <h3>Other Product Details</h3>
                                <div className="product-info-display">
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>MPN: </label>
                                            <span>{formData.mpn ? formData.mpn : 'N/A'}</span>
                                        </div>
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>Product Name: </label>
                                            <span>{formData.product_name ? formData.product_name : 'N/A'}</span>
                                        </div>
                                    </div>
                                    </div>
                                <div className="form-group">
                                    <label htmlFor="key_features">Key Features</label>
                                    <textarea
                                        id="key_features"
                                        name="key_features"
                                        className="input_pdps"
                                        value={formData.key_features ? formatFeature(formData.key_features) : ''}
                                        onKeyDown={(e) => handleTextareaChange(e, 'key_features')}
                                        onPaste={(e) => handlePaste(e, 'key_features')}
                                        onChange={(e) => {
                                            handleChange({ target: { name: 'key_features', value: e.target.value, },
                                            });   
                                        }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="features">Features</label>
                                    <textarea
                                        id="features"
                                        name="features"
                                        className="input_pdps"
                                        value={formData.features ? formatFeature(formData.features) : ''}
                                        onKeyDown={(e) => handleTextareaChange(e, 'features')}
                                        onChange={(e) => handleChange({ target: { name: 'features', value: e.target.value } })}
                                        onPaste={(e) => handlePaste(e, 'features')} // Add paste functionality
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="short_description">Short Description</label>
                                    <textarea
                                        id="short_description"
                                        name="short_description"
                                        className="input_pdps"
                                        value={formData.short_description ? formatFeature(formData.short_description) : ''}
                                        onKeyDown={(e) => handleTextareaChange(e, 'short_description')}
                                        onChange={(e) => handleChange({ target: { name: 'short_description', value: e.target.value } })}
                                        onPaste={(e) => handlePaste(e, 'short_description')}
                                             />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="long_description">Long Description</label>
                                    <textarea  id="long_description"  name="long_description"  className="input_pdps"  value={formData.long_description ? formatFeature(formData.long_description) : ''} 
                                    onKeyDown={(e) => handleTextareaChange(e, 'long_description')}
                                    onChange={(e) => handleChange({ target: { name: 'long_description', value: e.target.value } })}
                                    onPaste={(e) => handlePaste(e, 'long_description')} 
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="tags">Tags</label>
                                    <textarea id="tags" name="tags" className="input_pdps" value={formData.tags ? formatFeature(formData.tags) : ''}
                                       onKeyDown={(e) => handleTextareaChange(e, 'tags')}
                                       onChange={(e) => handleChange({ target: { name: 'tags', value: e.target.value } })}
                                       onPaste={(e) => handlePaste(e, 'tags')}
                                    />
                                </div>
                            </div>
                        )}
                         {view === 'rawData' && (
                            <div className="other-details-section">
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px', borderBottom:'2px solid #007bff' }}>
                                <h3>Raw Data Details</h3>
                                <div className="product-info-display">
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>MPN: </label>
                                            <span>{formData.mpn ? formData.mpn : 'N/A'}</span>
                                        </div>
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>Product Name: </label>
                                            <span>{formData.product_name ? formData.product_name : 'N/A'}</span>
                                        </div>
                                    </div>
                                    </div>
                                <div className="form-group">
                                    <label htmlFor="features_notes">Standard Features/Notes:</label>
                                    <textarea id="features_notes" name="features_notes" className="input_pdps" value={formData.features_notes ? formatFeature(formData.features_notes) : ''}
                                   onKeyDown={(e) => handleTextareaChange(e, 'features_notes')} // Use common keydown handler
                                   onChange={(e) => handleChange({ target: { name: 'features_notes', value: e.target.value } })}
                                   onPaste={(e) => handlePaste(e, 'features_notes')}
/>
                                </div>
                            </div>
                        )}
                        {view === 'options' && (
                            <div className="other-details-section">
                                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px', borderBottom:'2px solid #007bff' }}>
                                <h3>Option Details</h3>
                                <div className="product-info-display">
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>MPN: </label>
                                            <span>{formData.mpn ? formData.mpn : 'N/A'}</span>
                                        </div>
                                        <div className="product-info">
                                            <label style={{ fontWeight: 'bold' }}>Product Name: </label>
                                            <span>{formData.product_name ? formData.product_name : 'N/A'}</span>
                                        </div>
                                    </div>
                                    </div>
                                <div className="form-group">
                                    <label htmlFor="option_str">Options:</label>
                                    <ReactQuill
                                        ref={quillRef}
                                        value={formData.option_str || ''}
                                        onChange={handleEditorChange}
                                        theme="snow"
                                        placeholder="Start typing here..."
                                        onReady={handleEditorReady}
                                    />
                                </div>
                            </div>
                        )}
                        {/* {view !== 'variants' && view !== 'taxonomy' && ( */}
                         {view !== 'variants' && (
                            <button
                                type="submit"
                                className="save-button_pdp"
                                onClick={view === 'taxonomy' ? swapProductToCategory : undefined} > Save  </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductDetail;
