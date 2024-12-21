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
 
 
  const fetchBrands = async () => {
    try {
    //   setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      Swal.fire({ title: "Error", text: "Failed to fetch vendors.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
    //   setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
    //   setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`);
      setCategories(response.data.data.last_level_category || []); // Assuming the response contains user list in `data`
    } catch (error) {
      Swal.fire({ title: "Error", text: "Failed to fetch Categories.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
    //   setLoading(false);
    }
  };
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);
  
  const handleCategorySelect = (e) => {
    const categoryId = e.target.value;
    if (categoryId === "all") {
        const allCategoryIds = categories.map(cat => cat.id); 
        setSelectedCategories([{ name: "Apply to all categories" }]); 
        setSelectedCategoryIds(allCategoryIds);
        handlePriceDisplayInInputField();
    } else {
        const category = categories.find(category => category.id === categoryId);
        const allCategoryIds = selectedCategories.map(cat => cat.name); 
        if (allCategoryIds[0] === "Apply to all categories") {
          setSelectedCategories([]); 
          setSelectedCategoryIds([]);
        }
        if (category) {
          if (!selectedCategories.some(selectedCategory => selectedCategory.id === category.id)) {
            setSelectedCategories(prevSelectedCategories => [...prevSelectedCategories, category]);
            setSelectedCategoryIds((prevSelectedCategoryIds) => {
              if (prevSelectedCategoryIds.length === 0) {
                const newCategoryIds = [category.id];
                return newCategoryIds;
              } else {
                const newCategoryIds = [...prevSelectedCategoryIds, category.id];
                return newCategoryIds;
              }
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
    //   fetchPriceTableDataBrand(brand.id);
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
    //   fetchPriceTableDataBrand(brand.id);
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
    // console.log(selectedCategoryIds,'selectedCategoryIds');
    // console.log(selectedBrandId,'selectedBrandId');
    // console.log(selectedOption,'priceOption');
    if (selectedCategoryIds && selectedBrandId && selectedOption) {
      try {
        // setLoading(true);
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainRevertPreviousAndCurrentPriceForCategory/`,
          { category_id: selectedCategoryIds,
            brand_id: selectedBrandId,
            price_option:selectedOption,
           }
        );
        console.log(response,'response');
        setPreviousPriceInput(response.data.data.old_price);
        setCurrentPriceInput(response.data.data.current_price);
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
      } finally {
        // setLoading(false);
      }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter the all fields to apply", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };

  const handleRevokeApply = async () => {
    if (selectedCategoryIds && selectedBrandId && priceOption ) {
      try {
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateRevertPriceForCategory/`,
          { category_id: selectedCategoryIds,
            brand_id: selectedBrandId,
            price_option:priceOption,
           }
        );
        if (response.status === 200) {
          Swal.fire({ title: "Success", text: "Revoked price Based on Vendor & Category wise Successfully", icon: "success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
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
      } finally {
        // setLoading(false);
      }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter the all fields to apply", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };

  const handleVariantPriceDisplayInInputField = async (variantpriceOption) => {
    console.log(selectedBrandIdForVariant,'selectedBrandIdForVariant');
    console.log(selectedVariantId,'selectedVariantId');
    console.log(selectedVariantValueIds,'selectedVariantValue');
    console.log(variantpriceOption,'variantpriceOption');

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
      Swal.fire({ title: "Error", text: "Please Enter the all fields to apply", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };
  const handleVariantRevokeApply = async () => {
    if (selectedBrandIdForVariant && selectedVariantId && selectedVariantValueIds && variantpriceOption) {
        try {
        // setLoading(true);
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateRevertPriceForVarientOption/`,
            { 
                brand_id: selectedBrandIdForVariant,
                option_name_id:selectedVariantId,
                option_value_id:selectedVariantValueIds,
                price_option:variantpriceOption,
               }
        );
        if (response.status === 200) {
          Swal.fire({ title: "Success", text: "Revoked price Based on Vendor & Variant wise Successfully", icon: "success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
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
      } finally {
        // setLoading(false);
      }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter the all fields to apply", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };
  const fetchVariantOptions = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientOptionForRetailPrice/`);      
      setVariantOptions(response.data.data.varient_option_list );
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
    const allVariantValueIds = variantTypeValues.map((value) => value.id);
    setSelectedVariantValues([{ name: "Apply to all variant values" }]);
    setSelectedVariantValueIds(allVariantValueIds);
  } else {    
    const selectedValue = variantTypeValues.find((value) => value.id === selectedValueId);
    const allVariantValueNames = selectedVariantValues.map((value) => value.name);
    if (allVariantValueNames[0] === "Apply to all variant values") {
      setSelectedVariantValues([]);
      setSelectedVariantValueIds([]);
    }
    if (selectedValue) {
      if (!selectedVariantValueIds.includes(selectedValue.id)) {
        setSelectedVariantValues((prevSelectedValues) => [
          ...prevSelectedValues,
          { id: selectedValue.id, name: selectedValue.name },
        ]);
        // handleVariantPriceDisplayInInputField(selectedValue.id);
        setSelectedVariantValueIds((prevSelectedValueIds) => {
          const newVariantValueIds = [...prevSelectedValueIds, selectedValue.id];
          return newVariantValueIds;
        });
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
      <h2 style={{textAlign:'center'}}>Revoke Schema</h2>
     
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px', borderRadius:'20px' }}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Retail Price Logic</h4>

    <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor  <span className="required">*</span></h3>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "248px", display: "inline-block" }} onChange={(e) => handleBrandSelect(brands.find(brand => brand.id === e.target.value))}>
        <option value="">Select a Vendor</option>
        {brands.map((brand) => (
          <option value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

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
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block" }}>
        <div
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "225px", cursor: "pointer", background: "#fff", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          Select a category
          <span style={{ fontSize: "12px", color: "#888" }}>▼</span>
        </div>

        {dropdownOpen && (
          <div style={{ width: "225px", border: "1px solid #ccc", backgroundColor: "#fff", zIndex: 1000, maxHeight: "120px", overflowY: "auto", padding: "8px", position: "absolute", top: "110%", left: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "5px" }}>
            <div
              style={{ padding: "8px", cursor: "pointer", background: "lightgrey", borderRadius: "4px", marginBottom: "4px", fontSize: "14px",
              }}
              onClick={() => handleCategorySelect({ target: { value: "all" } })}
            >
              Apply to all categories
            </div>
            {categories.map((category) => (
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
            ))}
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
        <select value={priceOption} onChange={handlePriceChange} className="sort-dropdown" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "245px", display: "inline-block" }}>
        <option value="">Select Price Option</option>
          <option value="finished_price">Finished Wholesale Price</option>
          <option value="un_finished_price">Unfinished Wholesale Price</option>
        </select>
      </div>
      </div>
    <div style={{ margin: "20px 0px", width: "100%" }}>
  {/* Input Fields Section */}
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
    <div style={{ textAlign: "center", marginRight: "20px", width: "45%" }}>
      <label style={{ display: "block", marginBottom: "5px", paddingRight:'8px' }}>Previous Logic</label>
      <input
        type="number"
        value={previousPriceInput}
        placeholder="Previous value"
        style={{ width: "42%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }}
      />
    </div>

    {/* Current Logic */}
    <div style={{ textAlign: "center", marginLeft: "20px", width: "45%" }}>
      <label style={{ display: "block", marginBottom: "5px",paddingRight:'15px'  }}>Current Logic</label>
      <input
        type="number"
        value={currentPriceInput}
        placeholder="Current value"
        style={{ width: "42%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }}
      />
    </div>
  </div>

  {/* Revoke Button Section */}
  <div style={{ textAlign: "center" }}>
    <button
      onClick={() => handleRevokeApply()}
      style={{ width: "14%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer", }}
      className="add-brand-btn revoke_btn" disabled={currentPriceInput === 0}> Revoke </button>
  </div>
</div>

  </div>

  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px', borderRadius:'20px'}}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Variant Price Logic</h4>

  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor  <span className="required">*</span> </h4>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "248px", display: "inline-block" }} onChange={(e) => handleBrandSelectForVariant(brands.find(brand => brand.id === e.target.value))}>
        <option value="">Select a Vendor</option>
        {brands.map((brand) => (
          <option value={brand.id} >
            {brand.name}
          </option>
        ))}
      </select>

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
          style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "248px", display: "inline-block", }}
          onChange={(e) => handleVariantSelect(e.target.value)}
        >
          <option value="">Select Variant</option>
          {variantOptions?.map((variant) => (
            <option value={variant.id}>
              {variant.name}
            </option>
          ))}
        </select>

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
          style={{  padding: "10px",  borderRadius: "5px",  border: "1px solid #ccc",  width: "226px",  cursor: "pointer",  background: "#fff",  fontSize: "14px",  display: "flex",  alignItems: "center",  justifyContent: "space-between",
          }}
          onClick={() => setDropdownOpenForValue((prev) => !prev)}  >
          Select a variant value
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
                style={{ padding: "6px", cursor: "pointer", borderRadius: "4px", background: selectedVariantValueIds.includes(variant.id) ? "#d7ffe6" : "#fff", fontSize: "14px", marginBottom: "2px",
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
        <select value={variantpriceOption} onChange={handleVariantPriceChange} className="sort-dropdown" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "245px", display: "inline-block" }}>
        <option value="">Select Price Option</option>
          <option value="finished_price">Finished Wholesale Price</option>
          <option value="un_finished_price">Unfinished Wholesale Price</option>
        </select>
      </div>
      </div>
    <div style={{ margin: "20px 0px", width: "100%" }}>
  {/* Input Fields Section */}
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
    {/* Previous Logic */}
    <div style={{ textAlign: "center", marginRight: "20px", width: "45%" }}>
      <label style={{ display: "block", marginBottom: "5px", paddingRight:'8px' }}>Previous Logic</label>
      <input
        type="number"
        value={previousVariantPriceInput}
        placeholder="Previous value"
        style={{ width: "42%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }} />
    </div>

    {/* Current Logic */}
    <div style={{ textAlign: "center", marginLeft: "20px", width: "45%" }}>
      <label style={{ display: "block", marginBottom: "5px", paddingRight:'15px'  }}>Current Logic</label>
      <input
        type="number"
        value={currentVariantPriceInput}
        placeholder="Current value"
        style={{ width: "42%", paddingRight: "30px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px", }} />
    </div>
  </div>

  {/* Revoke Button Section */}
  <div style={{ textAlign: "center" }}>
    <button
      onClick={() => handleVariantRevokeApply()}
      style={{ width: "14%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc", cursor: "pointer", }}
      className="add-brand-btn revoke_variant_btn" disabled={currentVariantPriceInput === 0}>
      Revoke
    </button>
  </div>
</div>
  </div>
</div>
    </div>
  );
};
export default RevokePrice;