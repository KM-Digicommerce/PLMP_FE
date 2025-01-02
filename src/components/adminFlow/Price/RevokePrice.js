import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import './RevokePrice.css';
import Swal from "sweetalert2";

const RevokePrice = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const dropdownRef = useRef(null);
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedBrandForVariant, setSelectedBrandForVariant] = useState(null);
  const [selectedBrandIdForVariant, setSelectedBrandIdForVariant] = useState(null);
  const [variantTypeValues, setVariantTypeValues] = useState([]); // Example data, replace with API call
  const [selectedVariantValues, setSelectedVariantValues] = useState([]);
  const [selectedVariantValueIds, setSelectedVariantValueIds] = useState([]);
  const [dropdownOpenForValue, setDropdownOpenForValue] = useState(false);
  const [currentPriceInput, setCurrentPriceInput] = useState("");
  const [previousPriceInput, setPreviousPriceInput] = useState("");
  const [currentVariantPriceInput, setCurrentVariantPriceInput] = useState("");
  const [previousVariantPriceInput, setPreviousVariantPriceInput] = useState("");
  const dropdownRefForValue = useRef(null);
  const [priceOption, setPriceOption] = useState('');
  const [variantpriceOption, setVariantPriceOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
   const [formSubmittedForVariant, setFormSubmittedForVariant] = useState(false);
  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      Swal.fire({ title: "Error", text: "Failed to fetch vendors.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`);
      setCategories(response.data.data.last_level_category || []);  
      setFilteredCategories(response.data.data.last_level_category || []);
    } catch (error) {
      Swal.fire({ title: "Error", text: "Failed to fetch Categories.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {    }
  };
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
      const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(query)
    );
    setFilteredCategories(filtered);
  };
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
  
    if (categoryId === "all") {
      if (selectedCategories.length === 1 && selectedCategories[0].name === "Apply to all categories") {
        setSelectedCategories([]);
        setSelectedCategoryIds([]);
    } else {
        const allCategoryIds = categories.map((cat) => cat.id);
        setSelectedCategories([{ name: "Apply to all categories" }]);
        setSelectedCategoryIds(allCategoryIds);
    }
    } else {
      const category = categories.find((category) => category.id === categoryId);
  
      if (category) {
        if (selectedCategoryIds.includes(category.id)) {
          setSelectedCategories((prevSelectedCategories) =>
            prevSelectedCategories.filter((selectedCategory) => selectedCategory.id !== category.id)
          );
          setSelectedCategoryIds((prevSelectedCategoryIds) =>
            prevSelectedCategoryIds.filter((id) => id !== category.id)
          );
        } else {
          if (selectedCategories.length === 1 && selectedCategories[0].name === "Apply to all categories") {
            setSelectedCategories([]);
            setSelectedCategoryIds([]);
          }
          setSelectedCategories((prevSelectedCategories) => [
            ...prevSelectedCategories,
            category,
          ]);
          setSelectedCategoryIds((prevSelectedCategoryIds) => {
            const newCategoryIds = [...prevSelectedCategoryIds, category.id];
            return newCategoryIds;
          });
        }
      }
    }
  };
const handlePriceChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {  setPriceOption(selectedOption);  handlePriceDisplayInInputField(selectedCategoryIds,selectedOption); }
      else{   setPriceOption('');setPreviousPriceInput('');setCurrentPriceInput(''); }    
  };
  const handleVariantPriceChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {  setVariantPriceOption(selectedOption); handleVariantPriceDisplayInInputField(selectedOption); }
      else{   setVariantPriceOption('');setCurrentVariantPriceInput('');setPreviousVariantPriceInput(''); }    
  };
  const handleCategoryRemove = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategories([]);
      setSelectedCategoryIds([]);
  } else {
    const allCategoryIds = selectedCategories.map(cat => cat.name); 
    if (allCategoryIds[0] === "Apply to all categories") {
      setSelectedCategories([]); 
      setSelectedCategoryIds([]);
    }
    setSelectedCategories((prevSelectedCategories) =>
      prevSelectedCategories.filter((category) => category.id !== categoryId)
    );
    setSelectedCategoryIds((prevSelectedCategoryIds) => {
      const newCategoryIds = prevSelectedCategoryIds.filter((id) => id !== categoryId);
      return newCategoryIds; 
    });
  }
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
      
    }
    if (dropdownRefForValue.current && !dropdownRefForValue.current.contains(event.target)) {
      setDropdownOpenForValue(false);
    }
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    fetchCategories();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleBrandSelect = (brand) => {
    if (brand && brand.id) {
      setSelectedBrandId(brand.id);
      setSelectedBrand(brand);
    }
    else{
      setSelectedBrandId(null);
      setSelectedBrand(null);
    }
  };
  const handleBrandSelectForVariant = (brand) => {
    if (brand && brand.id) {
      setSelectedBrandIdForVariant(brand.id);
      setSelectedBrandForVariant(brand);
    }
    else{
      setSelectedBrandIdForVariant(null);
      setSelectedBrandForVariant(null);
    }
  };
  const handleBrandRemoveForVariant = () => {
    setBrands([]);
    setSelectedBrandForVariant(null);
    setSelectedBrandIdForVariant(null);
    fetchBrands();
  };
  const handleBrandRemove = () => {
    setBrands([]);
    setSelectedBrand(null);
    setSelectedBrandId(null);
    fetchBrands();
  };

  const handlePriceDisplayInInputField = async (selectedCategoryIds,selectedOption) => {
    if (selectedCategoryIds && selectedBrandId && selectedOption) {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainRevertPreviousAndCurrentPriceForCategory/`,
          { category_id: selectedCategoryIds,
            brand_id: selectedBrandId,
            price_option:selectedOption,
           }
        );
        setPreviousPriceInput(response.data.data.old_price);
        setCurrentPriceInput(response.data.data.current_price);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
      } finally { }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter all fields to revoke", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };

  const handleRevokeApply = async () => {
      setFormSubmitted(true);
        if (!selectedBrandId || !selectedCategoryIds.length || !priceOption) {
          Swal.fire({  text: "Please Enter all fields to revoke",  confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
              });
                } 
                else{
                    try {
                        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateRevertPriceForCategory/`,
                          { category_id: selectedCategoryIds,
                            brand_id: selectedBrandId,
                            price_option:priceOption,
                           }
                        );
                        if (response.status === 200) {
                          Swal.fire({ title: "Success", text: "Restored price Based on Vendor & Category wise Successfully", icon: "success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                          });
                          setFormSubmitted(false);
                        }
                        setBrands([]);
                        setSelectedBrand(null);
                        setSelectedBrandId(null);
                        setPreviousPriceInput('');
                        setCurrentPriceInput('');
                        setPriceOption('');
                        setSelectedCategories([]); 
                        setSelectedCategoryIds([]);
                        fetchBrands();
                        console.log(response,'response');
                      } catch (error) {
                        console.error("Error fetching data:", error);
                        Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                        });
                      } finally {  }
                }
  };

  const handleVariantPriceDisplayInInputField = async (variantpriceOption) => {
    if (selectedBrandIdForVariant && selectedVariantId && selectedVariantValueIds && variantpriceOption) {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainRevertPreviousAndCurrentPriceForVarientOption/`,
          { 
            brand_id: selectedBrandIdForVariant,
            option_name_id:selectedVariantId,
            option_value_id:selectedVariantValueIds,
            price_option:variantpriceOption,
           }
        );   
        setPreviousVariantPriceInput(response.data.data.old_price);
        setCurrentVariantPriceInput(response.data.data.current_price);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
      } finally { }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter all fields to revoke", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };
  const handleVariantRevokeApply = async () => {
         setFormSubmittedForVariant(true);
            if (!selectedBrandIdForVariant || !selectedVariantValueIds.length || !selectedVariantId || !variantpriceOption) {
              Swal.fire({  text: "Please Enter all fields to apply",  confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                  });
                    } 
                    else{
        try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateRevertPriceForVarientOption/`,
            { 
                brand_id: selectedBrandIdForVariant,
                option_name_id:selectedVariantId,
                option_value_id:selectedVariantValueIds,
                price_option:variantpriceOption,
               }
        );
        if (response.status === 200) {
          Swal.fire({ title: "Success", text: "Restored price Based on Vendor & Variant wise Successfully", icon: "success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
          setFormSubmittedForVariant(false);
        }
        setBrands([]);
        setSelectedBrandForVariant(null);
        setSelectedBrandIdForVariant(null);
        setSelectedVariant(null);
        setVariantOptions([]);
        setSelectedVariantValues([]);
        setSelectedVariantValueIds([]);
        setPreviousVariantPriceInput('');
        setCurrentVariantPriceInput('');
        setVariantPriceOption('');
        fetchVariantOptions();
        fetchBrands();
        console.log(response,'response');
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
      } finally { }
    }
  };
  const fetchVariantOptions = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientOptionForRetailPrice/`);      
      setVariantOptions(response.data.data.varient_option_list);
    } catch (error) {
      console.error("Error fetching variant options:", error);
    }
  };
useEffect(() => {
  fetchVariantOptions();
}, []); 

const handleVariantSelect = async(id) => {    
  const variant = variantOptions.find((option) => option.id === id);
  setSelectedVariant(variant);
  setSelectedVariantId(variant.id);
  try {
    const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientOptionValueForRetailPrice/?id=${id}`);    
    setVariantTypeValues(response.data.data.varient_option_value_list);
  } catch (error) {
    console.error("Error fetching variant options:", error);
  }
};

const handleVariantRemove = () => {
  setVariantOptions([]);
  fetchVariantOptions();
  setSelectedVariant(null); // Remove selected variant
};

const handleVariantValueSelect = (event) => {
    const selectedValueId = event.target.value;
  
    if (selectedValueId === "all") {
      if (selectedVariantValues.length === 1 && selectedVariantValues[0].name === "Apply to all variant values" ) {
        setSelectedVariantValues([]);
        setSelectedVariantValueIds([]);
    } else {
        const allVariantValueIds = variantTypeValues.map((value) => value.id);
        setSelectedVariantValues([{ name: "Apply to all variant values" }]);
        setSelectedVariantValueIds(allVariantValueIds);
    }
    } else {
      const selectedValue = variantTypeValues.find((value) => value.id === selectedValueId);
  
      if (selectedValue) {
        // Check if the variant value is already selected
        if (selectedVariantValueIds.includes(selectedValue.id)) {
          // Deselect the variant value
          setSelectedVariantValues((prevSelectedValues) =>
            prevSelectedValues.filter((value) => value.id !== selectedValue.id)
          );
          setSelectedVariantValueIds((prevSelectedValueIds) =>
            prevSelectedValueIds.filter((id) => id !== selectedValue.id)
          );
        } else {
          // Select the variant value
          if (
            selectedVariantValues.length === 1 &&
            selectedVariantValues[0].name === "Apply to all variant values"
          ) {
            setSelectedVariantValues([]);
            setSelectedVariantValueIds([]);
          }
          setSelectedVariantValues((prevSelectedValues) => [
            ...prevSelectedValues,
            { id: selectedValue.id, name: selectedValue.name },
          ]);
          setSelectedVariantValueIds((prevSelectedValueIds) => [
            ...prevSelectedValueIds,
            selectedValue.id,
          ]);
        }
      }
    }
  };
  

const handleVariantValueRemove = (id) => {
  setSelectedVariantValues((prevSelectedValues) => prevSelectedValues.filter((value) => value.id !== id));
  setSelectedVariantValueIds((prevSelectedValueIds) => prevSelectedValueIds.filter((valueId) => valueId !== id));
};


  return (
    <div style={{backgroundColor:'white',boxShadow:'0 2px 10px rgba(0, 0, 0, 0.1)',padding:'16px'}}>
      <h2 style={{textAlign:'center'}}>Restore Schema</h2>
     
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px', borderRadius:'20px' }}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Retail Price Logic</h4>

    <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor  <span className="required">*</span></h3>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px",  border: formSubmitted && !selectedBrand ? "1px solid red" : "1px solid #ccc", width: "248px", display: "inline-block",appearance:'none'  }} onChange={(e) => handleBrandSelect(brands.find(brand => brand.id === e.target.value))}>
        <option value="">Select Vendor</option>
        {brands.map((brand) => (
          <option value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
      <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>

      {selectedBrand && (
        <div style={{ marginTop: '10px', display: "inline-block" }}>
          <span style={{ display: "inline-block", margin: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", borderRadius: "20px", fontSize: "14px" }}>
            {selectedBrand.name}
            <span style={{ marginLeft: '5px', cursor: 'pointer', fontWeight: "bold", color: "rgb(193 193 193)" }} onClick={handleBrandRemove}> X </span>
          </span>
        </div>
      )}
    </div>

    <div style={{ margin: "10px 0" }}>
      <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Category <span className="required">*</span></h3>
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block"  }}>
        <div
          style={{ padding: "10px", borderRadius: "5px",border: formSubmitted && selectedCategoryIds.length === 0  ? "1px solid red"  : "1px solid #ccc", width: "225px", cursor: "pointer", background: "#fff", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          Select  Category
          <span style={{ fontSize: "12px", color: "#888" }}>▼</span>
        </div>

        {dropdownOpen && (
  <div
    style={{  width: "228px",  border: "1px solid #ccc",  backgroundColor: "#fff",  zIndex: 1000,  maxHeight: "130px",  overflowY: "auto",  padding: "8px",  position: "absolute",  top: "110%",  left: 0,  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",  borderRadius: "5px",
    }}
  >
    <input type="text" placeholder="Search category..." value={searchQuery} onChange={handleSearchChange} className="dropdown-search-input"
      onClick={(e) => e.stopPropagation()}   style={{ width: "92%", padding: "6px", marginBottom: "8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "4px",  }}
    />
    <div
      style={{ padding: "8px", cursor: "pointer", background: "lightgrey", borderRadius: "4px", marginBottom: "4px", fontSize: "14px",  }}
      onClick={() => handleCategorySelect({ target: { value: "all" } })}  >
      Apply to all categories
    </div>
    {filteredCategories.length > 0 ? (
      filteredCategories.map((category) => (
        <div
          style={{  padding: "6px",  cursor: "pointer",  borderRadius: "4px",  background: selectedCategoryIds.includes(category.id) ? "#d7ffe6" : "#fff",  fontSize: "14px",  marginBottom: "2px",
          }}
          onClick={() => handleCategorySelect({ target: { value: category.id } })}
        >
          {selectedCategoryIds.includes(category.id) && (
            <span style={{ marginRight: "8px", color: "#18b418" }}>✔</span>
          )}
          {category.name}
        </div>
      ))
    ) : (
      <div style={{ padding: "6px", fontSize: "14px", color: "#999" }}>
        No categories found.
      </div>
    )}
  </div>
)}
      </div>
     

      <div style={{ marginTop: "12px", display: "inline-block" }}>
        {selectedCategories.map((category) => (
          <span
            style={{ display: "inline-flex", alignItems: "center", margin: "4px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "20px", fontSize: "14px" }}
          >
            {category.name}
            <span style={{ marginLeft: "8px", cursor: "pointer", fontWeight: "bold", color: "rgb(193 193 193)" }} onClick={() => handleCategoryRemove(category.id)}>
              X
            </span>
          </span>
        ))}
      </div>
    </div>
    <div style={{ margin: "10px 0" }}>
      <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Price Option <span className="required">*</span></h3>
      <div style={{ margin: '0px 0px 0px 0px', display: "inline-block" }}>
        <select value={priceOption} onChange={handlePriceChange} style={{ padding: "10px", borderRadius: "5px", border: formSubmitted && !priceOption  ? "1px solid red"  : "1px solid #ccc",  width: "245px", display: "inline-block",appearance:'none'  }}>
        <option value="">Select Price Option</option>
          <option value="finished_price">Finished Wholesale Price</option>
          <option value="un_finished_price">Unfinished Wholesale Price</option>
        </select>
        <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
      </div>
      </div>
    <div style={{ margin: "20px 0px", width: "100%" }}>
  {/* Input Fields Section */}
  <div style={{ display: "block", marginBottom: "20px" }}>
    <div style={{ textAlign: "left", width: "40%",display: "inline-block", }}>
    <h3 style={{ display: "block", marginBottom: "5px",paddingRight:'15px',fontSize:'18px',fontWeight:'500', textAlign:'left'  }}>Previous Logic</h3>
      <input
        type="number"
        value={previousPriceInput}
        placeholder="Previous value"
        className="PrevCurrentValues"
        style={{ width: "50%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }}
      />
    </div>

    {/* Current Logic */}
    <div style={{ textAlign: "left", width: "40%",display: "inline-block", }}>
      <h3 style={{ display: "block", marginBottom: "5px",paddingRight:'15px',fontSize:'18px',fontWeight:'500', textAlign:'left'  }}>Current Logic</h3>
      <input
        type="number"
        value={currentPriceInput}
        placeholder="Current value"
        className="PrevCurrentValues"
        style={{ width: "47%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px",margin:'0px 0px' }}
      />
    </div>
    <div style={{ width: "20%",display: "inline-block", }}>
    <button
      onClick={() => handleRevokeApply()}
      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer", }}
      className="add-brand-btn revoke_btn" disabled={currentPriceInput === 0}> Restore </button>
  </div>
  </div>  
</div>
  </div>

  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px', borderRadius:'20px'}}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Variant Price Logic</h4>

  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor  <span className="required">*</span> </h4>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px",  border: formSubmittedForVariant && !selectedBrandForVariant ? "1px solid red" : "1px solid #ccc", width: "248px", display: "inline-block",appearance:'none'  }} onChange={(e) => handleBrandSelectForVariant(brands.find(brand => brand.id === e.target.value))}>
        <option value=""  style={{ fontSize: "14px", fontWeight: "500" }}>Select Vendor</option>
        {brands.map((brand) => (
          <option  style={{ fontSize: "14px", fontWeight: "500" }} value={brand.id} >
            {brand.name}
          </option>
        ))}
      </select>
      <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
      {selectedBrandForVariant && (
        <div style={{ marginTop: '10px', display: "inline-block" }}>
          <span style={{ display: "inline-block", margin: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", borderRadius: "20px", fontSize: "14px" }}>
            {selectedBrandForVariant.name}
            <span style={{ marginLeft: '5px', cursor: 'pointer', fontWeight: "bold", color: "rgb(193 193 193)" }} onClick={handleBrandRemoveForVariant}> X </span>
          </span>
        </div>
      )}
    </div>
    <div style={{ marginTop: "20px" }}>
        <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>
          Select Variant  <span className="required">*</span>
        </h3>
        <select
          style={{ padding: "10px", borderRadius: "5px", border: formSubmittedForVariant && !selectedVariant ? "1px solid red" : "1px solid #ccc",
            width: "248px", display: "inline-block", appearance:'none' }}
          onChange={(e) => handleVariantSelect(e.target.value)}
        >
          <option value="" style={{ fontSize: "14px", fontWeight: "500" }}>Select Variant</option>
          {/* {variantOptions?.map((variant) => (
            <option value={variant.id}>
              {variant.name}
            </option>
          ))} */}
          {variantOptions
  ?.filter((variant) => variant.name.toLowerCase() === "wood type") // Filter for "Wood Type" only
  .map((variant) => (
    <option style={{ fontSize: "14px", fontWeight: "500" }} key={variant.id} value={variant.id}>
      {variant.name}
    </option>
  ))}
        </select>
        <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
        {selectedVariant && (
          <div style={{ marginTop: '10px', display: "inline-block" }}>
            <span style={{ display: "inline-block", margin: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", borderRadius: "20px", fontSize: "14px" }}>
              {selectedVariant.name}
              <span style={{ marginLeft: '5px', cursor: 'pointer', fontWeight: "bold", color: "rgb(193 193 193)" }} onClick={handleVariantRemove}> X </span>
            </span>
          </div>
        )}
      </div>
    <div style={{ margin: "10px 0" }}>
      <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Variant Value  <span className="required">*</span></h3>
      <div ref={dropdownRefForValue} style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{  padding: "10px",  borderRadius: "5px", border: formSubmittedForVariant && !selectedVariantValueIds.length ? "1px solid red" : "1px solid #ccc",   width: "226px",  cursor: "pointer",  background: "#fff",  fontSize: "14px",  display: "flex",  alignItems: "center",  justifyContent: "space-between",
          }}
          onClick={() => setDropdownOpenForValue((prev) => !prev)}  >
          Select Variant Value
          <span style={{ fontSize: "12px", color: "#888" }}>▼</span>
        </div>

        {dropdownOpenForValue && (
          <div
            style={{ width: "225px", border: "1px solid #ccc", backgroundColor: "#fff", zIndex: 1000, maxHeight: "120px", overflowY: "auto", padding: "8px", position: "absolute", top: "110%", left: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "5px",
            }}  >
            <div
              style={{ padding: "8px", cursor: "pointer", background: "lightgrey", borderRadius: "4px", marginBottom: "4px", fontSize: "14px", }}
              onClick={() => handleVariantValueSelect({ target: { value: "all" } })}  >
              Apply to all variant values
            </div>
            {variantTypeValues.map((variant) => (
              <div
                style={{ padding: "6px", cursor: "pointer", borderRadius: "4px", background: selectedVariantValueIds.includes(variant.id) ? "#d7ffe6" : "#fff", fontSize: "15px",fontWeight:'500', marginBottom: "2px",
                }}
                onClick={() => handleVariantValueSelect({ target: { value: variant.id } })}
              >
                {selectedVariantValueIds.includes(variant.id) && (
                  <span style={{ marginRight: "8px", color: "#18b418" }}>✔</span>
                )}
                {variant.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "12px", display: "inline-block" }}>
        {selectedVariantValues.map((variant) => (
          <span
            style={{ display: "inline-flex", alignItems: "center", margin: "4px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "20px", fontSize: "14px", }} >
            {variant.name}
            <span
              style={{ marginLeft: "8px", cursor: "pointer", fontWeight: "bold", color: "rgb(193 193 193)",  }}
              onClick={() => handleVariantValueRemove(variant.id)}  >  X  </span>
          </span>
        ))}
      </div>
    </div>
    <div style={{ margin: "10px 0" }}>
      <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Price Option <span className="required">*</span></h3>
      <div style={{ margin: '0px 0px 0px 0px', display: "inline-block" }}>
        <select value={variantpriceOption} onChange={handleVariantPriceChange} style={{ padding: "10px", borderRadius: "5px", border: formSubmittedForVariant && !variantpriceOption ? "1px solid red" : "1px solid #ccc", width: "245px", display: "inline-block",appearance:'none'  }}>
        <option value=""  style={{ fontSize: "13px", fontWeight: "500" }}>Select Price Option</option>
          <option  style={{ fontSize: "14px", fontWeight: "500" }} value="finished_price">Finished Wholesale Price</option>
          <option  style={{ fontSize: "14px", fontWeight: "500" }} value="un_finished_price">Unfinished Wholesale Price</option>
        </select>
        <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
      </div>
      </div>
    <div style={{ margin: "20px 0px", width: "100%" }}>
  {/* Input Fields Section */}
  <div style={{ display: "block", marginBottom: "20px" }}>    
    <div style={{ textAlign: "left", width: "40%",display: "inline-block", }}>
    <h3 style={{ display: "block", marginBottom: "5px",paddingRight:'15px',fontSize:'18px',fontWeight:'500', textAlign:'left'  }}>Previous Logic</h3>
    <input
        type="number"
        value={previousVariantPriceInput}
        placeholder="Previous value"
        style={{ width: "50%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }} />
    </div>
    <div style={{ textAlign: "left", width: "40%",display: "inline-block",  }}>
    <h3 style={{ display: "block", marginBottom: "5px",paddingRight:'15px',fontSize:'18px',fontWeight:'500', textAlign:'left'  }}>Current Logic</h3>
          <input
        type="number"
        value={currentVariantPriceInput}
        placeholder="Current value"
        style={{ width: "47%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }} />
    </div>
    <div style={{ width: "20%",display: "inline-block", }}>
    <button
      onClick={() => handleVariantRevokeApply()}
      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer", }}
      className="add-brand-btn revoke_variant_btn" disabled={currentVariantPriceInput === 0}>
      Restore
    </button>
  </div>
  </div>
  
</div>
  </div>
</div>
    </div>
  );
};
export default RevokePrice;