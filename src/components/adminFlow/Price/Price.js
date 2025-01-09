import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import './Price.css';
import Swal from "sweetalert2";
const PriceComponent = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceOption, setPriceOption] = useState('finished_price');
  const [variantpriceOption, setVariantPriceOption] = useState('finished_price');

  const [priceInput, setInputPrice] = useState('');
  const [VariantpriceInput, setVariantInputPrice] = useState('');
  const [currencyOption, setcurrencyOption] = useState('%');

  const [tableData, setTableData] = useState([]);
  // const [productTableData, setProductTableData] = useState([]);
  const [productTableDataAfterSave, setProductTableDataAfterSave] = useState([]);
  const [productcountDataAfterSave, setProductcountAfterSave] = useState([]);
  const dropdownRef = useRef(null);
  const [variantOptions, setVariantOptions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [selectedBrandForVariant, setSelectedBrandForVariant] = useState(null);
  const [selectedBrandIdForVariant, setSelectedBrandIdForVariant] = useState(null);
  const [variantTypeValues, setVariantTypeValues] = useState([]); // Example data, replace with API call
  const [selectedVariantValues, setSelectedVariantValues] = useState([]);
  const [selectedVariantValueIds, setSelectedVariantValueIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmittedForVariant, setFormSubmittedForVariant] = useState(false);

  const dropdownRefForValue = useRef(null);
  // const handleToggle = async (index) => {
  //   try {
  //     const updatedRow = tableData[index];
  //           const payload = {  category_id: updatedRow.id,  brand_id: selectedBrandId,  price:updatedRow.price, };
  //       const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateActiveRetailPrice/`, payload );
  //     if (response?.data?.estatus) {
  //       console.log(`Successfully updated active status for category ID: ${updatedRow.id}`);
  //       await fetchPriceTableData(selectedCategoryIds); 
  //     } else {
  //       Swal.fire({ title: "Error", text: response?.data?.emessage || "Failed to update active status.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', }, });
  //     }
  //   } catch (error) {
  //     console.error("Error updating active state:", error);
  //     Swal.fire({  title: "Error",  text: "An error occurred while updating active status.",  icon: "error",  confirmButtonText: "OK",customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', }, });
  //   }
  // };
 
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      Swal.fire({ title: "Error", text: "Failed to fetch vendors.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`);
      setCategories(response.data.data.last_level_category || []); 
      setFilteredCategories(response.data.data.last_level_category || []); 
    } catch (error) {
      Swal.fire({ title: "Error", text: "Failed to fetch Categories.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
      setLoading(false);
    }
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
        fetchPriceTableData([]);
    } else {
        const allCategoryIds = categories.map((cat) => cat.id);
        setSelectedCategories([{ name: "Apply to all categories" }]);
        setSelectedCategoryIds(allCategoryIds);
        fetchPriceTableData(allCategoryIds);
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
          fetchPriceTableData(selectedCategoryIds.filter((id) => id !== category.id));
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
            fetchPriceTableData(newCategoryIds);
            return newCategoryIds;
          });
        }
      }
    }
  };
  const handleCategoryRemove = (categoryId) => {
    if (categoryId === "all") {
      setSelectedCategories([]);
      setSelectedCategoryIds([]);
      fetchPriceTableData([]); 
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
      fetchPriceTableData(newCategoryIds); 
      return newCategoryIds; 
    });
  }
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    fetchCategories();
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleClickOutsideForVariant = (event) => {
    if ( dropdownRefForValue.current && !dropdownRefForValue.current.contains(event.target) ) {
      setDropdownOpenForValue(false);
    }
  };
  const [dropdownOpenForValue, setDropdownOpenForValue] = useState(false);
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideForVariant);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideForVariant);
    };
  }, []);

  const handleBrandSelect = (brand) => {
    if (brand && brand.id) {
      setProductTableDataAfterSave([]);
      setSelectedBrandId(brand.id);
      fetchPriceTableDataBrand(brand.id);
      setSelectedBrand(brand);
    }
    else{
      setSelectedBrandId(null);
      setSelectedBrand(null);
    }
  };
  const handleBrandSelectForVariant = (brand) => {
    setProductcountAfterSave('');
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
    setTableData([]);
  };
  const handlePriceChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {  setPriceOption(selectedOption);  }
      else{   setPriceOption(''); }    
  };
  const handleVariantPriceChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {  setVariantPriceOption(selectedOption);  }
      else{   setVariantPriceOption(''); }    
  };
  const handleInputChange = (e) => {
    if (e.target.value === '' || parseFloat(e.target.value) >= 0) { setInputPrice(e.target.value); }
  };
  const handleVariantInputChange = (e) => {
    setVariantInputPrice(e.target.value);
  };
  const handleCurrencyChange = (e) => {
    setcurrencyOption(e.target.value);
  };
  const handlePriceApply = async () => {   
    setFormSubmitted(true);
    if (!selectedBrand || !selectedCategoryIds.length || !priceInput) {
      Swal.fire({  text: "Please Enter all fields to apply",  confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
            } else {
              try {
                setLoading(true);
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateRetailPrice/`,
                  { category_id_list: selectedCategoryIds,
                    brand_id: selectedBrandId,
                    price_option:priceOption,
                    price:priceInput
                   }
                );
                if (response.status === 200) {
                  Swal.fire({ title: "Success", text: "Applied Based on Vendor & Category wise Successfully", icon: 'success', confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                  });
                  setFormSubmitted(false);
                }
                console.log(response,'response');
                setBrands([]);
                setSelectedBrand(null);
                setSelectedBrandId(null);
                setSelectedCategories([]);
                setSelectedCategoryIds([]);
                setInputPrice('');
                setTableData([]);
                fetchBrands();
              } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                });
              } finally {
                setLoading(false);
              }
      console.log("Form submitted successfully");
    }
  };
  const handleVariantPriceApply = async () => {
    setFormSubmittedForVariant(true);
    if (!selectedBrandIdForVariant || !selectedVariantValueIds.length || !selectedVariantId || !variantpriceOption || !currencyOption ||!VariantpriceInput) {
      Swal.fire({  text: "Please Enter all fields to apply",  confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
            } 
            else{
              try {
                setLoading(true);
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainProductBasedOnVarientOption/`,
                  { 
                    brand_id: selectedBrandIdForVariant,
                    option_name_id:selectedVariantId,
                    option_value_id:selectedVariantValueIds,
                    price_option:variantpriceOption,
                    price_symbol:currencyOption,
                    price:VariantpriceInput
                   }
                );
                if (response.status === 200) {
                  Swal.fire({ title: "Success", text: "Applied Based on Vendor & Variant wise Successfully", icon: 'success', confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                  });
                  setFormSubmittedForVariant(false);
                }
                console.log(response,'response');
                setBrands([]);
                setVariantOptions([]);
                setSelectedVariant([]);
                setSelectedVariantValues([]);
                setVariantTypeValues([]);
                setVariantOptions([]);
                setSelectedVariant(null); 
                setSelectedVariantValueIds([]);
                setSelectedBrandForVariant(null);
                setSelectedBrandIdForVariant(null);
                setVariantInputPrice('');
                setTableData([]);
                fetchVariantOptions();
                fetchBrands();
                const tableHTML = `
                <div style="text-align: end">
                  <span style="font-size: 16px; font-weight: bold;">
                    Total Products: ${response.data.data.product_count}  </span></div>
                <div style="overflow-x: auto; max-height: 400px; border: 1px solid #ccc;">
                  <table border="1" style="width: 100%; text-align: left; border-collapse: collapse; table-layout: fixed;">
                    <thead style="background-color: #f8f8f8; position: sticky; top: 0; z-index: 1;">
                      <tr>
                        <th style="padding: 10px; background-color: #f4f4f4;">Image</th>
                        <th style="padding: 10px; background-color: #f4f4f4;">Product Name</th>
                        <th style="padding: 10px; background-color: #f4f4f4;">Variant Value</th>
                        <th style="padding: 10px; background-color: #f4f4f4;">Unfinished Price</th>
                        <th style="padding: 10px; background-color: #f4f4f4;">Finished Price</th>
                        <th style="padding: 10px; background-color: #f4f4f4;">Retail Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${response.data.data.result
                        .map((row) => {
                          const image = Array.isArray(row.image_url)
                            ? row.image_url[0]
                            : row.image_url;
                          const variantOptions = row.varient_option_list
                            .map((option) => `${option.type_name}: ${option.type_value}`)
                            .join("<br>");
                          return `
                            <tr>
                              <td style="padding: 10px;">
                                <img src="${image}" alt="${row.product_name}" 
                                  style="width: 50px; height: 50px; border-radius: 50%;">
                              </td>
                              <td style="padding: 10px;">${row.product_name}</td>
                              <td style="padding: 10px;">${variantOptions}</td>
                              <td style="padding: 10px;">${row.un_finished_price}</td>
                              <td style="padding: 10px;">${row.finished_price}</td>
                              <td style="padding: 10px;">${row.retail_price}</td>
                            </tr>`;
                        })
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `;              
        
              // Display the Swal popup with the table
              Swal.fire({  title: "Products Found",  html: tableHTML,  showConfirmButton: false,  width: "80%",
                customClass: {  container: "swal-custom-container",  popup: "swal-custom-popup",  title: "swal-custom-title", },
                didRender: () => {
                  const saveButton = document.createElement("button");
                  saveButton.innerHTML = "Save Changes";
                  saveButton.style = "padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;";
                  saveButton.onclick = async() => {
                    try {
                      const saveresponse =  await axiosInstance.post(`${process.env.REACT_APP_IP}/saveChangesForVarientOption/`,
                        { result_list: response.data.data.result,
                         }
                      );
                      console.log(saveresponse,'saveresponse');
                      console.log(saveresponse.status,'saveresponse.status');
                      if (saveresponse.status === 200) {
                        setProductTableDataAfterSave(response.data.data.result);
                        setProductcountAfterSave(response.data.data.product_count);
                      }
                    } catch (error) {
                      console.error("Error fetching data:", error);
                      Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                      });
                    }
                    Swal.fire({  title: "Changes Saved",  text: "Your changes have been saved successfully!",  icon: "success",  confirmButtonText: "OK",  customClass: {  container: "swal-custom-container",  popup: "swal-custom-popup",  title: "swal-custom-title",  confirmButton: 'swal-custom-confirm', },
                    });
                  };
                  Swal.getHtmlContainer().appendChild(saveButton);
                },
              });
              } catch (error) {
                console.error("Error fetching data:", error);
                Swal.fire({ title: "Error", text: "Failed to fetch data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                });
              } finally {
                setLoading(false);
              }
            }
  };
 
  const fetchPriceTableDataBrand = async (BrandID) => {    
    try {
        setLoading(true);
        let payload = '';
        payload = { brand_id: BrandID};
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainBrandCategoryWisePriceTable/`, payload); 
        const categoryList = response?.data?.data?.category_list || [];
        setTableData(categoryList);
        console.log(response.data,'priceTableData');
    } catch (error) {
        console.error("Error fetching price table data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch price table data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
    } finally {   setLoading(false); }
};
  const fetchPriceTableData = async (categoryIdList) => {    
    try {
        setLoading(true);
        let payload = '';
        payload = { category_id_list: categoryIdList, brand_id: selectedBrandId};
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainBrandCategoryWisePriceTable/`, payload); 
        const categoryList = response?.data?.data?.category_list || [];
        setTableData(categoryList);
        console.log(response.data,'priceTableData');
    } catch (error) {
        console.error("Error fetching price table data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch price table data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup', title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
    } finally {
        setLoading(false);
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
const fetchAllData = async () => {
  try {
    setLoading(true);
    await Promise.all([fetchBrands(), fetchCategories(), fetchVariantOptions()]);
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    setLoading(false);
  }
};

// Fetch data on component mount
useEffect(() => {
  fetchAllData();
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
  setSelectedVariant(null);
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
      if (selectedVariantValueIds.includes(selectedValue.id)) {
        setSelectedVariantValues((prevSelectedValues) =>
          prevSelectedValues.filter((value) => value.id !== selectedValue.id)
        );
        setSelectedVariantValueIds((prevSelectedValueIds) =>
          prevSelectedValueIds.filter((id) => id !== selectedValue.id)
        );
      } else {
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
      <h2 style={{textAlign:'center'}}>Pricing Schema</h2>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px',borderRadius:'15px' }}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Based on Vendor & Categories</h4>

    <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor  <span className="required">*</span></h3>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px", border: formSubmitted && !selectedBrand ? "1px solid red" : "1px solid #ccc", width: "248px", display: "inline-block",appearance:'none' }} onChange={(e) => handleBrandSelect(brands.find(brand => brand.id === e.target.value))}>
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
      <h3 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Category  <span className="required">*</span> </h3>
      <div ref={dropdownRef} style={{ position: "relative", display: "inline-block",}}>
        <div
          style={{ padding: "10px", borderRadius: "5px",  border: formSubmitted && selectedCategoryIds.length === 0  ? "1px solid red"  : "1px solid #ccc", width: "225px", cursor: "pointer", background: "#fff", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}    onClick={() => setDropdownOpen((prev) => !prev)}  >
          Select Category
          <span style={{ fontSize: "12px", color: "#918f8f" }}>▼</span>
        </div>

        {dropdownOpen && (
  <div
    style={{  width: "228px",  border: "1px solid #ccc",  backgroundColor: "#fff",  zIndex: 1000,  maxHeight: "130px",  overflowY: "auto",  padding: "8px",  position: "absolute",  top: "110%",  left: 0,  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",  borderRadius: "5px",
    }} >
    <input type="text" placeholder="Search category..." value={searchQuery} onChange={handleSearchChange} className="dropdown-search-input"
      onClick={(e) => e.stopPropagation()}   style={{ width: "92%", padding: "6px", marginBottom: "8px", fontSize: "14px", border: "1px solid #ccc", borderRadius: "4px",  }} />
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
          onClick={() => handleCategorySelect({ target: { value: category.id } })}  >
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
            style={{ display: "inline-flex", alignItems: "center", margin: "4px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", borderRadius: "20px", fontSize: "14px" }} >
            {category.name}
            <span style={{ marginLeft: "8px", cursor: "pointer", fontWeight: "bold", color: "rgb(193 193 193)" }} onClick={() => handleCategoryRemove(category.id)}>
              X
            </span>
          </span>
        ))}
      </div>
    </div>
    <div style={{ margin: '20px 0px 0px 0px', width: '100%' }}>
      <h5 style={{ marginTop: '0px', display: "inline-block", width: '26%' }}>Retail Pricing Logic</h5>
      <div style={{ margin: '0px 0px 0px 20px', display: "inline-block", width: '24%' }}>
        <input className="" id="" type="number" value={priceInput} placeholder="value" required onChange={handleInputChange} min="0" style={{ width: "45%", paddingRight: "30px", backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'><path fill='gray' d='M12.2 3.8a.75.75 0 0 0-1.05 0L8 6.94 4.85 3.8a.75.75 0 0 0-1.05 1.05L6.94 8l-3.14 3.15a.75.75 0 1 0 1.05 1.05L8 9.06l3.15 3.14a.75.75 0 0 0 1.05-1.05L9.06 8l3.14-3.15a.75.75 0 0 0 0-1.05Z'/></svg>")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center", backgroundSize: "16px 16px", border: formSubmitted && !priceInput ? "1px solid red" : "1px solid #ccc", }} />
      </div>
      <div style={{ margin: '0px 0px 0px 0px', display: "inline-block" }}>
        <select value={priceOption} onChange={handlePriceChange} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "200px", display: "inline-block", border: "1px solid #ccc",appearance:'none' }}>
          <option value="finished_price">Finished Wholesale Price</option>
          <option value="un_finished_price">Unfinished Wholesale Price</option>
        </select>
        <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
      </div>
    </div>
    <button onClick={() => handlePriceApply()} className="apply-btn">  Apply </button>
  </div>

  <div style={{ display: "inline-block", justifyContent: "flex-start", boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)', width: '47%', minHeight: '90vh', padding: '14px',borderRadius:'15px' }}>
  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "bold",marginTop: '0', textAlign:'center' }}>Based on Vendor & Variants</h4>

  <h4 style={{ marginBottom: "8px", fontSize: "18px", fontWeight: "500" }}>Select Vendor <span className="required">*</span> </h4>
    <div>
      <select style={{ padding: "10px", borderRadius: "5px", border: formSubmittedForVariant && !selectedBrandForVariant ? "1px solid red" : "1px solid #ccc", width: "248px", display: "inline-block",appearance:'none'  }} onChange={(e) => handleBrandSelectForVariant(brands.find(brand => brand.id === e.target.value))}>
        <option value="">Select Vendor</option>
        {brands.map((brand) => (
          <option value={brand.id} >
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
          style={{ padding: "10px", borderRadius: "5px", border: formSubmittedForVariant && !selectedVariant ? "1px solid red" : "1px solid #ccc", width: "248px", display: "inline-block",appearance:'none'  }}
          onChange={(e) => handleVariantSelect(e.target.value)} >
          <option value="">Select Variant</option>
          {variantOptions?.map((variant) => (
            <option value={variant.id}>
              {variant.name}
            </option>
          ))}    
            {/* {variantOptions ?.filter((variant) => variant.name.toLowerCase() === "wood type")  .map((variant) => (   <option  key={variant.id} value={variant.id}>  {variant.name}  </option> ))}  */}
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
          style={{  padding: "10px",  borderRadius: "5px",  border: formSubmittedForVariant && !selectedVariantValueIds.length ? "1px solid red" : "1px solid #ccc",   width: "225px",  cursor: "pointer",  background: "#fff",  fontSize: "14px",  display: "flex",  alignItems: "center",  justifyContent: "space-between",
          }}
          onClick={() => setDropdownOpenForValue((prev) => !prev)}  >
          Select Variant Value
          <span style={{ fontSize: "12px", color: "#918f8f" }}>▼</span>
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
                onClick={() => handleVariantValueSelect({ target: { value: variant.id } })}  >
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
    <div style={{ margin: "20px 0px 0px 0px" }}>
    <h5 style={{ marginTop: "0px", display: "inline-block" }}>Price</h5>
    <div
      style={{ margin: "0px 0px 0px 15px", display: "inline-block", width: "10%", }} >
      <input className="" id="" type="number" value={VariantpriceInput} placeholder="value" required 
      onChange={handleVariantInputChange}  style={{ width: "70%",  border: formSubmittedForVariant && !VariantpriceInput ? "1px solid red" : "1px solid #ccc",  }}  />
    </div>
    <div  style={{ margin: "0px 0px 0px 20px", display: "inline-block", width: '14%' }} >
      <select
        value={currencyOption}
        onChange={handleCurrencyChange}
        style={{  padding: "10px",  borderRadius: "5px",  border: "1px solid #ccc",  width: "56px", margin:'0px' }} >
        <option value="%">%</option>
        <option value="$">$</option>
      </select>
    </div>
    <div
      style={{ margin: "0px 0px 0px 0px", display: "inline-block", }} >
      <select value={variantpriceOption} onChange={handleVariantPriceChange} style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "215px", display: "inline-block",appearance:'none'  }} >
        <option value="finished_price">Finished Wholesale Price</option>
        <option value="un_finished_price">Unfinished Wholesale Price</option>
      </select>
      <span style={{ position: "relative", right: "25px", fontSize: "12px", color: formSubmitted && !selectedBrand ? "red" : "#918f8f",  }} >   ▼  </span>
    </div>   
  </div>
  <button onClick={() =>handleVariantPriceApply() } className="apply-btn">  Apply  </button>
  <p style={{display:'contents'}}>(This given variant price will update the variant price and the retail price accordingly) <span className="required">*</span></p>
  </div>
</div>
      {tableData.length > 0 ? (
        <table  border="1"  style={{ marginTop: "20px", width: "100%", textAlign: "left" }} >
          <thead>
            <tr>
              <th>Vendor Name</th>
              <th>Category Name</th>
              <th>Retail Price</th>
              <th>Price Option</th>
              <th>Is Active</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.brand_name}</td>
                <td>{row.category_name}</td>
                <td>{row.price}</td>
                <td>{row.price_option}</td>
                <td>
                  <label className="switch">
                    {/* <input type="checkbox" checked={row.is_active} onChange={() => handleToggle(index)} disabled={row.is_active}  /> */}
                    <input type="checkbox" checked={row.is_active} 
                    // onChange={() => handleToggle(index)}
                     disabled />
                    <span className="slider"></span>
                  </label>
                  {row.is_active ? " Active" : " Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       ):(
        (selectedBrandId || (selectedCategoryIds && selectedCategoryIds.length > 0)) ? (
        <table
        border="1"
        style={{ marginTop: "20px", width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Vendor Name</th>
            <th>Category Name</th>
            <th>Retail Price</th>
            <th>Price Option</th>
            <th>Is Active</th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td colSpan="5"  style={{ marginTop: "20px", width: "100%", textAlign: "center" }}>No Pricing found.</td>
        </tr>
        </tbody>
      </table>
        ) : null
      )}
<div>
{productTableDataAfterSave.length > 0 && (
  <>
       <span style={{ float:'right', fontSize: '16px', fontWeight: 'bold',margin:'12px 0px 10px 0px'}}>
             Total Products: {productcountDataAfterSave}</span>
        <table border="1" style={{ marginTop: "20px", width: "100%", textAlign: "left" }} >
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Variant Value</th>
              <th>Unfinished Price</th>
              <th>Finished Price</th>
              <th>Retail Price</th>
            </tr>
          </thead>
          <tbody>
            {productTableDataAfterSave.map((row, index) => (
              <tr key={index}>
                <td>
                {Array.isArray(row.image_url) ? (
                    <img  src={row.image_url[0]}  alt={row.product_name}  className="product-image-round"  />
                  ) : (
                    <img src={row.image_url} alt={row.product_name} className="product-image-round" />
                  )}
                </td>
                <td>{row.product_name}</td>
                <td>
                  {row.varient_option_list.map((option, index) => (
                    <div key={index}>{option.type_name}: {option.type_value}</div>
                  ))}
                </td>
                <td>{row.un_finished_price}</td>
                <td>{row.finished_price}</td>
                <td>{row.retail_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
      )}
</div>
    </div>
  );
};
export default PriceComponent;