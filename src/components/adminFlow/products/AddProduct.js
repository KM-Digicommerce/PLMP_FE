// src/components/products/AddProduct.js
import React, { useState, useEffect, useRef } from 'react';
import './AddProduct.css'; // Add your CSS file
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import axiosInstance from '../../../../src/utils/axiosConfig';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation } from 'react-router-dom';

const Modal = ({ isOpen, onClose, onSave, productData, handleChange,handlePaste,handleTextareaChange, handleVariantChange,selectedCategoryId, selectedVariants, handleVariantDetailChange, addVariantRow,removeVariantRow,handleDecimalInput, handleDecimalBlur,handleVariantDecimalInput,handleVariantDecimalBlur,selectedCategoryLevel,RetailPrice }) => {
    const [variantOptions, setVariantOptions] = useState([]);
    const [brand, setBrand] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDropdownIndex, setOpenDropdownIndex] = useState(null); // Track which dropdown is open

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };
    
      const filteredVariantOptions = variantOptions?.map((variantOption) => ({
        ...variantOption,
        filteredOptions: variantOption.option_value_list?.filter((option) =>
          option.type_value_name?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }));
      const handleDropdownClick = (rowIndex, dropdownIndex) => {
        const currentIndex = `${rowIndex}-${dropdownIndex}`;
        setOpenDropdownIndex((prevIndex) => (prevIndex === currentIndex ? null : currentIndex));
    };
      const handleVariantSelect = (typeId, valueId, index) => {
        handleVariantChange(typeId, valueId, index); 
            setOpenDropdownIndex(null);
      };
      const handleOutsideClick = (event) => {
        if (!event.target.closest(".variant-row")) {
            setOpenDropdownIndex(null); 
        }
        setSearchQuery('');
    };
      useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
          document.removeEventListener("click", handleOutsideClick);
        };
      }, []);
    const handleAddBrand = async () => {
        const { value: formValues } = await Swal.fire({
              html: `
             <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
          <button 
            id="close-popup-btn" 
            style="position: absolute; top: -20px; right: -71px; background: transparent; border: none; font-size: 26px; font-weight: bold; cursor: pointer; color: #555;">
            &times;
          </button>
          <h2 style="margin-bottom: 20px; font-size: 24px; font-weight: bold; color: #333;">Add New Vendor</h2>
        </div>
        <div>
          <input id="vendor-name" class="swal2-input vendor_input" autocomplete="off" placeholder="Enter Vendor Name" style="margin-bottom: 10px;">
            <input id="vendor-email" type="email" class="swal2-input vendor_input" autocomplete="off" placeholder="Enter Vendor Email Address" style="margin-bottom: 10px;">
          <input id="contact-info" class="swal2-input vendor_input" autocomplete="off" placeholder="Enter Contact Information" style="margin-bottom: 10px;">
          <textarea id="vendor-address" class="swal2-input vendor_input" autocomplete="off" placeholder="Enter Vendor Address" style="margin-bottom: 10px; width: 97%; height: 80px; padding:6px;"></textarea>
          <input id="vendor-website" type="url" class="swal2-input vendor_input" autocomplete="off" placeholder="Enter Vendor Website" style="margin-bottom: 10px;">
            <label for="vendor-logo" style="display: inline-block; margin-top: 10px; font-size: 14px; font-weight: bold; color: #555;">Vendor Logo:</label>
          <input id="vendor-logo" type="file" accept="image/*" class="swal2-file-input" style="margin-top: 10px;">
        </div>
            `,
              showCancelButton: true,
              focusConfirm: false,
              didOpen: () => {
                // Add close functionality to the button after the popup renders
                const closeButton = document.getElementById('close-popup-btn');
                if (closeButton) {
                  closeButton.addEventListener('click', () => {
                    Swal.close();
                  });
                }
              },
              preConfirm: () => {
                const name = document.getElementById('vendor-name').value;
                const email = document.getElementById('vendor-email').value;
                const address = document.getElementById('vendor-address').value;
                const website = document.getElementById('vendor-website').value;
                const mobile_number = document.getElementById('contact-info').value;
                const logo = document.getElementById('vendor-logo').files[0];
                if (!name) {
                  Swal.showValidationMessage('Please enter a vendor name');
                }
                return { name, email,address,website,mobile_number, logo };
              },
              customClass: { container: 'swal-custom-container swal-overflow', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-brand', cancelButton: 'swal-custom-cancel-brand',
              },
            });
    
        if (formValues) {            
            const { name, logo, email, address, website, mobile_number } = formValues;
          try {
            const response = await axiosInstance.post( `${process.env.REACT_APP_IP}/createBrand/`,  formValues,
                { headers: { 'Content-Type': 'multipart/form-data',  }, } );
                   if (response.data.data.is_created === true) {
                             Swal.fire({  title: 'Success!',  text: 'Vendor added successfully!',  icon: 'success',  confirmButtonText: 'OK',
                               customClass: {  container: 'swal-custom-container',  popup: 'swal-custom-popup',  title: 'swal-custom-title',  confirmButton: 'swal-custom-confirm',  cancelButton: 'swal-custom-cancel',
                               },
                             });
                           }
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
                    <input type="text" name="model" className="add_input_field" placeholder="" required value={productData.model} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="mpn">MPN <span className="required">*</span> </label>
                    <input type="text" name="mpn" className="add_input_field" placeholder="" required value={productData.mpn} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="upc_ean">UPC/EAN <span className="required">*</span></label>
                    <input type="text" name="upc_ean" className="add_input_field" placeholder="" required value={productData.upc_ean} onChange={handleChange}  autoComplete="off" />
                    <label htmlFor="breadcrumb">Breadcrumb <span className="required">*</span></label>
                    <input type="text" name="breadcrumb" className="add_input_field" placeholder="" required value={breadcrumbs} onChange={handleChange} readOnly/>
                    <label htmlFor="brand-select" style={{ marginRight: '10px' }}>
                        Vendor <span className="required">*</span>
                    </label>
                    <button
                        type="button"
                        onClick={handleAddBrand} // Function to handle the "Add Brand" action
                        style={{ marginLeft: 'auto', backgroundColor: '#007bff', color: '#fff', border: 'none', width:'15%', padding: '8px 8px', borderRadius: '4px', cursor: 'pointer' }} >
                        Add Vendor
                    </button>
                    <select  id="brand-select"  name="brand_id"  required  value={productData.product_obj.brand_id || ''}  onChange={handleChange}  className="dropdown"  style={{ width: '97%', margin: '6px 20px 6px 10px',border:'1px solid #ccc',borderRadius:'4px',padding:'10px 0px 10px 0px' }} >
                        <option value="">Select Vendor</option>
                        {brand.map((item) => (
                            <option value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor="product_name">Product Name <span className="required">*</span></label>
                    <input type="text" name="product_name" className="add_input_field" placeholder="" required value={productData.product_name} onChange={handleChange}  autoComplete="off" />
                    <div className="form-group">
                                        <label htmlFor="dimensions">Dimensions</label>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px', padding:'6px 20px 6px 10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="height" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Height</label>
                                                <input type="number" id="height" name="height" className="dimensions" style={{ width: '60%' }}  value={productData.height} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="width" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Width</label>
                                            <input type="number" id="width" name="width" className="dimensions" style={{ width: '60%' }} value={productData.width} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="depth" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Depth</label>
                                                <input type="number" id="depth" name="depth" className="dimensions" style={{ width: '60%' }} value={productData.depth} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="length" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}}>Length</label>
                                                <input type="number" id="length" name="length" className="dimensions" style={{ width: '60%' }} value={productData.length} onChange={handleChange}
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label htmlFor="units" style={{fontSize: '12px',color:'#a7a7a7', padding:'7px 0px 0px 0px'}} >Unit</label>
                                                <select id="units" name="units" className="dimensions-unit" style={{ width: '80%' }} value={productData.units} onChange={handleChange} >
                                                    <option value="in">in</option>
                                                    <option value="mm">mm</option>
                                                    <option value="ft">ft</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                </div>
                <div className="form-section">
                    <div className="CategoryTable-header">
                        <h3 style={{ margin: '6px' }}>Variant & Price</h3>
                        {RetailPrice === 1 ? (
                              <>
                              <span className="apply-rule-button">1X</span>
                              <span style={{padding:'10px 0px 0px 0px'}}>(by default)</span>
                          </>
                        ) : (
                            <span className="apply-rule-button">{`${RetailPrice}X`}</span>                          
                        )}
                        <button onClick={addVariantRow} className="add-variant-button">Add Variant</button>
                    </div>
                    <div className="variant-scroll">
                        {selectedVariants.map((variant, index) => (
                            <div className="variant-row" key={index}>
                                <div className="variant-field">
                                    <label htmlFor="sku">SKU <span className="required">*</span></label>
                                    <input  type="text"  id="sku"  name="sku"  placeholder="SKU"  required  value={variant.sku}  onChange={(e) => handleVariantDetailChange(e, index)}   autoComplete="off" />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="unfinishedPrice">Unfinished Price <span className="required">*</span></label>
                                    <input  type="number"  id="unfinishedPrice"  name="unfinishedPrice"  placeholder="0"  required  value={variant.unfinishedPrice}  onChange={(e) =>{handleVariantDetailChange(e, index); handleVariantDecimalInput(e, 'unfinishedPrice', index)}}onBlur={(e) => handleVariantDecimalBlur(e, 'unfinishedPrice', index)}  autoComplete="off"  onWheel={(e) => e.target.blur()} />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="finishedPrice">Finished Price <span className="required">*</span></label>
                                    <input type="number" id="finishedPrice" name="finishedPrice" placeholder="0" required value={variant.finishedPrice}
                                        onChange={(e) => { handleVariantDetailChange(e, index); handleVariantDecimalInput(e, 'finishedPrice', index)}}
                                        onBlur={(e) => handleVariantDecimalBlur(e, 'finishedPrice', index)}
                                         autoComplete="off" onWheel={(e) => e.target.blur()}
                                    />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="totalPrice">Retail Price</label>
                                    <input type="number" id="totalPrice" name="totalPrice" value={variant.retailPrice.toFixed(2)} readOnly />
                                </div>
                                <div className="variant-field">
                                    <label htmlFor="quantity">Quantity <span className="required">*</span></label>
                                    <input  type="number"  id="quantity"  name="quantity"  placeholder="0"  required  value={variant.quantity}  onChange={(e) => handleVariantDetailChange(e, index)}  onWheel={(e) => e.target.blur()}
                                    />
                                </div>
                              
                                {filteredVariantOptions?.map((variantOption, dropdownIndex) => (
                                    <div className="variant-dropdown" key={variantOption.type_id} style={{ position: 'relative' }}>
                                        <label className="dropdown-label" htmlFor={`variant-${variantOption.type_id}`}>
                                            {variantOption.type_name}
                                        </label>
                                        <div className="custom-dropdown-header"  onClick={() => handleDropdownClick(index, dropdownIndex)} 
                                            style={{  width: '95%', padding: '10px 0px 10px 4px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '14px',  }} >
                                            {variant[variantOption.type_id]
                                                ? variantOption.option_value_list?.find(option => option.type_value_id === variant[variantOption.type_id])?.type_value_name
                                                : "Select Variant Value"
                                            }
                                        </div>
                                        {openDropdownIndex === `${index}-${dropdownIndex}` && (
                                            <div
                                                className="custom-dropdown-list"
                                                style={{
                                                    position: 'absolute', top: '100%', width: '90%', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', borderRadius: '5px', maxHeight: '150px', overflowY: 'auto', zIndex: 1000, border: '1px solid #ccc', padding: '8px',
                                                }}  >
                                                <input
                                                    type="text"
                                                    placeholder="Search options..."
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    style={{
                                                        width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px',
                                                    }}  />

                                                {/* Option list */}
                                                {variantOption.filteredOptions?.map((option) => (
                                                    <div
                                                        key={option.type_value_id}
                                                        className="custom-dropdown-option"
                                                        onClick={() => handleVariantSelect(variantOption.type_id, option.type_value_id, index)}
                                                        style={{ padding: '8px', cursor: 'pointer', backgroundColor: variant[variantOption.type_id] === option.type_value_id ? '#d7ffe6' : '#fff', borderRadius: '4px', fontSize: '14px',
                                                        }}   >
                                                        {option.type_value_name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                                 {index > 0 && (
                                    <button className="remove-variant-icon-button" onClick={() => removeVariantRow(index)} aria-label="Remove Variant"  >
                                        <FontAwesomeIcon icon={faTrash} className="icon-trash" />
                                    </button>  )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Descriptions</h3>
                    <label htmlFor="long_description">Long Description <span className="required">*</span></label>
                    <textarea name="long_description" placeholder="Long Description" required value={productData.long_description} onChange={handleChange} />
                    {/* <textarea
    name="long_description"
    placeholder="Long Description"
    required
    value={productData.product_obj.long_description}
    onChange={handleChange}
    onKeyDown={(e) => handleTextareaChange(e, 'long_description')}
    onPaste={(e) => handlePaste(e, 'long_description')}
/> */}
                    <label htmlFor="short_description">Short Description <span className="required">*</span></label>
                    <textarea name="short_description" placeholder="Short Description" required value={productData.short_description} onChange={handleChange} />
                    {/* <textarea
    name="short_description"
    placeholder="Short Description"
    required
    value={productData.product_obj.short_description}
    onChange={handleChange}
    onKeyDown={(e) => handleTextareaChange(e, 'short_description')}
    onPaste={(e) => handlePaste(e, 'short_description')}
/> */}
                </div>
                <div className="form-section" style={{ display: 'none' }}>
                    <h3 style={{ margin: '6px' }}>Pricing</h3>
                    <div className="pricing-grid">
                        <div className="pricing-field">
                            <label htmlFor="base_price">Base <span className="required">*</span></label>
                            <input  type="number"  id="base_price"  name="base_price"  required  placeholder="Base"  value={productData.base_price}  onChange={(e) => {
                                    handleChange(e, 'base_price'); // Pass the event and field name
                                    handleDecimalInput(e, 'base_price');
                                }}
                                onBlur={(e) => handleDecimalBlur(e, 'base_price')}
                            />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="msrp">MSRP <span className="required">*</span></label>
                            <input  type="number"  id="msrp"  name="msrp"  required  placeholder="MSRP"  value={productData.msrp}  onChange={(e) => {
                                    handleChange(e, 'msrp'); // Pass the event and field name
                                    handleDecimalInput(e, 'msrp');
                                }}
                                onBlur={(e) => handleDecimalBlur(e, 'msrp')}
                            />
                        </div>
                        <div className="pricing-field">
                            <label htmlFor="discount_price">Discount <span className="required">*</span></label>
                            <input type="number" id="discount_price" name="discount_price" required placeholder="Discount" value={productData.discount_price || ''} onChange={(e) => {
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
                    {/* <textarea name="features" placeholder="Features" value={productData.features} onChange={handleChange} />
                    <textarea name="attributes" placeholder="Attributes" value={productData.attributes} onChange={handleChange} />
                    <textarea name="tags" placeholder="Tags" value={productData.tags} onChange={handleChange} />
                    <textarea name="key_features" placeholder="Key Features" value={productData.key_features} onChange={handleChange} /> */}
                    <textarea name="features" placeholder="Features" required value={productData.product_obj.features} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'features')} onPaste={(e) => handlePaste(e, 'features')} />
                    <textarea name="attributes" placeholder="Attributes" value={productData.attributes} onChange={handleChange} />
                    {/* <textarea name="attributes" placeholder="Attributes" required value={productData.product_obj.attributes} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'attributes')} onPaste={(e) => handlePaste(e, 'attributes')} /> */}
                    <textarea name="tags" placeholder="Tags" required value={productData.product_obj.tags} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'tags')} onPaste={(e) => handlePaste(e, 'tags')} />
                    <textarea name="key_features" placeholder="Key Features" required value={productData.product_obj.key_features} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'key_features')} onPaste={(e) => handlePaste(e, 'key_features')} />
                </div>
                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Raw Data</h3>
                    {/* <label htmlFor="features_notes">Standard Features/Notes:</label> */}
                    {/* <textarea name="features_notes" placeholder="Standard Features Notes" required value={productData.features_notes} onChange={handleChange} /> */}
                    <textarea name="features_notes" placeholder="Standard Features Notes" required value={productData.product_obj.features_notes} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'features_notes')} onPaste={(e) => handlePaste(e, 'features_notes')} />
                </div>
                <div className="form-section">
                    <h3 style={{ margin: '6px' }}>Options</h3>
                    {/* <label htmlFor="option_str">Option </label> */}
                    {/* <textarea name="option_str" placeholder="Options" required value={productData.option_str} onChange={handleChange} /> */}
                    <textarea name="option_str" placeholder="Options" required value={productData.product_obj.option_str} onChange={handleChange} onKeyDown={(e) => handleTextareaChange(e, 'option_str')} onPaste={(e) => handlePaste(e, 'option_str')} />
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
    const [RetailPrice, setShowRetailPrice] = useState(1);
    const [RetailPriceOption, setShowRetailPriceOption] = useState([]);
    useEffect(() => {
        const fetchCategoryData = async () => {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
            setLastLevelCategoryIds(res.data.data.last_level_category);
        };

        fetchCategoryData();
    }, []);
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
       const  [productData, setProductData] = useState({
            product_obj: {
                category_id: '',
                category_name: '',
                model: '',
                mpn: '',
                upc_ean: '',
                breadcrumb: '',
                brand_id: '',
                product_name: '',
                height:'',
                width:'',
                depth:'',
                length:'',
                units:'in',
                long_description: '',
                short_description: '',
                features: '',
                attributes: '',
                tags: '',
                msrp: '',
                base_price: '',
                key_features: '',
                features_notes:'',
                option_str:'',
                varients: [
                    {
                        sku_number: '',
                        finished_price: '0',
                        un_finished_price: '0',
                        quantity: '0',
                        options: []
                    }
                ]
            }
        });
        useEffect(() => {
            // Check if the state contains the productData
            if (location.state && location.state.productData) {
              setProductData(location.state.productData);
              setIsModalOpen(true);
            }
          }, [location]);       
    const [selectedVariants, setSelectedVariants] = useState([{
        sku: '', unfinishedPrice: '', finishedPrice: '', quantity: '',totalPrice: 0, retailPrice:0, options: []
    }]);
    const handleLoadNewmodel = () => {
        setProductData({
            product_obj: { model: '', mpn: '', upc_ean: '', breadcrumb: '', brand_id: '', product_name: '',  height:'', width:'', depth:'', length:'', units:'in',long_description: '', short_description: '', features: '', attributes: '', tags: '', msrp: '', base_price: '', key_features: '',features_notes:'',  option_str:'', varients: [{
                    sku_number: '',
                    finished_price: '0',
                    un_finished_price: '0',
                    quantity: '0',
                    options: []
                }],
                category_id: '',
                category_name: ''
            }
        });
        setSelectedVariants([{  sku: '',   unfinishedPrice: '',   finishedPrice: '',   quantity: '',   totalPrice: 0,   retailPrice: 0,   options: []  }]);
        
    };
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
            else{                
                updatedVariants[index].retailPrice = 1 * (parseFloat(updatedVariants[index].finishedPrice) || 0);
            }
            return updatedVariants;
        });
    };
    const handleTextareaChange = (e, fieldName) => {
        const { name, value } = e.target;
        // Ensure the first line starts with a bullet point if the field is empty
        if (value === "" && e.key === "Enter") {
          setProductData({
            ...productData,
            product_obj: {
              ...productData.product_obj,
              [fieldName]: "* "
            }
          });
          return; }
        // Handle Enter key press: Add bullet point before the new line
        if (e.key === "Enter") {
          e.preventDefault(); // Prevent the default enter action
          const cursorPosition = e.target.selectionStart;
          const updatedValue = value.slice(0, cursorPosition) + "\n* " + value.slice(cursorPosition);
          setProductData({
            ...productData,
            product_obj: {
              ...productData.product_obj,
              [fieldName]: updatedValue
            }
          });
        }
        // Normal typing and space handling
        if (e.key === " " || e.key !== "Enter") {
          setProductData({
            ...productData,
            product_obj: {
              ...productData.product_obj,
              [fieldName]: value
            }
          });
        }
      };
      // Handle paste: Format pasted content by adding * to each line
      const handlePaste = (e, fieldName) => {
        e.preventDefault(); // Prevent the default paste behavior
        const pastedText = e.clipboardData.getData("text");
        // Get the current cursor position
        const cursorPosition = e.target.selectionStart;
        // Get the current value in the textarea before and after the cursor position
        const { value } = e.target;
        const currentTextBeforeCursor = value.slice(0, cursorPosition);
        const currentTextAfterCursor = value.slice(cursorPosition);
        // Check if the last line has '*' (i.e., it's already part of a list)
        const lastLine = currentTextBeforeCursor.split('\n').pop().trim();
        // Split the pasted text by newlines and trim each line
        const pastedLines = pastedText.split("\n").map(line => line.trim());
        if (lastLine.startsWith('*')) {
            // If the last line has '*', treat the paste as appending to the last item
            const formattedText = pastedLines.join(' '); // Join all pasted lines into one line
            const updatedValue = currentTextBeforeCursor + ' ' + formattedText + currentTextAfterCursor;
            setProductData({
                ...productData,
                product_obj: {
                    ...productData.product_obj,
                    [fieldName]: updatedValue
                }
            });
        } else {
            // Otherwise, format the pasted lines as new list items, each with a '*' at the start
            const formattedText = pastedLines.map(line => `* ${line}`).join("\n");
            const updatedValue = currentTextBeforeCursor + '\n' + formattedText + currentTextAfterCursor;
            setProductData({
                ...productData,
                product_obj: {
                    ...productData.product_obj,
                    [fieldName]: updatedValue
                }
            });
        }
    };
       
    const handleChange = async (e) => {
        let updatedValue = '';
        const { name, value } = e.target;
        console.log(value,'value');
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
                if (name === 'brand_id' && value === '') {
                    setShowRetailPrice([0]); 
                }
               
        }
        if (name === 'height' && value !== '' || name === 'width' && value !== '' || name === 'depth' && value !== '' || name === 'length' && value !== '') {
             updatedValue = !isNaN(value) && value !== '' ? parseFloat(value).toFixed(2) : value;
        }
        else{
            console.log('else sfsfd',name);
            
            updatedValue = value;
        }

        setProductData({
            ...productData,
            product_obj: {
                ...productData.product_obj,
                [name]: updatedValue
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
        else{
            updatedVariant.retailPrice = 1 * (parseFloat(updatedVariant.finishedPrice) || 0);
        }
          return updatedVariants;
        });
      };
    
    const handleSave = async () => {        
        if (!productData.product_obj.model || !productData.product_obj.mpn || !productData.product_obj.upc_ean || !productData.product_obj.brand_id || !productData.product_obj.product_name || !productData.product_obj.short_description ) {            
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
            const response = await axiosInstance.post( `${process.env.REACT_APP_IP}/createProduct/`,  payload );            
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
                    product_obj: { model: '', mpn: '', upc_ean: '', breadcrumb: '', brand_id: '', product_name: '',  height:'', width:'', depth:'', length:'', units:'in', long_description: '', short_description: '', features: '', attributes: '', tags: '', msrp: '', base_price: '', key_features: '',features_notes:'', option_str:'', varients: [{
                            sku_number: '',
                            finished_price: '0',
                            un_finished_price: '0',
                            quantity: '0',
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
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())  );

    const levelOneCategory = categories.categories.category_list.find(level1 => level1._id === selectedCategoryId);

    const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';
    const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery) );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;

    const filteredCategoriesLevel3 = levelTwoCategory
        ? levelTwoCategory.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 =>
            level3.name.toLowerCase().includes(safeSearchQuery) );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;

    const filteredCategoriesLevel4 = levelThreeCategory ? levelThreeCategory.level_three_category_list.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;

    const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));

    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;

    const filteredCategoriesLevel6 = levelFiveCategory ? levelFiveCategory.level_five_category_list.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));

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
        if (isIdInLastLevel) {  setIsAddProductVisible(true); }
        else {    setIsAddProductVisible(false); }
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
            console.log(res,'response');
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
                    setSelectedCategoryId(level1Category._id);
                    setselectedLevel2Id(level2Category._id);
                    setSelectedLevel3Id(level3Category._id);
                    setSelectedlevel4(selectedValue);
                    setSelectedlevel5('');
                    setSelectedlevel6('');
                    break;
    
                case 5:
                    let level4Category, level3CategoryForLevel5, level2CategoryForLevel5, level1CategoryForLevel5;
                    categories.categories.category_list.some(level1 => {
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
                    categories.categories.category_list.some(level1 => {
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
        <div className='addproduct-schema'>
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
                                <span className="dropdown-icons"> <ChevronDownIcon style={{ fontSize: 25, float: "right" }} /> </span>
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
                        onClose={() => {  setIsModalOpen(false);   handleLoadNewmodel();  }}
                        onSave={handleSave}
                        productData={productData}
                        handleChange={handleChange}
                        handlePaste={handlePaste}
                        handleTextareaChange={handleTextareaChange}
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