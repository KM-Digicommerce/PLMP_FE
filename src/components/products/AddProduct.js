import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Add your CSS file
import ChevronDownIcon from '@mui/icons-material/ExpandMore';


// Simple Modal component
const Modal = ({ isOpen, onClose, onSave, productData, handleChange }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <button onClick={onClose} className="close-btn">✕</button>
                <h2>Add Product</h2>
                <div className="form-section">
                    <h3>Basic Info</h3>
                    <input type="text" name="model" placeholder="Model" value={productData.model} onChange={handleChange} />
                    <input type="text" name="mpn" placeholder="MPN" value={productData.mpn} onChange={handleChange} />
                    <input type="text" name="upc_ean" placeholder="UPC/EAN" value={productData.upc_ean} onChange={handleChange} />
                    <input type="text" name="breadcrumb" placeholder="Breadcrumb" value={productData.breadcrumb} onChange={handleChange}/>
                    <input type="text" name="brand_name" placeholder="Brand Name" value={productData.brand_name} onChange={handleChange}/>
                    <input type="text" name="product_name" placeholder="Product Name" required value={productData.product_name}  onChange={handleChange}/>
                </div>

                <div className="form-section">
                    <h3>Descriptions</h3>
                    <textarea
                        name="long_description"
                        placeholder="Long Description"
                        value={productData.long_description}
                        onChange={handleChange}
                    />
                    <textarea
                        name="short_description"
                        placeholder="Short Description"
                        value={productData.short_description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-section">
                    <h3>Pricing</h3>
                    <input
                        type="number"
                        name="msrp"
                        placeholder="MSRP"
                        value={productData.msrp}
                        onChange={handleChange}
                    />
                    <input
                        type="number"
                        name="base_price"
                        placeholder="Base Price"
                        value={productData.base_price}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-section">
                    <h3>Features & Attributes</h3>
                    <textarea
                        name="features"
                        placeholder="Features"
                        value={productData.features}
                        onChange={handleChange}
                    />
                    <textarea
                        name="attributes"
                        placeholder="Attributes"
                        value={productData.attributes}
                        onChange={handleChange}
                    />
                    <textarea
                        name="tags"
                        placeholder="Tags"
                        value={productData.tags}
                        onChange={handleChange}
                    />
                    <textarea
                        name="key_features"
                        placeholder="Key Features"
                        value={productData.key_features}
                        onChange={handleChange}
                    />
                </div>
                
                <button onClick={onSave} className="save-button">Save Product</button>
            </div>
        </div>
    );
};

const AddProduct = (categories) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState({
        model: '',
        mpn: '',
        upc_ean: '',
        breadcrumb: '',
        brand_name: '',
        product_name: '',
        long_description: '',
        short_description: '',
        features: '',
        attributes: '',
        tags: '',
        msrp: '',
        base_price: '',
        key_features: '',
        options: [],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };
console.log(categories,'categories');

    const handleSave = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_IP}/createProduct/`, 
                productData
            );
            if (response.data.status === 'success') {
                alert('Product added successfully!');
                setProductData({
                    model: '',
                    mpn: '',
                    upc_ean: '',
                    breadcrumb: '',
                    brand_name: '',
                    product_name: '',
                    long_description: '',
                    short_description: '',
                    features: '',
                    attributes: '',
                    tags: '',
                    msrp: '',
                    base_price: '',
                    key_features: '',
                    options: [],
                });
                setIsModalOpen(false); // Close the modal after saving
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    };
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [selectedProductTypeId, setSelectedProductTypeId] = useState('');
    const [selectedlevel4, setSelectedlevel4] = useState('');
    const [selectedlevel5, setSelectedlevel5] = useState('');
    const [selectedlevel6, setSelectedlevel6] = useState('');

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
    const [isProductTypeDropdownOpen, setIsProductTypeDropdownOpen] = useState(false);
    const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
    const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
    const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
    const [data, setData] = useState([]);
    const [variantsData, setVariantsData] = useState([]);

    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
    const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');

    const filteredCategories = categories.categories.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.categories.find(level1 => level1._id === selectedCategoryId);
    const filteredCategoriesLevel2 = levelOneCategory?.level_one_category_list.filter(level2 =>
        level2.name.toLowerCase().includes(searchQueries.level2.toLowerCase())
    );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedSectionId) : null;
    const filteredCategoriesLevel3 = levelTwoCategory?.level_two_category_list.filter(level3 =>
        level3.name.toLowerCase().includes(searchQueries.level3.toLowerCase())
    );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedProductTypeId) : null;
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

    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        try {
            const res = await axios.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            console.log('API Response: here', res.data.data); // Log the API response
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
        setSelectedSectionId('');
        setSelectedProductTypeId('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };

    const handleCategorySelectForVariants = async (id) => {
        setSelectedCategoryForVariant(id);
        try {
            const res = await axios.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            // console.log('API Response: here', res.data.data); // Log the API response
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleSectionSelect = (id) => {
        setSelectedSectionId(id);
        setSelectedProductTypeId('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsSectionDropdownOpen(false);
    };

    const handleProductTypeSelect = (id) => {
        setSelectedProductTypeId(id);
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsProductTypeDropdownOpen(false);
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //  To make visible the next level categories
const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : [];
const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedSectionId);
const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedProductTypeId);
const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
    return (
        <div>
        <h2 className='header_cls_prod'>Product Schema!</h2>
        <div className='CategoryContainer'>
            <div className='DropdownsContainer'>
                {/* Level 1 Dropdown */}
                <div className='DropdownColumn'>
                    <label htmlFor="categorySelect">Level 1:</label>
                    <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                        <div className="selected-category">
                            {selectedCategoryId ? categories.categories.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {isCategoryDropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level1}
                                    onChange={(e) => handleSearchChange('level1', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                                    <span>Select Category</span>
                                </div>
                                {filteredCategories.map(level1 => (
                                    <div className="dropdown-option" key={level1._id} onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id); }}>
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
                    <div className="custom-dropdown" onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}>
                        <div className="selected-category">
                            {selectedSectionId ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedSectionId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {isSectionDropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level2}
                                    onChange={(e) => handleSearchChange('level2', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleSectionSelect('')}>
                                    <span>Select category</span>
                                </div>
                                {filteredCategoriesLevel2?.map(level2 => (
                                    <div className="dropdown-option" key={level2._id} onClick={() => { handleSectionSelect(level2._id); handleCategorySelectForVariants(level2._id); }}>
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
                    <div className="custom-dropdown" onClick={() => setIsProductTypeDropdownOpen(!isProductTypeDropdownOpen)}>
                        <div className="selected-category">
                            {selectedProductTypeId ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedProductTypeId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {isProductTypeDropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level3}
                                    onChange={(e) => handleSearchChange('level3', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleProductTypeSelect('')}>
                                    <span>Select category</span>
                                </div>
                                {filteredCategoriesLevel3?.map(level3 => (
                                    <div className="dropdown-option" key={level3._id} onClick={() => { handleProductTypeSelect(level3._id); handleCategorySelectForVariants(level3._id); }}>
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
                            {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {islevel4DropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level4}
                                    onChange={(e) => handleSearchChange('level4', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleLevelSelect(4, '')}>
                                    <span>Select category</span>
                                </div>
                                {filteredCategoriesLevel4?.map(level4 => (
                                    <div className="dropdown-option" key={level4._id} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id); }}>
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
                            {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {islevel5DropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level5}
                                    onChange={(e) => handleSearchChange('level5', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleLevelSelect(5, '')}>
                                    <span>Select category</span>
                                </div>
                                {filteredCategoriesLevel5?.map(level5 => (
                                    <div className="dropdown-option" key={level5._id} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id); }}>
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
                            {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                        </div>
                        {islevel6DropdownOpen && (
                            <div className="dropdown-options">
                                <input
                                    type="text"
                                    placeholder="Search category..."
                                    value={searchQueries.level6}
                                    onChange={(e) => handleSearchChange('level6', e.target.value)}
                                    className="dropdown-search-input"
                                    onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                />
                                <div className="dropdown-option" onClick={() => handleLevelSelect(6, '')}>
                                    <span>Select category</span>
                                </div>
                                {filteredCategoriesLevel6?.map(level6 => (
                                    <div className="dropdown-option" key={level6._id} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id); }}>
                                        <span>{level6.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <div className="add-product-container">
            <button onClick={() => setIsModalOpen(true)} className="add-product-button">Add Product</button>
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSave} 
                productData={productData}
                handleChange={handleChange}
            />
        </div>
        </div>
    );
};

export default AddProduct;
