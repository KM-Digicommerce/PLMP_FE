import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductDetail.css'; // Importing CSS for styling
import axiosInstance from '../../../src/utils/axiosConfig';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';


const ProductDetail = ({categories}) => {
    const { productId } = useParams(); 
    const navigate = useNavigate(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({}); 
    const [variantData, setVariantData] = useState([]); 
    const [view, setView] = useState('productDetail');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedLevel2Id, setselectedLevel2Id] = useState('');
    const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
    const [selectedlevel4, setSelectedlevel4] = useState('');
    const [selectedlevel5, setSelectedlevel5] = useState('');
    const [selectedlevel6, setSelectedlevel6] = useState('');

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
    const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
    const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
    const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
    const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
    const [data, setData] = useState([]);

    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
    const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');
      console.log(categories,'categories');
      const filteredCategories = categories?.category_list?.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );
    
    // const filteredCategories = categories.category_list.filter(category =>
    //     category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    // );

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

    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        setselectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };
    const [lastLevelCategoryIds, setLastLevelCategoryIds] = useState([]);
    const [isAddProductVisible, setIsAddProductVisible] = useState(false); 
    useEffect(() => {
      // Fetch the API response and store last_level_category IDs
      const fetchCategoryData = async () => {
        const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
        console.log(res.data.data.last_level_category,'Response the check');
        
        setLastLevelCategoryIds(res.data.data.last_level_category);
      };
      
      fetchCategoryData();
    }, []);
    const handleCategorySelectForVariants = async (id) => {
      const selectedIdString = String(id);
      const isIdInLastLevel = lastLevelCategoryIds.some(category => String(category.id) === selectedIdString);
      if (isIdInLastLevel) {
          setIsAddProductVisible(true);
      }
      else{
          setIsAddProductVisible(false);
      }
        setSelectedCategoryForVariant(id);
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleLevel2Select = (id) => {
        setselectedLevel2Id(id);
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsLevel2DropdownOpen(false);
    };

    const handleLevel3Select = (id) => {
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
    const [isLoading, setIsLoading] = useState(false);

    //  To make visible the next level categories
    const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : [];
    const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
    const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
    const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
    const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
    const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
    const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
    const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
    const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainProductDetails/`, {
                    id: productId, 
                });

                if (response.data && response.data.data) {
                    const productObj = response.data.data.product_obj;
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
            } catch (err) {
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please edit something! No changes detected',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        try {
            console.log(formData,'formData');
            
            const payload = {
                id: formData.product_id || '',
                update_obj: {
                   product_name: formData.product_name,
                   url: formData.url,
                   base_price: formData.base_price,
                   breadcrumb: formData.breadcrumb,
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
                title: 'Success!',
                text: 'Product updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload(); 
            });
        } catch (err) {
            alert('Error updating product');
        }
    };

    const handleBackClick = () => {
        navigate('/Homepage'); 
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-detail">
            <button onClick={handleBackClick} className="back-button">← Back to Products</button>
            <div className="section-buttons">
                <button onClick={() => setView('productDetail')} className={view === 'productDetail' ? 'active' : ''}>Product Detail</button>
                <button onClick={() => setView('taxonomy')} className={view === 'taxonomy' ? 'active' : ''}>Taxonomy</button>
                <button onClick={() => setView('variants')} className={view === 'variants' ? 'active' : ''}>Variants</button>
                <button onClick={() => setView('pricing')} className={view === 'pricing' ? 'active' : ''}>Pricing</button>
                <button onClick={() => setView('otherDetails')} className={view === 'otherDetails' ? 'active' : ''}>Other Details</button>
            </div>


            <form onSubmit={handleSubmit} className="product-edit-form">
                <div className="product-edit-container">

                    {view === 'productDetail' && (
                        <div className="product-info-section">
                            <h3>Edit Product Details</h3>
                            <div className="form-group">
                                <label htmlFor="product_name">Product Name</label>
                                <input type="text" id="product_name" name="product_name" value={formData.product_name || ''} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="base_price">Base Price</label>
                                <input type="text" id="base_price" name="base_price" value={String(`$${formData.base_price}`|| '')} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="model">Model</label>
                                <input type="text" id="model" name="model" value={String(formData.model || '')} onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="upc_ean">UPC_EAN</label>
                                <input type="text" id="upc_ean" name="upc_ean" value={String(formData.upc_ean || '')} onChange={handleChange}
                                />
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
                                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
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
                        <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
                            <div className="selected-category">
                                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isLevel2DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level2}
                                        onChange={(e) => handleSearchChange('level2', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevel2Select('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel2?.map(level2 => (
                                        <div className="dropdown-option" key={level2._id} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id); }}>
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
                                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isLevel3DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level3}
                                        onChange={(e) => handleSearchChange('level3', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevel3Select('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel3?.map(level3 => (
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id); }}>
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
                    )}

                    {view === 'variants' && (
                        <div className="variant-section">
                            <h3>Product Variants</h3>
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
                                        <tr key={variant.sku_number}>
                                            <td>{variant.sku_number}</td>
                                            <td>{variant.unfinished_price}</td>
                                            <td>{variant.finished_price}</td>
                                            <td>
                                                {variant.varient_option_list.map((option, index) => (
                                                    <div key={index}>{option.type_name}: {option.type_value}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {view === 'pricing' && (
                        <div className="pricing-section">
                            <h3>Pricing Details</h3>
                            <div className="form-group">
                                <label htmlFor="msrp">MSRP</label>
                                <input type="text" id="msrp" name="msrp" value={String(`$${formData.msrp}`|| '')} onChange={handleChange} required />
                            </div>
                        </div>
                    )}

                    {view === 'otherDetails' && (
                        <div className="other-details-section">
                            <h3>Other Product Details</h3>
                            <div className="form-group">
                                <label htmlFor="key_features">Key Features</label>
                                <input type="text" id="key_features" name="key_features" value={formData.key_features || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="features">Features</label>
                                <input type="text" id="features" name="features" value={formData.features || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="short_description">Short Description</label>
                                <input type="text" id="short_description" name="short_description" value={formData.short_description || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="long_description">Long Description</label>
                                <input type="text" id="long_description" name="long_description" value={formData.long_description || ''} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="tags">Tags</label>
                                <input type="text" id="tags" name="tags" value={formData.tags || ''} onChange={handleChange} />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="save-button_pdp">Save</button>
                </div>
            </form>
        </div>
    );
};

export default ProductDetail;
