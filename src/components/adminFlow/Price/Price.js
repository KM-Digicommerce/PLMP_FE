import React, { useState, useEffect } from "react";
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
  const [priceInput, setInputPrice] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleToggle = async (index) => {
    try {
      const updatedRow = tableData[index];
      console.log(updatedRow,'updatedRow');
      
            const payload = {
        category_id: updatedRow.id,
        brand_id: selectedBrandId,
        price:updatedRow.price,
      };
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/updateActiveRetailPrice/`, payload );
      if (response?.data?.estatus) {
        console.log(`Successfully updated active status for category ID: ${updatedRow.id}`);
        await fetchPriceTableData(selectedCategoryIds); 
      } else {
        Swal.fire({ title: "Error", text: response?.data?.emessage || "Failed to update active status.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', }, });
      }
    } catch (error) {
      console.error("Error updating active state:", error);
      Swal.fire({  title: "Error",  text: "An error occurred while updating active status.",  icon: "error",  confirmButtonText: "OK",customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', }, });
    }
  };
  
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      Swal.fire({ title: "Error", text: "Failed to fetch brands.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`);
      setCategories(response.data.data.last_level_category || []); // Assuming the response contains user list in `data`
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({ title: "Error", text: "Failed to fetch users.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    } finally {
      setLoading(false);
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
        setSelectedCategories([{ name: "Apply all category" }]); 
        setSelectedCategoryIds(allCategoryIds);
        fetchPriceTableData(allCategoryIds); 
    } else {
        const category = categories.find(category => category.id === categoryId);
        const allCategoryIds = selectedCategories.map(cat => cat.name); 
        if (allCategoryIds[0] === "Apply all category") {
          setSelectedCategories([]); 
          setSelectedCategoryIds([]);
        }
        if (category) {
          if (!selectedCategories.some(selectedCategory => selectedCategory.id === category.id)) {
            setSelectedCategories(prevSelectedCategories => [...prevSelectedCategories, category]);
            setSelectedCategoryIds((prevSelectedCategoryIds) => {
              if (prevSelectedCategoryIds.length === 0) {
                const newCategoryIds = [category.id];
                fetchPriceTableData(newCategoryIds); 
                return newCategoryIds;
              } else {
                const newCategoryIds = [...prevSelectedCategoryIds, category.id];
                fetchPriceTableData(newCategoryIds); 
                return newCategoryIds;
              }
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

  const handleBrandSelect = (brand) => {
    setSelectedBrandId(brand.id)
    setSelectedBrand(brand);
    // if (selectedBrandId.length === 0) {
    //   fetchPriceTableData(brand.id); 
    // }
  };
//   useEffect(() => {
//     if (selectedBrandId && selectedBrandId !== '') {
//         console.log('Brand selected:', selectedBrand);
//         fetchPriceTableData(); // Fetch price table data whenever selectedBrandId changes
//     }
// }, [selectedBrandId]); // Runs when selectedBrandId changes


  const handleBrandRemove = () => {
    setSelectedBrand(null);
  };
  const handlePriceChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {
      setPriceOption(selectedOption);
    }
      else{
        setPriceOption('');
      }    
  };
  const handleInputChange = (e) => {
    setInputPrice(e.target.value);
  };
  const handlePriceApply = async () => {
    if (selectedCategoryIds && selectedBrand && priceOption && priceInput) {
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
          Swal.fire({ title: "Success", text: "Applied Successfully", icon: "Success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
          });
        }
        console.log(response,'response');
        setSelectedBrand(null);
        setSelectedCategories([]);
        setSelectedCategoryIds([]);
        setInputPrice('');
        setTableData([]);
      } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch users.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
      } finally {
        setLoading(false);
      }
    }
    else{
      Swal.fire({ title: "Error", text: "Please Enter the all fields to apply", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
      });
    }
  };
  const fetchPriceTableData = async (categoryIdList) => {    
    // if (selectedBrandId) { 
    //   console.log("Inside IF API");
      
    try {
        setLoading(true);
        const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainBrandCategoryWisePriceTable/`, { category_id_list: categoryIdList, brand_id: selectedBrandId}); 
        const categoryList = response?.data?.data?.category_list || [];
        setTableData(categoryList);
        console.log(response.data,'priceTableData');
    } catch (error) {
        console.error("Error fetching price table data:", error);
        Swal.fire({ title: "Error", text: "Failed to fetch price table data.", icon: "error", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
        });
    } finally {
        setLoading(false);
    }
  // }
};
  return (
    <div style={{backgroundColor:'white',boxShadow:'0 2px 10px rgba(0, 0, 0, 0.1)',padding:'25px'}}>
      <h1>Pricing Schema</h1>
      <div
        style={{ display: "block", justifyContent: "flex-start", marginBottom: "20px", }}
      >
        <div>
          <h3>Select Brand</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <select style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "200px", display: "inline-block"
              }} onChange={(e) => handleBrandSelect(brands.find(brand => brand.id === e.target.value))}>
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>

              {selectedBrand && (
                <div style={{ marginTop: '10px', display: "inline-block" }}>
                  <span
                    style={{ display: "inline-block", margin: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", borderRadius: "20px", fontSize: "14px", }} >
                    {selectedBrand.name}
                    <span
                      style={{  marginLeft: '5px',  cursor: 'pointer',  color: '#bfbfbf'}}
                      onClick={handleBrandRemove}  >X </span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ margin: '0px 0px 0px 0px' }}>
          <h3>Select Category</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <select style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "200px", display: "inline-block" }}onChange={handleCategorySelect} >
                <option value="">Select a category</option>
                <option value="all">Apply all category</option>
                {categories.map((category) => (
                  <option value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div style={{ marginTop: '10px', display: "inline-block" }}>
                {selectedCategories &&(
                selectedCategories.map((category) => (
                  <span
                    style={{ display: "inline-block", margin: "5px", padding: "5px 10px", backgroundColor: "#007bff", color: "white", borderRadius: "20px", fontSize: "14px", }} >
                    {category.name}
                    <span style={{  marginLeft: '5px', cursor: 'pointer', color: '#bfbfbf', }}
                      onClick={() => handleCategoryRemove(category.id)} > X </span>
                  </span>
                ))
              )}
              </div>
            </div>
          )}
        </div>
        <div style={{ margin: '20px 0px 0px 0px' }}>
          <h4 style={{ marginTop: '0px', display: "inline-block" }}>Retail Pricing Logic</h4>
          <div style={{ margin: '0px 0px 0px 20px', display: "inline-block" ,width:'10%'}}>
            <input className="" id="" type="number" value={priceInput} placeholder="value" required onChange={handleInputChange} />
          </div>
          <span style={{ padding: '0px 0px 0px 21px', cursor: 'pointer', color: '#bfbfbf' }} > X </span>
          <div style={{ margin: '0px 0px 0px 0px', display: "inline-block" }}>
            <select value={priceOption} onChange={handlePriceChange} className="sort-dropdown" style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", width: "215px", display: "inline-block" }}>
              <option value="finished_price">Finished Wholesale Price</option>
              <option value="unfinished_price">Unfinished Wholesale Price</option>
            </select>
          </div>
        </div>
        <button onClick={() =>handlePriceApply() } className="add-brand-btn">
          Apply
        </button>
      </div>
      {tableData.length > 0 && (
        <table
          border="1"
          style={{ marginTop: "20px", width: "100%", textAlign: "left" }}
        >
          <thead>
            <tr>
              <th>Brand Name</th>
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
                    <input
                      type="checkbox"
                      checked={row.is_active}
                      onChange={() => handleToggle(index)}
                      disabled={row.is_active} // Disable if already active
                    />
                    <span className="slider"></span>
                  </label>
                  {row.is_active ? " Active" : " Inactive"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PriceComponent;