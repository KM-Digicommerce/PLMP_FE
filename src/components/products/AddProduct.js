// src/components/products/AddProduct.js
import React, { useState, useEffect } from 'react';
import './AddProduct.css'; // Add your CSS file
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import { Select, MenuItem, FormControl } from '@mui/material';
import axiosInstance from '../../../src/utils/axiosConfig';

const Modal = ({ isOpen, onClose, onSave, productData, handleChange, handleVariantChange, selectedCategoryId, selectedVariants, handleVariantDetailChange, addVariantRow }) => {
    const [variantOptions, setVariantOptions] = useState([]);
    const [brand, setBrand] = useState([]);

    useEffect(() => {
        if (isOpen && selectedCategoryId) {
            const fetchVariants = async () => {
                try {
                    const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${selectedCategoryId}`);
                    setVariantOptions(res.data.data.varient_list);
                } catch (err) {
                    console.error('Error fetching variants:', err);
                }
            };
            fetchVariants();
        }
    }, [isOpen, selectedCategoryId]);

    useEffect(() => {
        if (isOpen && selectedCategoryId) {
            const fetchBrand = async () => {
                try {
                    const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
                    setBrand(res.data.data.brand_list);
                } catch (err) {
                    console.error('Error fetching variants:', err);
                }
            };
            fetchBrand();
        }
    }, [isOpen, selectedCategoryId]);
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="close-btn">✕</button>
                <h2 style={{ margin: '0px' }}>Add Product</h2>
                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Basic Info</h3>
                    <input type="text" name="model" placeholder="Model" value={productData.model} onChange={handleChange} />
                    <input type="text" name="mpn" placeholder="MPN" value={productData.mpn} onChange={handleChange} />
                    <input type="text" name="upc_ean" placeholder="UPC/EAN" value={productData.upc_ean} onChange={handleChange} />
                    <input type="text" name="breadcrumb" placeholder="Breadcrumb" value={productData.breadcrumb} onChange={handleChange} />
                    <select
                        id="brand-select"
                        name="brand_id"
                        value={productData.product_obj.brand_id || ''}
                        onChange={handleChange}
                        className="dropdown"
                        style={{ width: '94%', margin: '6px 20px 6px 10px' }}
                    >
                        <option value="" >Select Brand</option>
                        {brand.map((item) => (
                            <option key={item._id} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                    <input type="text" name="product_name" placeholder="Product Name" required value={productData.product_name} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Descriptions</h3>
                    <textarea name="long_description" placeholder="Long Description" value={productData.long_description} onChange={handleChange} />
                    <textarea name="short_description" placeholder="Short Description" value={productData.short_description} onChange={handleChange} />
                </div>

                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Pricing</h3>
                    <div className="pricing-grid">
                        <div className="pricing-field">
                            <label htmlFor="base_price">Base</label>
                            <input type="number" id="base_price" name="base_price" placeholder="Base" value={productData.base_price} onChange={handleChange} />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="msrp">MSRP</label>
                            <input type="number" id="msrp" name="msrp" placeholder="MSRP" value={productData.msrp} onChange={handleChange} />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="discount_price">Discount</label>
                            <input type="number" id="discount_price" name="discount_price" placeholder="Discount" value={productData.discount_price || ''} onChange={handleChange} />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="dealer_price">Dealer</label>
                            <input type="number" id="dealer_price" name="dealer_price" placeholder="Dealer" value={productData.dealer_price || ''} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Features & Attributes</h3>
                    <textarea name="features" placeholder="Features" value={productData.features} onChange={handleChange} />
                    <textarea name="attributes" placeholder="Attributes" value={productData.attributes} onChange={handleChange} />
                    <textarea name="tags" placeholder="Tags" value={productData.tags} onChange={handleChange} />
                    <textarea name="key_features" placeholder="Key Features" value={productData.key_features} onChange={handleChange} />
                </div>
                {/* <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Variant Details</h3>
                    <div className="variant-scroll">
                        <div className="variant-row">
                            <div className="variant-field">
                                <label htmlFor="sku">SKU</label>
                                <input type="text" id="sku" name="sku" placeholder="SKU" value={selectedVariants.sku} onChange={handleVariantDetailChange} />
                            </div>
                            <div className="variant-field">
                                <label htmlFor="unfinishedPrice">Unfinished Price</label>
                                <input type="number" id="unfinishedPrice" name="unfinishedPrice" placeholder="Unfinished Price" value={selectedVariants.unfinishedPrice} onChange={handleVariantDetailChange} />
                            </div>
                            <div className="variant-field">
                                <label htmlFor="finishedPrice">Finished Price</label>
                                <input type="number" id="finishedPrice" name="finishedPrice" placeholder="Finished Price" value={selectedVariants.finishedPrice} onChange={handleVariantDetailChange} />
                            </div>
                            <div className="variant-field">
                                <label htmlFor="quantity">Quantity</label>
                                <input type="number" id="quantity" name="quantity" placeholder="Quantity" value={selectedVariants.quantity} onChange={handleVariantDetailChange} />
                            </div>
                            {variantOptions?.map((variant) => (
                                <div className="variant-dropdown" key={variant.type_id}>
                                    <label className="dropdown-label" htmlFor={`variant-${variant.type_id}`}>
                                        {variant.type_name}
                                    </label>
                                    <FormControl fullWidth variant="outlined" className="dropdown-container">
                                        <Select
                                            labelId={`variant-${variant.type_id}`}
                                            value={selectedVariants[variant.type_id] || ''}
                                            onChange={(e) => handleVariantChange(variant.type_id, e.target.value)}
                                            displayEmpty
                                            className="styled-dropdown"
                                            inputProps={{
                                                style: {
                                                    fontSize: '16px',
                                                    padding: '8px',
                                                },
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select {variant.type_name}
                                            </MenuItem>
                                            {variant.option_value_list?.map((option) => (
                                                <MenuItem key={option.type_value_id} value={option.type_value_id}>
                                                    {option.type_value_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                            ))}

                        </div>
                    </div>
                </div> */}
                 <div className="form-section">
                 <div className='CategoryTable-header'>
                    <h3 style={{ margin: '6px' }}>Variant Details</h3>
                    {/* Add Variant Button */}
                    <button onClick={addVariantRow} className="add-variant-button">Add Variant</button>
                </div>
                    <div className="variant-scroll">
                        {selectedVariants.map((variant, index) => (
                            <div className="variant-row" key={index}>
                                <div className="variant-field">
                                    <label htmlFor="sku">SKU</label>
                                    <input type="text" id="sku" name="sku" placeholder="SKU" value={variant.sku} onChange={(e) => handleVariantDetailChange(e, index)} />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="unfinishedPrice">Unfinished Price</label>
                                    <input type="number" id="unfinishedPrice" name="unfinishedPrice" placeholder="Unfinished Price" value={variant.unfinishedPrice} onChange={(e) => handleVariantDetailChange(e, index)} />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="finishedPrice">Finished Price</label>
                                    <input type="number" id="finishedPrice" name="finishedPrice" placeholder="Finished Price" value={variant.finishedPrice} onChange={(e) => handleVariantDetailChange(e, index)} />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input type="number" id="quantity" name="quantity" placeholder="Quantity" value={variant.quantity} onChange={(e) => handleVariantDetailChange(e, index)} />
                                </div>

                                {/* Dynamic Variant Dropdowns */}
                                {variantOptions?.map((variantOption) => (
                                    <div className="variant-dropdown" key={variantOption.type_id}>
                                        <label className="dropdown-label" htmlFor={`variant-${variantOption.type_id}`}>
                                            {variantOption.type_name}
                                        </label>
                                        <FormControl fullWidth variant="outlined" className="dropdown-container">
                                            <Select
                                                labelId={`variant-${variantOption.type_id}`}
                                                value={variant[variantOption.type_id] || ''} // Bind the value to the selected option
                                                onChange={(e) => handleVariantChange(variantOption.type_id, e.target.value, index)} // Handle the change
                                                displayEmpty
                                                className="styled-dropdown"
                                                inputProps={{
                                                    style: {
                                                        fontSize: '16px',
                                                        padding: '8px',
                                                    },
                                                }}
                                            >
                                                <MenuItem value="" disabled>Select {variantOption.type_name}</MenuItem>
                                                {variantOption.option_value_list?.map((option) => (
                                                    <MenuItem key={option.type_value_id} value={option.type_value_id}>
                                                        {option.type_value_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
  </div>
))}


                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={onSave} className="save-button">Save Product</button>
            </div>
        </div>
    );
};

const AddProduct = (categories) => {
    const [lastLevelCategoryIds, setLastLevelCategoryIds] = useState([]);
    const [isAddProductVisible, setIsAddProductVisible] = useState(false);  // Add this line

    useEffect(() => {
        const fetchCategoryData = async () => {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
            setLastLevelCategoryIds(res.data.data.last_level_category);
        };

        fetchCategoryData();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productData, setProductData] = useState({
        product_obj: {
            category_id: '',
            category_name: '',
            model: '',
            mpn: '',
            upc_ean: '',
            breadcrumb: '',
            brand_id: '',
            product_name: '',
            long_description: '',
            short_description: '',
            features: '',
            attributes: '',
            tags: '',
            msrp: '',
            base_price: '',
            key_features: '',
            varients: [
                {
                    sku_number: '',
                    finished_price: '',
                    un_finished_price: '',
                    quantity: '',
                    options: []
                }
            ]
        }
    });
    const [selectedVariants, setSelectedVariants] = useState([{
        sku: '', unfinishedPrice: '', finishedPrice: '', quantity: '', options: []
    }]);

    const addVariantRow = () => {
        setSelectedVariants(prevVariants => [
            ...prevVariants,
            { sku: '', unfinishedPrice: '', finishedPrice: '', quantity: '', options: [] }
        ]);
    };
    // const handleVariantDetailChange = (e) => {
    //     const { name, value } = e.target;
    //     setSelectedVariants((prev) => ({
    //         ...prev,
    //         [name]: value
    //     }));
    // };
    const handleVariantDetailChange = (e, index) => {
        const { name, value } = e.target;
        setSelectedVariants(prev => {
            const updatedVariants = [...prev];
            updatedVariants[index][name] = value;
            return updatedVariants;
        });
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            product_obj: {
                ...productData.product_obj,
                [name]: value
            }
        });
    };
    const handleVariantChange = (typeId, optionId, index) => {
        console.log(typeId,optionId,index,'typeID OPTIPN inxe');
        
        setSelectedVariants(prev => {
          const updatedVariants = [...prev];
          const updatedVariant = updatedVariants[index];
          // Ensure the options array exists
          if (!updatedVariant.options) {
            updatedVariant.options = [];
          } 
          // Check if the option already exists, if so update it, otherwise add it
          const optionIndex = updatedVariant.options.findIndex(option => option.option_name_id === typeId);
          if (optionIndex !== -1) {
            updatedVariant.options[optionIndex] = {
              option_name_id: typeId,
              option_value_id: optionId,
            };
          } else {
            updatedVariant.options.push({
              option_name_id: typeId,
              option_value_id: optionId,
            });
          }
          updatedVariant[typeId] = optionId;
          return updatedVariants;
        });
      };
    
    // const handleVariantChange = (typeId, optionId) => {
    //     setSelectedVariants((prev) => ({
    //         ...prev,
    //         [typeId]: optionId,
    //     }));
    //     console.log(selectedVariants, 'selectedVariants');
    //     console.log(typeId, 'typeId');
    //     console.log(optionId, 'optionId');

    //     const filteredOptions = Object.entries(selectedVariants)
    //         .filter(([nameId]) => !['sku', 'unfinishedPrice', 'finishedPrice', 'quantity'].includes(nameId))
    //         .map(([nameId, valueId]) => ({
    //             option_name_id: nameId,
    //             option_value_id: valueId
    //         }));
    //     setProductData((prevData) => ({
    //         ...prevData,
    //         product_obj: {
    //             ...prevData.product_obj,
    //             varients: [
    //                 {
    //                     ...prevData.product_obj.varients[0],
    //                     options: filteredOptions,
    //                 }
    //             ]
    //         }

    //     }));
    // };
    const handleSave = async () => {
        try {
            const payload = {
                product_obj: {
                    ...productData.product_obj,
                    varients: selectedVariants.map(variant => ({
                        sku_number: variant.sku,
                        un_finished_price: variant.unfinishedPrice,
                        finished_price: variant.finishedPrice,
                        quantity: variant.quantity,
                        options: variant.options.map(option => ({
                            option_name_id: option.option_name_id,
                            option_value_id: option.option_value_id
                        }))
                    }))
                }
            };

            // const payload = {
            //     product_obj: {
            //         ...productData.product_obj,
            //         varients: productData.product_obj.varients.map(variant => ({
            //             sku_number: selectedVariants.sku,
            //             un_finished_price: selectedVariants.unfinishedPrice,
            //             finished_price: selectedVariants.finishedPrice,
            //             quantity: selectedVariants.quantity,
            //             options: variant.options.map(option => ({
            //                 option_name_id: option.option_name_id,
            //                 option_value_id: option.option_value_id
            //             }))
            //         }))
            //     }
            // };

            const response = await axiosInstance.post(
                `${process.env.REACT_APP_IP}/createProduct/`,
                payload
            );            
            if (response.data?.data?.status === true) {
                alert('Product added successfully!');
                setProductData({
                    product_obj: {
                        model: '',
                        mpn: '',
                        upc_ean: '',
                        breadcrumb: '',
                        brand_id: '',
                        product_name: '',
                        long_description: '',
                        short_description: '',
                        features: '',
                        attributes: '',
                        tags: '',
                        msrp: '',
                        base_price: '',
                        key_features: '',
                        varients: [{
                            sku_number: '',
                            finished_price: '',
                            un_finished_price: '',
                            quantity: '',
                            options: []
                        }],
                        category_id: '',
                        category_name: ''
                    }
                });
                setIsModalOpen(false);
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    };

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
    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
    const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');

    const filteredCategories = categories.categories.category_list.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.categories.category_list.find(level1 => level1._id === selectedCategoryId);

    const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';
    const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)
    );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;

    const filteredCategoriesLevel3 = levelTwoCategory
        ? levelTwoCategory.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 =>
            level3.name.toLowerCase().includes(safeSearchQuery)
        );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;

    const filteredCategoriesLevel4 = levelThreeCategory ? levelThreeCategory.level_three_category_list.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;

    const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));

    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;

    const filteredCategoriesLevel6 = levelFiveCategory
        ? levelFiveCategory.level_five_category_list.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));

    const handleSearchChange = (level, value) => {
        setSearchQueries(prev => ({ ...prev, [level]: value }));
    };
    const handleLevelClear = (e) => {
        setSelectedCategoryId(e);
        setselectedLevel2Id(e);
        setSelectedLevel3Id(e);
        setSelectedlevel4(e);
        setSelectedlevel5(e);
        setSelectedlevel6(e);
        setIsAddProductVisible(false);
    }
    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            console.log('API Response: here', res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
        setselectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };

    const handleCategorySelectForVariants = async (id, category_level) => {
        console.log(lastLevelCategoryIds.includes(id), 'REsponse to set');
        console.log(id, 'ID');
        const selectedIdString = String(id);

        const isIdInLastLevel = lastLevelCategoryIds.some(category => String(category.id) === selectedIdString);

        if (isIdInLastLevel) {
            setIsAddProductVisible(true);
        }
        else {
            setIsAddProductVisible(false);
        }

        setSelectedCategoryForVariant(id);
        setProductData((prevData) => ({
            ...prevData,
            product_obj: {
                ...prevData.product_obj,
                category_id: id,
                category_name: category_level
            }
        }));
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
        } catch (err) {
            console.log('ERROR', err);
        }
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleLevel2Select = (id) => {
        const selectedValue = id;
        if (selectedValue !== '') {
            let level1Category;
            categories.categories.category_list.some(level1 => {
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
            categories.categories.category_list.some(level1 => {
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
        const selectedValue = id;
        if (selectedValue !== '') {
            switch (level) {
                case 4:
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
                    setselectedLevel2Id(level2Category._id);
                    setSelectedLevel3Id(level3Category._id);
                    setSelectedlevel4(selectedValue);
                    break;
                case 5:
                    const level4Category = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .flatMap(level3 => level3.level_three_category_list)
                        .find(level4 => level4._id);

                    if (!level4Category) {
                        console.error('Level 4 category not found for ID:', level4Category._id);
                        return;
                    }
                    const level3CategoryForLevel5 = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .find(level3 => level3._id);

                    if (!level3CategoryForLevel5) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel5._id);
                        return;
                    }
                    const level2CategoryForLevel5 = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

                    if (!level2CategoryForLevel5) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel5._id);
                        return;
                    }
                    const level1CategoryForLevel5 = categories.category_list.find(level1 =>
                        level1.level_one_category_list.some(level2 => level2._id)
                    );

                    if (!level1CategoryForLevel5) {
                        console.error('Level 1 category not found for Level 2 category with ID:', level1CategoryForLevel5._id);
                        return;
                    }

                    setSelectedCategoryId(level1CategoryForLevel5._id);
                    setselectedLevel2Id(level2CategoryForLevel5._id);
                    setSelectedLevel3Id(level3CategoryForLevel5._id);
                    setSelectedlevel4(level4Category._id);
                    setSelectedlevel5(selectedValue);
                    break;
                case 6:
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

                    const level4CategoryForLevel6 = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .flatMap(level3 => level3.level_three_category_list)
                        .find(level4 => level4._id);

                    if (!level4CategoryForLevel6) {
                        console.error('Level 4 category not found for ID:', level4CategoryForLevel6._id);
                        return;
                    }
                    const level3CategoryForLevel6 = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .find(level3 => level3._id);

                    if (!level3CategoryForLevel6) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel6._id);
                        return;
                    }
                    const level2CategoryForLevel6 = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

                    if (!level2CategoryForLevel6) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel6._id);
                        return;
                    }
                    const level1CategoryForLevel6 = categories.category_list.find(level1 =>
                        level1.level_one_category_list.some(level2 => level2._id)
                    );

                    if (!level1CategoryForLevel6) {
                        console.error('Level 1 category not found for Level 2 category with ID:', level1CategoryForLevel6._id);
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
        }
        else {
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
    console.log(level6Categories);

    return (
        <div>
            <div className='CategoryTable-header'>
                <h2 className='header_cls_prod'>Product Schema!</h2>
                <button className='clear_cat_btn' onClick={() => handleLevelClear('')} >Clear categories</button>
            </div>
            <div className='CategoryContainer'>
                <div className='DropdownsContainer'>
                    {/* Level 1 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="categorySelect">Level 1:</label>
                        <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                            <div className="selected-category">
                                {selectedCategoryId ? categories.categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {isCategoryDropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level1}
                                        onChange={(e) => handleSearchChange('level1', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                                        <span>Select Category</span>
                                    </div>
                                    {filteredCategories.map(level1 => (
                                        <div className="dropdown-option" key={level1._id} onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1'); }}>
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
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
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
                                        <div className="dropdown-option" key={level2._id} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
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
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
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
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
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
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel4DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level4}
                                        onChange={(e) => handleSearchChange('level4', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(4, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel4?.map(level4 => (
                                        <div className="dropdown-option" key={level4._id} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
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
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel5DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level5}
                                        onChange={(e) => handleSearchChange('level5', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(5, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel5?.map(level5 => (
                                        <div className="dropdown-option" key={level5._id} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
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
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel6DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level6}
                                        onChange={(e) => handleSearchChange('level6', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(6, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel6?.map(level6 => (
                                        <div className="dropdown-option" key={level6._id} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
                                            <span>{level6.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isAddProductVisible && (
                <div className="add-product-container">
                    <button onClick={() => setIsModalOpen(true)} className="add-product-button">Add Product</button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                        productData={productData}
                        handleChange={handleChange}
                        handleVariantChange={handleVariantChange}
                        selectedCategoryId={selectedCategoryForVariant}
                        selectedVariants={selectedVariants}
                        handleVariantDetailChange={handleVariantDetailChange}
                        addVariantRow={addVariantRow}
                    />
                </div>
            )}
        </div>
    );
};

export default AddProduct;
