import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductDetail.css';
import { Button, Modal, MenuItem, Select, InputLabel, Box, TextField, FormControl } from '@mui/material';

import axiosInstance from '../../../../src/utils/axiosConfig';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';

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
    const [selectedVariants, setSelectedVariants] = useState({
        sku_number: '',
        unfinishedPrice: '',
        finishedPrice: '',
        quantity: '',
    });
    const [variantOptions, setVariantOptions] = useState([]);
    const [brand, setBrand] = useState([]);

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
    const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
    const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
    const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
    const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
    // const [data, setData] = useState([]);

    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
    // const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');
    const filteredCategories = categories?.category_list?.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.category_list.find(level1 => level1._id === selectedCategoryId);
    const filteredCategoriesLevel2 = levelOneCategory?.level_one_category_list.filter(level2 =>
        level2.name.toLowerCase().includes(searchQueries.level2.toLowerCase())
    );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;
    const filteredCategoriesLevel3 = levelTwoCategory?.level_two_category_list.filter(level3 =>
        level3.name.toLowerCase().includes(searchQueries.level3.toLowerCase())
    );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;
    const filteredCategoriesLevel4 = levelThreeCategory?.level_three_category_list.filter(level4 =>
        level4.name.toLowerCase().includes(searchQueries.level4.toLowerCase())
    );

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;
    const filteredCategoriesLevel5 = levelFourCategory?.level_four_category_list.filter(level5 =>
        level5.name.toLowerCase().includes(searchQueries.level5.toLowerCase())
    );

    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;
    const filteredCategoriesLevel6 = levelFiveCategory?.level_five_category_list.filter(level6 =>
        level6.name.toLowerCase().includes(searchQueries.level6.toLowerCase())
    );

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
        let level1Category;
        categories.category_list.some(level1 => {
            const foundLevel2 = level1.level_one_category_list.some(level2 => level2._id === id);
            if (foundLevel2) {
                level1Category = level1;
                return true;
            }
            return false;
        });
        if (!level1Category) {
            console.error('Level 1 category not found for Level 2 category with ID:', id);
            return;
        }
        setSelectedCategoryId(level1Category._id);
        setselectedLevel2Id(id);
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsLevel2DropdownOpen(false);
    };

    const handleLevel3Select = (id) => {
        let level1Category, level2Category;

        categories.category_list.some(level1 => {
            const foundLevel2 = level1.level_one_category_list.find(level2 =>
                level2.level_two_category_list.some(level3 => level3._id === id)
            );

            if (foundLevel2) {
                level1Category = level1;
                level2Category = foundLevel2;
                return true;
            }
            return false;
        });

        if (!level2Category || !level1Category) {
            console.error('Parent categories not found for selected Level 3 category with ID:', id);
            return;
        }
        setSelectedCategoryId(level1Category._id);
        setselectedLevel2Id(level2Category._id);
        setSelectedLevel3Id(id);
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsLevel3DropdownOpen(false);
    };

    const handleLevelSelect = (level, id) => {
        switch (level) {
            case 4:
                setSelectedlevel4(id);
                break;
            case 5:
                setSelectedlevel5(id);
                break;
            case 6:
                setSelectedlevel6(id);
                break;
            default:
                break;
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
    const fetchProductDetail = async () => {
        try {
            const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainProductDetails/`, {
                id: productId,
            });
            if (response.data && response.data.data) {
                const productCategory = response.data.data.category_level;
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
                // console.log("Response 2", res.data.data.brand_list);
                setBrand(res.data.data.brand_list);
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
        } catch (err) {
            setError('Error fetching product details');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);
    const fetchVariantDetail = async () => {
        try {
            const variantResponse = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainAllVarientList/`, {
                product_id: productId,
            });
            if (variantResponse.data && variantResponse.data.data) {
                setVariantData(variantResponse.data.data || []);
            }
        } catch (err) {
            setError('Error fetching product details');
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e) => {
        console.log('handle change', e.target);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value, });
    };
    const [mainImage, setMainImage] = useState('placeholder-image-url.jpg');
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
                    customClass: {
                        container: 'swal-custom-container',
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        confirmButton: 'swal-custom-confirm',
                        cancelButton: 'swal-custom-cancel'
                    }
                });
                return;
            }
            try {
                const payload = {
                    id: formData.product_id || '',
                    update_obj: {
                        product_name: formData.product_name,
                        url: formData.url,
                        base_price: formData.base_price,
                        breadcrumb: formData.breadcrumb,
                        mpn: formData.mpn,
                        brand_id: formData.brand_id,
                        tags: formData.tags,
                        key_features: formData.key_features,
                        msrp: formData.msrp,
                        features: formData.features,
                        long_description: formData.long_description,
                        short_description: formData.short_description,
                        attributes: formData.attributes,
                        model: formData.model,
                        upc_ean: formData.upc_ean,
                    }
                };
                await axiosInstance.put(`${process.env.REACT_APP_IP}/productUpdate/`, payload);
                Swal.fire({
                    title: 'Success!', text: 'Product updated successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
                        container: 'swal-custom-container',
                        popup: 'swal-custom-popup',
                        title: 'swal-custom-title',
                        confirmButton: 'swal-custom-confirm',
                        cancelButton: 'swal-custom-cancel'
                    }
                }).then(() => {
                    fetchProductDetail();
                });
                setFormData('');
            } catch (err) {
                alert('Error updating product');
            }
        }
    };

    const handleBackClick = () => {
        navigate('/Admin');
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;


    const swapProductToCategory = async () => {
        if (categoryIds) {
            try {
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/swapProductToCategory/`, {
                    product_id: productId,
                    category_id: categoryId,
                    category_name: categoryName
                });
                console.log(response.status, 'response.status');
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Success!', text: 'Category updated successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel' }
                    })
                    setCategoryIds('');
                    setCategoryName('');
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
        setSelectedVariants((prevVariants) => ({
            ...prevVariants,
            [name]: value,
        }));
    };
    const handleVariantChange = (typeId, optionId) => {
        setSelectedVariants((prev) => ({
            ...prev,
            [typeId]: optionId,
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
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
    };
    const handleAddVariantClick = async () => {
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
      
    return (
        <div>
            <div className='section_container'>
                <div className="section_sidebar">
                    <button onClick={handleBackClick} className="back-button">← Back to Products</button>
                    <div className="section-buttons">
                        <button onClick={() => setView('productDetail')} className={view === 'productDetail' ? 'productDetail active' : 'productDetail'}>Product Detail</button>
                        <button onClick={() => setView('taxonomy')} className={view === 'taxonomy' ? 'taxonomy active' : 'taxonomy'}>Taxonomy</button>
                        <button onClick={() => setView('variants')} className={view === 'variants' ? 'variants active' : 'variants'}>Variants</button>
                        <button onClick={() => setView('pricing')} className={view === 'pricing' ? 'pricing active' : 'pricing'}>Pricing</button>
                        <button onClick={() => setView('otherDetails')} className={view === 'otherDetails' ? 'otherDetails active' : 'otherDetails'}>Other Details</button>
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
                                        <img
                                            src={mainImage}
                                            alt="Main Product"
                                            className="product-image-large"
                                        />
                                    </div>
                                    <div className="thumbnail-container">
                                        {formData.image.length > 3 && (
                                            <button
                                                className="thumbnail-scroll-btn prev-btn"
                                                onClick={handleScrollPrev}
                                            >
                                                &lt;
                                            </button>
                                        )}
                                        <div className="thumbnail-section">
                                            {Array.isArray(formData.image) &&
                                                formData.image.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        className={`product-thumbnail ${mainImage === image ? "active-thumbnail" : ""
                                                            }`}
                                                        onClick={() => handleThumbnailClick(image)}
                                                    />
                                                ))}
                                        </div>
                                        {formData.image.length > 3 && (
                                            <button
                                                className="thumbnail-scroll-btn next-btn"
                                                onClick={handleScrollNext}
                                            >
                                                &gt;
                                            </button>
                                        )}
                                    </div>
                                </div>



                                <div className="product-detail-section">
                                <div className="CategoryTable-header-edit">
                                    <h3>Edit Product Details</h3>
                                    {categoryLevel && (
                        <span className='categoryLevel'>{categoryLevel}</span>
                    )}
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
                                        <label htmlFor="brand">Brand</label>
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
                                            style={{ width: '100%', margin: '6px 4px 6px 2px' }}
                                        >
                                            {brand.map((item) => (
                                                <option value={item.id}>
                                                    {item.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
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
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="model">Model</label>
                                        <input type="text" id="model" className='input_pdps' name="model" value={formData.model ? formData.model.toLowerCase().replace(/^(\w)/, (match) => match.toUpperCase()) : ''} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="upc_ean">UPC_EAN</label>
                                        <input type="text" id="upc_ean" name="upc_ean" className='input_pdps' value={String(formData.upc_ean || '')} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {view === 'taxonomy' && (
                            <div className="taxonomy-section">
                                    <h3>Taxonomy</h3>
                                <div className='DropdownsContainer'>
                                    {/* Level 1 Dropdown */}
                                    <div className='DropdownColumn'>
                                        <label htmlFor="categorySelect">Level 1:</label>
                                        <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'} 
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {!isCategoryDropdownOpen && (
                                                <div className="dropdown-options-disabled" aria-disabled="true">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level1}
                                                        onChange={(e) => handleSearchChange('level1', e.target.value)}
                                                        disabled
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleCategorySelect('')}>
                                                        <span>Select Category</span>
                                                    </div>
                                                    {filteredCategories.map(level1 => (
                                                        <div className=" dropdown-option-disabled" key={level1._id || ''} onClick={() => {
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
                                    <div className='DropdownColumn'>
                                        <label htmlFor="sectionSelect">Level 2:</label>
                                        <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}               
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {isLevel2DropdownOpen && (
                                                <div className="dropdown-options-disabled" aria-disabled="true">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level2}
                                                        onChange={(e) => handleSearchChange('level2', e.target.value)}
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleLevel2Select('')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel2?.map(level2 => (
                                                        <div className=" dropdown-option-disabled" key={level2._id || ''} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
                                                            <span>{level2.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 3 Dropdown */}
                                    <div className='DropdownColumn'>
                                        <label htmlFor="productTypeSelect">Level 3:</label>
                                        <div className="custom-dropdown" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}               
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {isLevel3DropdownOpen && (
                                                <div className="dropdown-options-disabled" aria-disabled="true">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level3}
                                                        onChange={(e) => handleSearchChange('level3', e.target.value)}
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleLevel3Select('')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel3?.map(level3 => (
                                                        <div className=" dropdown-option-disabled" key={level3._id || ''} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
                                                            <span>{level3.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 4 Dropdown */}
                                    <div className='DropdownColumn'>
                                        <label htmlFor="level4Select">Level 4:</label>
                                        <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}               
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel4DropdownOpen && (
                                                <div className="dropdown-options-disabled">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level4}
                                                        onChange={(e) => handleSearchChange('level4', e.target.value)}
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleLevelSelect(4, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel4?.map(level4 => (
                                                        <div className=" dropdown-option-disabled" key={level4._id || ''} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
                                                            <span>{level4.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 5 Dropdown */}
                                    <div className='DropdownColumn'>
                                        <label htmlFor="level5Select">Level 5:</label>
                                        <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}               
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel5DropdownOpen && (
                                                <div className="dropdown-options-disabled">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level5}
                                                        onChange={(e) => handleSearchChange('level5', e.target.value)}
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleLevelSelect(5, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel5?.map(level5 => (
                                                        <div className=" dropdown-option-disabled" key={level5._id || ''} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
                                                            <span>{level5.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Level 6 Dropdown */}
                                    <div className='DropdownColumn'>
                                        <label htmlFor="level6Select">Level 6:</label>
                                        <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
                                            <div className="selected-category">
                                                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}               
                                                <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                            </div>
                                            {islevel6DropdownOpen && (
                                                <div className="dropdown-options-disabled">
                                                    <input
                                                        type="text"
                                                        placeholder="Search category..."
                                                        value={searchQueries.level6}
                                                        onChange={(e) => handleSearchChange('level6', e.target.value)}
                                                        className="dropdown-search-input"
                                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                                    />
                                                    <div className=" dropdown-option-disabled" onClick={() => handleLevelSelect(6, '')}>
                                                        <span>Select category</span>
                                                    </div>
                                                    {filteredCategoriesLevel6?.map(level6 => (
                                                        <div className=" dropdown-option-disabled" key={level6._id || ''} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
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
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', marginBottom: '0px' }}>
                                    <h3>Product Variants</h3>
                                    <button className='cls_addvariant'
                                        variant="contained"
                                        color="primary"
                                        sx={{ position: 'relative', top: '20px', right: '20px', margin: 0, }}
                                        onClick={handleAddVariantClick}>
                                        Add Variant Option
                                    </button>
                                </div>
                                <table className="variant-table">
                                    <thead>
                                        <tr>
                                            <th>Variant SKU</th>
                                            <th>Unfinished Price</th>
                                            <th>Finished Price</th>
                                            <th>Options</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {variantData.map((variant) => (
                                            <tr>
                                                <td>{variant.sku_number}</td>
                                                <td>{variant.un_finished_price ? `$${variant.un_finished_price}` : ''}</td>
                                                <td>{variant.finished_price ? `$${variant.finished_price}` : ''}</td>
                                                <td>
                                                    {variant.varient_option_list.map((option, index) => (
                                                        <div key={index}>{option.type_name}: {option.type_value}</div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <Modal
                                    open={isPopupOpen}
                                    onClose={handleClosePopup}
                                    aria-labelledby="variant-modal-title"
                                    aria-describedby="variant-modal-description"
                                    className="variant_model_pdp"
                                >
                                    <Box
                                        sx={{
                                            width: 450,
                                            padding: 2,
                                            maxHeight: '90vh',
                                            overflowY: 'auto',
                                            margin: 'auto',
                                            backgroundColor: 'white',
                                            borderRadius: '8px',
                                            top: '1%',
                                            position: 'absolute',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            boxShadow: 3,
                                        }}
                                    >
                                        <h3 id="variant-modal-title" style={{ textAlign: 'center', margin: '0' }}>Variant Details</h3>
                                        <form onSubmit={handleFormSubmit}>
                                            <TextField
                                                fullWidth
                                                name="sku"
                                                label="SKU"
                                                value={selectedVariants.sku}
                                                onChange={handleVariantDetailChange}
                                                margin="normal"
                                                className='input_pdp'
                                                size="small"
                                                sx={{ marginBottom: 2 }}
                                            />


                                            {/* <TextField
                                            fullWidth
                                            type="number"
                                            name="unfinishedPrice"
                                            label="Unfinished Price"
                                            value={selectedVariants.unfinishedPrice}
                                            onChange={handleVariantDetailChange}
                                            margin="normal"
                                            className='input_pdp'
                                            size="small"
                                            sx={{ marginBottom: 2 }}
                                        /> */}

                                            <TextField
                                                fullWidth
                                                type="text"
                                                name="unfinishedPrice"
                                                label="Unfinished Price"
                                                value={selectedVariants.unfinishedPrice || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        handleVariantDetailChange({ target: { name: 'unfinishedPrice', value } });
                                                    }
                                                }}
                                                margin="normal"
                                                className="input_pdp"
                                                size="small"
                                                sx={{ marginBottom: 2 }}
                                            />

                                            <TextField
                                                fullWidth
                                                type="text"
                                                name="finishedPrice"
                                                label="Finished Price"
                                                value={selectedVariants.finishedPrice}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^\d*\.?\d{0,2}$/.test(value)) {
                                                        handleVariantDetailChange({ target: { name: 'finishedPrice', value } });
                                                    }
                                                }}
                                                margin="normal"
                                                className='input_pdp'
                                                size="small"
                                                sx={{ marginBottom: 2 }}
                                            />


                                            <TextField
                                                fullWidth
                                                type="number"
                                                name="quantity"
                                                className='input_pdp'
                                                label="Quantity"
                                                value={selectedVariants.quantity}
                                                onChange={handleVariantDetailChange}
                                                margin="normal"
                                                size="small"
                                                sx={{ marginBottom: 2 }}
                                            />


                                            {variantOptions?.map((variant) => (
                                                <div key={variant.type_id}>
                                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                                        <InputLabel id={`variant-${variant.type_id}`} >{variant.type_name}</InputLabel>
                                                        <Select
                                                            labelId={`variant-${variant.type_id}`}
                                                            value={selectedVariants[variant.type_id] || ''}
                                                            onChange={(e) => handleVariantChange(variant.type_id, e.target.value)}
                                                            label={variant.type_name}
                                                            size="small"
                                                            sx={{ padding: '8px' }}
                                                        >
                                                            {variant.option_value_list?.map((option) => (
                                                                <MenuItem key={option.type_value_id} value={option.type_value_id}>
                                                                    {option.type_value_name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            ))}
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{ width: '100%', marginTop: 2 }}
                                            >
                                                Save Variant
                                            </Button>
                                        </form>
                                    </Box>
                                </Modal>

                            </div>
                        )}

                        {view === 'pricing' && (
                            <div className="pricing-section">
                                <h3>Pricing Details</h3>
                                <div className="form-group">
                                    <label htmlFor="msrp">MSRP</label>
                                    <input type="text" id="msrp" name="msrp" className='input_pdps'
                                        value={String(`$${formData.msrp}` || '')}
                                        // value={String`$${formData.msrp?.replace(/^\$/, '') || ''}`}
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
                        )}

                        {view === 'otherDetails' && (
                            <div className="other-details-section">
                                <h3>Other Product Details</h3>
                                <div className="form-group">
                                    <label htmlFor="key_features">Key Features</label>
                                    <textarea
                                        id="key_features"
                                        name="key_features"
                                        className="input_pdps"
                                        value={
                                            formData.key_features
                                                ?.split('\n')
                                                .filter((feature) => feature.trim() !== '')
                                                .map((feature) => `* ${feature.trim().replace(/^\*/, '')}`)
                                                .join('\n') || ''
                                        }
                                        onChange={(e) => {
                                            const updatedFeatures = e.target.value
                                                .split('\n')
                                                .map((line) => line.replace(/^\* */, '').trim())
                                                .join('\n');
                                            handleChange({
                                                target: {
                                                    name: 'key_features',
                                                    value: updatedFeatures,
                                                },
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
                                        value={
                                            formData.features
                                                ?.split('\n').filter((feature) => feature.trim() !== '').map((feature) => `* ${feature.trim().replace(/^\*/, '')}`).join('\n') || ''
                                        }
                                        onChange={(e) => {
                                            const updatedFeatures = e.target.value.split('\n').map((line) => line.replace(/^\* */, '').trim()).join('\n');
                                            handleChange({
                                                target: {
                                                    name: 'features',
                                                    value: updatedFeatures,
                                                },
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="short_description">Short Description</label>
                                    <textarea
                                        id="short_description"
                                        name="short_description"
                                        className="input_pdps"
                                        value={
                                            formData.short_description?.split('\n').filter((desc) => desc.trim() !== '').map((desc) => `* ${desc.trim().replace(/^\*/, '')}`).join('\n') || ''
                                        }
                                        onChange={(e) => {
                                            const updatedDescription = e.target.value.split('\n').map((line) => line.replace(/^\* */, '').trim()).join('\n');
                                            handleChange({
                                                target: {
                                                    name: 'short_description',
                                                    value: updatedDescription,
                                                },
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="long_description">Long Description</label>
                                    <textarea
                                        id="long_description"
                                        name="long_description"
                                        className="input_pdps"
                                        value={
                                            formData.long_description?.split('\n').filter((desc) => desc.trim() !== '').map((desc) => `* ${desc.trim().replace(/^\*/, '')}`).join('\n') || ''
                                        }
                                        onChange={(e) => {
                                            const updatedDescription = e.target.value.split('\n').map((line) => line.replace(/^\* */, '').trim()).join('\n');
                                            handleChange({
                                                target: {
                                                    name: 'long_description',
                                                    value: updatedDescription,
                                                },
                                            });
                                        }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tags">Tags</label>
                                    <textarea
                                        id="tags"
                                        name="tags"
                                        className="input_pdps"
                                        value={
                                            formData.tags?.split('\n').filter((tag) => tag.trim() !== '').map((tag) => `* ${tag.trim().replace(/^\*/, '')}`).join('\n') || ''
                                        }
                                        onChange={(e) => {
                                            const updatedTags = e.target.value.split('\n').map((line) => line.replace(/^\* */, '').trim()).join('\n');
                                            handleChange({
                                                target: {
                                                    name: 'tags',
                                                    value: updatedTags,
                                                },
                                            });
                                        }}
                                    />
                                </div>

                            </div>
                        )}
{view !== 'variants' && view !== 'taxonomy' && (
  <button
    type="submit"
    className="save-button_pdp"
    onClick={view === 'taxonomy' ? swapProductToCategory : undefined}
  >
    Save
  </button>
)}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductDetail;
