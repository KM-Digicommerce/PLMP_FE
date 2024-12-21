// src/components/products/AddProduct.js
import React, { useState, useEffect, useRef } from 'react';
import './AddProduct.css'; // Add your CSS file
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import { Select, MenuItem, FormControl } from '@mui/material';
import axiosInstance from '../../../../src/utils/axiosConfig';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Modal = ({ isOpen, onClose, onSave, productData, handleChange, handleVariantChange, selectedCategoryId, selectedVariants, handleVariantDetailChange, addVariantRow,removeVariantRow,handleDecimalInput, handleDecimalBlur,handleVariantDecimalInput,handleVariantDecimalBlur,selectedCategoryLevel,RetailPrice }) => {
    const [variantOptions, setVariantOptions] = useState([]);
    const [brand, setBrand] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState('');
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
    
    const handleAddBrand = async () => {
        const { value: brandName } = await Swal.fire({
          title: 'Add New Vendor',
          input: 'text',
          inputLabel: 'Vendor Name',
          inputPlaceholder: 'Enter the Vendor name',
          showCancelButton: true,
        });
    
        if (brandName) {
          try {
            await axiosInstance.post(`${process.env.REACT_APP_IP}/createBrand/`, { name: brandName });
            Swal.fire({  title: 'Success!',  text: 'Vendor added successfully!',  icon: 'success',  confirmButtonText: 'OK',  customClass: {    container: 'swal-custom-container',    popup: 'swal-custom-popup',    title: 'swal-custom-title',    confirmButton: 'swal-custom-confirm',    cancelButton: 'swal-custom-cancel',
              },
            });
            fetchBrand();
          } catch (error) {
            console.error('Error adding Vendor:', error);
            Swal.fire({ title: 'Error', text: 'Failed to add Vendor.', icon: 'error', confirmButtonText: 'OK', customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel',
              },
            });
          }
        }
      };
      const fetchBrand = async () => {
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
            setBrand(res.data.data.brand_list);
            try {
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/categoryLevelForChildCategory/`,{
                    category_level: selectedCategoryLevel,
                    category_id: selectedCategoryId,
                  });
               console.log(response.data.data.category_name,'responae');
               setBreadcrumbs(response.data.data.category_name);
            } catch (err) {
                console.error('Error fetching variants:', err);
            }
        } catch (err) {
            console.error('Error fetching variants:', err);
        }
    };
    useEffect(() => {
        if (isOpen && selectedCategoryId) {
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
                     <label htmlFor="model">Model <span className="required">*</span></label>
                    <input type="text" name="model" placeholder="" required value={productData.model} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="mpn">MPN <span className="required">*</span></label>
                    <input type="text" name="mpn" placeholder="" required value={productData.mpn} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="upc_ean">UPC/EAN <span className="required">*</span></label>
                    <input type="text" name="upc_ean" placeholder="" required value={productData.upc_ean} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="breadcrumb">Breadcrumb <span className="required">*</span></label>
                    <input type="text" name="breadcrumb" placeholder="" required value={breadcrumbs} onChange={handleChange} readOnly/>
                    <label htmlFor="brand-select" style={{ marginRight: '10px' }}>
                        Vendor <span className="required">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleAddBrand} // Function to handle the "Add Brand" action
                        style={{ marginLeft: 'auto', backgroundColor: '#007bff', color: '#fff', border: 'none', width:'15%', padding: '8px 8px', borderRadius: '4px', cursor: 'pointer' }} >
                        Add Vendor
                    </button>
                    <select  id="brand-select"  name="brand_id"  required  value={productData.product_obj.brand_id || ''}  onChange={handleChange}  className="dropdown"  style={{ width: '94%', margin: '6px 20px 6px 10px' }} >
                        <option value="">Select Vendor</option>
                        {brand.map((item) => (
                            <option value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="product_name">Product Name <span className="required">*</span></label>
                    <input type="text" name="product_name" placeholder="" required value={productData.product_name} onChange={handleChange}  autoComplete="off" />
                </div>
                <div className="form-section">
                    <div className="CategoryTable-header">
                        <h3 style={{ margin: '6px' }}>Variant and Price Details</h3>
                        <span className="apply-rule-button">
                        {RetailPrice ? `${RetailPrice}X` : '0'}</span>
                        <button onClick={addVariantRow} className="add-variant-button">Add Variant</button>
                    </div>
                    <div className="variant-scroll">
                        {selectedVariants.map((variant, index) => (
                            <div className="variant-row" key={index}>
                                <div className="variant-field">
                                    <label htmlFor="sku">SKU <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="sku"
                                        name="sku"
                                        placeholder="SKU"
                                        required
                                        value={variant.sku}
                                        onChange={(e) => handleVariantDetailChange(e, index)}
                                         autoComplete="off"
                                    />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="unfinishedPrice">Unfinished Price <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        id="unfinishedPrice"
                                        name="unfinishedPrice"
                                        placeholder="Unfinished Price"
                                        required
                                        value={variant.unfinishedPrice}
                                        onChange={(e) =>{handleVariantDetailChange(e, index); handleVariantDecimalInput(e, 'unfinishedPrice', index)}}
                                        onBlur={(e) => handleVariantDecimalBlur(e, 'unfinishedPrice', index)}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="finishedPrice">Finished Price <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        id="finishedPrice"
                                        name="finishedPrice"
                                        placeholder="Finished Price"
                                        required
                                        value={variant.finishedPrice}
                                        onChange={(e) => { handleVariantDetailChange(e, index); handleVariantDecimalInput(e, 'finishedPrice', index)}}
                                        onBlur={(e) => handleVariantDecimalBlur(e, 'finishedPrice', index)}
                                         autoComplete="off"
                                    />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="totalPrice">Retail Price</label>
                                    <input type="number" id="totalPrice" name="totalPrice" value={variant.retailPrice} readOnly />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="Quantity"
                                        required
                                        value={variant.quantity}
                                        onChange={(e) => handleVariantDetailChange(e, index)}
                                    />
                                </div>
                              
                                {variantOptions?.map((variantOption) => (
                                    <div className="variant-dropdown" key={variantOption.type_id}>
                                        <label className="dropdown-label" htmlFor={`variant-${variantOption.type_id}`}>
                                            {variantOption.type_name}
                                        </label>
                                        <FormControl fullWidth variant="outlined" className="dropdown-container">
                                            <Select
                                                labelId={`variant-${variantOption.type_id}`}
                                                value={variant[variantOption.type_id] || ''}
                                                onChange={(e) => handleVariantChange(variantOption.type_id, e.target.value, index)}
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
                                 {index > 0 && (
                                    <button
                                        className="remove-variant-icon-button"
                                        onClick={() => removeVariantRow(index)}
                                        aria-label="Remove Variant"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="icon-trash" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Descriptions</h3>
                    <label htmlFor="long_description">Long Description <span className="required">*</span></label>
                    <textarea name="long_description" placeholder="Long Description" required value={productData.long_description} onChange={handleChange} />
                    <label htmlFor="short_description">Short Description <span className="required">*</span></label>
                    <textarea name="short_description" placeholder="Short Description" required value={productData.short_description} onChange={handleChange} />
                </div>

                <div className="form-section" style={{ display: 'none' }}>
                    <h3 style={{ margin: '6px' }}>Pricing</h3>
                    <div className="pricing-grid">
                        <div className="pricing-field">
                            <label htmlFor="base_price">Base <span className="required">*</span></label>
                            <input
                                type="number"
                                id="base_price"
                                name="base_price"
                                required
                                placeholder="Base"
                                value={productData.base_price}
                                onChange={(e) => {
                                    handleChange(e, 'base_price'); // Pass the event and field name
                                    handleDecimalInput(e, 'base_price');
                                }}
                                onBlur={(e) => handleDecimalBlur(e, 'base_price')}
                            />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="msrp">MSRP <span className="required">*</span></label>
                            <input
                                type="number"
                                id="msrp"
                                name="msrp"
                                required
                                placeholder="MSRP"
                                value={productData.msrp}
                                onChange={(e) => {
                                    handleChange(e, 'msrp'); // Pass the event and field name
                                    handleDecimalInput(e, 'msrp');
                                }}
                                onBlur={(e) => handleDecimalBlur(e, 'msrp')}
                            />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="discount_price">Discount <span className="required">*</span></label>
                            <input
                                type="number"
                                id="discount_price"
                                name="discount_price"
                                required
                                placeholder="Discount"
                                value={productData.discount_price || ''}
                                onChange={(e) => {
                                    handleChange(e, 'discount_price'); // Pass the event and field name
                                    handleDecimalInput(e, 'discount_price');
                                }}
                                onBlur={(e) => handleDecimalBlur(e, 'discount_price')}
                            />
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
              


                <button onClick={onSave} className="save-button">Add Product</button>
            </div>
        </div>
    );
};

const AddProduct = (categories) => {
    const [lastLevelCategoryIds, setLastLevelCategoryIds] = useState([]);
    const [isAddProductVisible, setIsAddProductVisible] = useState(false); 
    const [clearBtn, setShowclearBtn] = useState(false);
    const [RetailPrice, setShowRetailPrice] = useState([0]);
    const [RetailPriceOption, setShowRetailPriceOption] = useState([]);




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
        sku: '', unfinishedPrice: '', finishedPrice: '', quantity: '',totalPrice: 0, retailPrice:0, options: []
    }]);

    const addVariantRow = () => {
        setSelectedVariants(prevVariants => [
            ...prevVariants,
            { sku: '', unfinishedPrice: '', finishedPrice: '', quantity: '', basePrice: '', totalPrice: 0,retailPrice:0, options: [] }
        ]);
    };
    const removeVariantRow = (indexToRemove) => {
        setSelectedVariants((prevVariants) =>
            prevVariants.filter((_, index) => index !== indexToRemove)
        );
    };
    const handleDecimalInput = (e, fieldName) => {
        const value = e.target.value;
        if (/^\d*(\.\d{0,2})?$/.test(value)) {
          setProductData((prevData) => ({
            ...prevData,
            [fieldName]: value,
          }));   } };

      const handleDecimalBlur = (e, fieldName) => {
        const value = parseFloat(e.target.value).toFixed(2);
        setProductData((prevData) => ({
          ...prevData,
          [fieldName]: isNaN(value) ? '' : value,   })); };

      const handleVariantDecimalInput = (e, fieldName, index) => {
        const value = e.target.value;
        if (/^\d*(\.\d{0,2})?$/.test(value)) {
          const updatedVariants = [...selectedVariants];
          updatedVariants[index][fieldName] = value;
          setSelectedVariants(updatedVariants);  } };
      
      const handleVariantDecimalBlur = (e, fieldName, index) => {
        const value = parseFloat(e.target.value).toFixed(2);
        const updatedVariants = [...selectedVariants];
        updatedVariants[index][fieldName] = isNaN(value) ? '' : value;
        setSelectedVariants(updatedVariants);
      };
      
    const handleVariantDetailChange = (e, index) => {
        const { name, value } = e.target;
        setSelectedVariants(prev => {
            const updatedVariants = [...prev];
            updatedVariants[index][name] = value;
            if (RetailPriceOption === 'finished_price' && name === 'finishedPrice') {
                updatedVariants[index].retailPrice = RetailPrice * parseFloat(updatedVariants[index].finishedPrice || 0);
            }
            else if (RetailPriceOption === 'unfinished_price' && name === 'unfinishedPrice') {
                updatedVariants[index].retailPrice = RetailPrice * parseFloat(updatedVariants[index].unfinishedPrice || 0);
            }
            return updatedVariants;
        });
    };
    const handleChange = async (e) => {
        const { name, value } = e.target;
        console.log(value,'Values');
        
        if (name === 'brand_id' && value !== '') {
            try {
                const payload = {
                  category_id: selectedCategoryForVariant,
                  brand_id: value,
                };
                  const response =  await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainRetailBrandPrice/`, payload );
                  setShowRetailPrice(response.data.data.price); 
                  setShowRetailPriceOption(response.data.data.price_option);
            }
            catch (error) {
                  console.error("Error sending Vendor and category name:", error);
                  Swal.fire({  title: "Error",  text: "An error occurred while sending Vendor and category name.",  icon: "error",  confirmButtonText: "OK",customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', }, });
                }
        }
         if (name === 'brand_id' && value === '') {
            setShowRetailPrice([0]); 
        }
        setProductData({
            ...productData,
            product_obj: {
                ...productData.product_obj,
                [name]: value
            }
        });
    };
    const handleVariantChange = (typeId, optionId, index) => {        
        setSelectedVariants(prev => {
          const updatedVariants = [...prev];
          const updatedVariant = updatedVariants[index];
          if (!updatedVariant.options) {
            updatedVariant.options = [];
          } 
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
        if (RetailPriceOption === 'finished_price') {
            updatedVariant.retailPrice = RetailPrice * (parseFloat(updatedVariant.finishedPrice) || 0);
        }
        else if (RetailPriceOption === 'unfinished_price') {
            updatedVariant.retailPrice = RetailPrice * (parseFloat(updatedVariant.unfinishedPrice) || 0);
        }
          return updatedVariants;
        });
      };
    
    const handleSave = async () => {
        if (!productData.product_obj.model || !productData.product_obj.mpn || !productData.product_obj.upc_ean|| 
            !productData.product_obj.brand_id || !productData.product_obj.product_name || 
            !productData.product_obj.short_description ) {
            alert("Please fill in all required fields.");
            return;
        }
    
        const invalidVariants = selectedVariants.some(variant => 
            !variant.sku || !variant.unfinishedPrice || !variant.finishedPrice || !variant.quantity
        );
        if (invalidVariants) {
            alert("Please fill in all required fields for variants.");
            return;
        }
        try {
            const payload = {
                product_obj: {
                    ...productData.product_obj,
                    varients: selectedVariants.map(variant => ({
                        sku_number: variant.sku,
                        un_finished_price: variant.unfinishedPrice,
                        finished_price: variant.finishedPrice,
                        quantity: variant.quantity,
                        total_price: variant.totalPrice,
                        retail_price: variant.retailPrice,
                        options: variant.options.map(option => ({
                            option_name_id: option.option_name_id,
                            option_value_id: option.option_value_id
                        }))
                    }))
                }
            };
            const response = await axiosInstance.post(
                `${process.env.REACT_APP_IP}/createProduct/`,
                payload
            );            
            if (response.data?.data?.status === true) {
                Swal.fire({
                    title: 'Success', text: 'Product added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
                      container: 'swal-custom-container',
                      popup: 'swal-custom-popup',
                      title: 'swal-custom-title',
                      confirmButton: 'swal-custom-confirm',
                      cancelButton: 'swal-custom-cancel',
                    },
                  })
                setProductData({
                    product_obj: { model: '', mpn: '', upc_ean: '', breadcrumb: '', brand_id: '', product_name: '', long_description: '', short_description: '', features: '', attributes: '', tags: '', msrp: '', base_price: '', key_features: '', varients: [{
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
    const [selectedCategoryLevel, setSelectedCategoryLevel] = useState('');
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
        setShowclearBtn(false);
        setIsCategoryDropdownOpen(false);
        setIsLevel2DropdownOpen(false);
        setIsLevel3DropdownOpen(false);
        setIslevel4DropdownOpen(false);
        setIslevel5DropdownOpen(false);
        setIslevel6DropdownOpen(false);
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
        const selectedIdString = String(id);
        setSelectedCategoryLevel(category_level);
        if (id && category_level) {
            setShowclearBtn(true);
        }
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
        const selectedValue = id || '';        
        if (selectedValue !== '') {
            switch (level) {
                case 4:
                    let level1Category, level2Category, level3Category;
                    categories.categories.category_list.some(level1 => {
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
    
                    // Set the selected categories and reset lower levels
                    setSelectedCategoryId(level1Category._id);
                    setselectedLevel2Id(level2Category._id);
                    setSelectedLevel3Id(level3Category._id);
                    setSelectedlevel4(selectedValue);
                    setSelectedlevel5('');
                    setSelectedlevel6('');
                    break;
    
                case 5:
                    const level4Category = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .flatMap(level3 => level3.level_three_category_list)
                        .find(level4 => level4._id === selectedValue);
    
                    if (!level4Category) {
                        console.error('Level 4 category not found for ID:', selectedValue);
                        return;
                    }
    
                    const level3CategoryForLevel5 = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .find(level3 => level3._id === level4Category.level_three_category_id);
    
                    if (!level3CategoryForLevel5) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel5._id);
                        return;
                    }
    
                    const level2CategoryForLevel5 = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .find(level2 => level2.level_two_category_list.some(level3 => level3._id === level3CategoryForLevel5._id));
    
                    if (!level2CategoryForLevel5) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel5._id);
                        return;
                    }
    
                    const level1CategoryForLevel5 = categories.categories.category_list.find(level1 =>
                        level1.level_one_category_list.some(level2 => level2._id === level2CategoryForLevel5._id)
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
                    const level5Category = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .flatMap(level3 => level3.level_three_category_list)
                        .flatMap(level4 => level4.level_four_category_list)
                        .find(level5 => level5._id === selectedValue);
    
                    if (!level5Category) {
                        console.error('Level 5 category not found for ID:', selectedValue);
                        return;
                    }
    
                    const level4CategoryForLevel6 = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .flatMap(level3 => level3.level_three_category_list)
                        .find(level4 => level4._id === level5Category.level_four_category_id);
    
                    if (!level4CategoryForLevel6) {
                        console.error('Level 4 category not found for ID:', level4CategoryForLevel6._id);
                        return;
                    }
    
                    const level3CategoryForLevel6 = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .find(level3 => level3._id === level4CategoryForLevel6.level_three_category_id);
    
                    if (!level3CategoryForLevel6) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel6._id);
                        return;
                    }
    
                    const level2CategoryForLevel6 = categories.categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .find(level2 => level2.level_two_category_list.some(level3 => level3._id === level3CategoryForLevel6._id));
    
                    if (!level2CategoryForLevel6) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel6._id);
                        return;
                    }
    
                    const level1CategoryForLevel6 = categories.categories.category_list.find(level1 =>
                        level1.level_one_category_list.some(level2 => level2._id === level2CategoryForLevel6._id)
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
    if (!level6Categories) {
        console.log(level6Categories);
    }
    return (
        <div>
            <div className='CategoryTable-header'>
                <h2 className='header_cls_prod'>Products Schema</h2>
            </div>
            <div className='CategoryContainer'>
            {clearBtn && (
      <button className='clear_cat_btn' onClick={() => handleLevelClear('')} >Clear all</button>
      )}
                <div className='DropdownsContainer'>
                    {/* Level 1 Dropdown */}
                    <div className='DropdownColumn' ref={categoryDropdownRef}>
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
                                        <div className="dropdown-option"  onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1'); }}>
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
                                        <div className="dropdown-option"  onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
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
                                        <div className="dropdown-option"  onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
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
                                        <div className="dropdown-option"  onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
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
                                        <div className="dropdown-option"  onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
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
                                        <div className="dropdown-option"  onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
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
                        removeVariantRow={removeVariantRow}
                        handleDecimalBlur={handleDecimalBlur}
                        handleDecimalInput={handleDecimalInput}
                        handleVariantDecimalInput={handleVariantDecimalInput}
                        handleVariantDecimalBlur={handleVariantDecimalBlur}
                        selectedCategoryLevel={selectedCategoryLevel}
                        RetailPrice={RetailPrice}
                    />
                </div>
            )}
        </div>
    );
};

export default AddProduct;
