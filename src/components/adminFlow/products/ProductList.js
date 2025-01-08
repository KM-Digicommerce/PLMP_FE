import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import axiosInstance from '../../../../src/utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter,faSort, faClone, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Soon from '../../../assets/image_2025_01_02T08_51_07_818Z.png';
import Swal from 'sweetalert2';

const ProductList = () => {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortOption, setSortOption] = useState(''); // default value to 'newest'
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showTextCategories, setShowTextCategories] = useState(false);

  const handleVisibilityToggle = async (e, product) => {
    e.stopPropagation(); // Prevent click propagation if necessary
    // Toggle the visibility based on the current state of `is_active`
    const updatedVisibility = !product.is_active;
    // Update local state immediately
    setResponseData(prevData =>
      prevData.map(item =>
        item.product_id === product.product_id
          ? { ...item, is_active: updatedVisibility }
          : item
      )
    );
    console.log(`Visibility toggled for product: ${product.product_name} to ${updatedVisibility ? 'Visible' : 'Invisible '}`);
    // Show confirmation dialog with SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: `You have ${updatedVisibility ? 'enabled' : 'disabled'} changes. Are you sure you want to ${updatedVisibility ? 'enable' : 'disable'} the selected product?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${updatedVisibility ? 'enable' : 'disable'} it`,
      cancelButtonText: "No, stay",
      customClass: {
        container: 'swal-custom-container',
        popup: 'swal-custom-popup',
        title: 'swal-custom-title',
        confirmButton: 'swal-custom-confirm',
        cancelButton: 'swal-custom-cancel'
      }
    }).then((result) => {
      // If the user clicks "Yes", then call the API to update the product status
      if (result.isConfirmed) {
        const payload = { id: product.product_id, is_active: updatedVisibility };
        // Call the API to update product visibility in the backend
        axiosInstance.post(`${process.env.REACT_APP_IP}/UpdateProductActiveInActive/`, payload)
          .then((response) => {
            if (response.data && response.data.data && response.data.data.is_update) {
              // After successful update, optionally refetch data or update UI
              const filter = true;
              fetchData({ filter });
              Swal.fire({
                title: 'Success!',
                text: `The product has been ${updatedVisibility ? 'enabled' : 'disabled'}.`,
                icon: 'success',
                customClass: {
                  container: 'swal-custom-container',
                  popup: 'swal-custom-popup',
                  title: 'swal-custom-title',
                  confirmButton: 'swal-custom-confirm',
                  cancelButton: 'swal-custom-cancel'
                }
              });
            } else {
              alert("Unexpected response structure");
            }
          })
          .catch((err) => {
            setError(err.message);
            Swal.fire({
              title: 'Error',
              text: 'There was an issue updating the product status.',
              icon: 'error',
              customClass: {
                container: 'swal-custom-container',
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel'
              }
            });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        // If the user clicks "No, stay", revert the local state change
        setResponseData(prevData =>
          prevData.map(item =>
            item.product_id === product.product_id
              ? { ...item, is_active: !updatedVisibility }
              : item
          )
        );
        Swal.fire({
          title: 'Cancelled',
          text: 'No changes were made.',
          icon: 'info',
          customClass: {
            container: 'swal-custom-container',
            popup: 'swal-custom-popup',
            title: 'swal-custom-title',
            confirmButton: 'swal-custom-confirm',
            cancelButton: 'swal-custom-cancel'
          }
        });
      }
    });
  };
  
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };
  const handleSortChange = async (event) => {
    const selectedOption = event.target.value;
    if (selectedOption) {
      setSortOption(selectedOption);
    const filter = selectedOption === 'newest' ? true : false;
    fetchData({ filter });
  }
      else{  setSortOption(''); }    
  };
  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllProductList/`, { params });

      if (response.data && response.data.data && response.data.data.product_list) {
        setResponseData(response.data.data.product_list);
      } else {
        alert("Unexpected response structure");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllLastLevelIds/`);
      setCategories(response.data.data.last_level_category || []); 
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      setBrands(response.data.data.brand_list || []);
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };
  useEffect(() => {
    fetchData({ filter: true });
    fetchCategories();
    fetchBrands();
  }, []);
  const handleCategoryChange = async (event) => {
    const selectedCategoryId = event.target.value;
    setSelectedCategory(selectedCategoryId);
    if (selectedCategoryId !== '') {
      fetchData({ category_id: selectedCategoryId });
    }
    else{ fetchData(); }
  };

  const handleBrandChange = async (event) => {
    const selectedBrandId = event.target.value;
    setSelectedBrand(selectedBrandId);
    if (selectedBrandId !== '') {
      fetchData({ brand_id: selectedBrandId });
    }
    else{   fetchData();  }
  };
  const handleProductSelect = (productId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/Admin/product/${productId}`);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allProductIds = responseData.map((item) => item.product_id);
      setSelectedProducts(allProductIds);
    } else {   setSelectedProducts([]); }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };
  const handleCategorySortClick = () => {
    setSortVisible(!sortVisible);
    if (searchVisible) {
      setSearchVisible(!searchVisible);
    }
  };
  const handleBrandSortClick = () => {
    setSearchVisible(!searchVisible);
    if (sortVisible) {
      setSortVisible(!sortVisible);
    }
  };
  const handleSearchChange = async(event) => {
     setSearchQuery(event.target.value);
     const query = event.target.value;
     if (query !== '') {
       setResponseData([]);
     }
     try {
       const response = await axiosInstance.get(
         `${process.env.REACT_APP_IP}/obtainAllProductList/`,
         {
           params: {
             search:query
           }
         }
       );   
       setResponseData(response.data.data.product_list);
       console.log('Response',responseData);
     } catch (error) {
       console.error('Error fetching product list:', error);
     }
    };
  const filteredProducts = responseData.filter((product) => {
    const productName = product.product_name?.toLowerCase() || '';
    const model = product.model?.toLowerCase() || '';
    const tags = product.tags?.toLowerCase() || '';
    const mpn = product.mpn?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return ( productName.includes(query) || model.includes(query) || tags.includes(query) || mpn.includes(query)
    );
  });
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === bValue) return 0;
    return (aValue > bValue ? 1 : -1) * (sortOrder === "asc" ? 1 : -1);
  });
  const handleCloneClick = (e, product) => {
    console.log('product',product);
    e.stopPropagation(); // Prevent row click event from triggering
      const clonedProductData = { ...product, product_id: undefined }; // Avoid copying product_id
      navigate(`/Admin/addproduct`, { state: { productData: clonedProductData } });
  };
  const clearSearchInput = () => {
    setSearchQuery('');
    const filter = true;
    fetchData({ filter });
  };
  return (
    <div className="product-list">
      <div className="search-container" style={{position:'relative'}}>
        <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearchChange} className="search-input"  style={{ paddingRight: '30px' }} />
        {searchQuery && (
         <button
         onClick={clearSearchInput}
         style={{
           position: 'absolute', right: '266px', background: 'transparent', border: 'none', fontSize: '16px', color: '#aaa', cursor: 'pointer', width: '7%', top:'-3px'
         }}   >    ✕     </button>
      )}
      </div>
      <div className="sort-container">
      {searchVisible && (
                   <select value={selectedBrand} onChange={handleBrandChange} className="filter-dropdown" >
                   <option value="">All Vendors</option>
                   {brands.map((brand) => (
                     <option  value={brand.id}>{brand.name}</option>
                   ))}
                 </select>    )}
        {sortVisible && (
                  <select  value={selectedCategory}  onChange={handleCategoryChange}  className="filter-dropdown"  >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option value={cat.id}>{cat.name}</option>   ))} </select> )}
        <div style={{ position: 'relative', display: 'inline-block' }}>
        <FontAwesomeIcon
          icon={faFilter}
          onClick={handleBrandSortClick}
          style={{ cursor: 'pointer', fontSize: '18px', marginRight: '10px',padding:'15px 5px' }}
          onMouseEnter={() => setShowText(true)}
          onMouseLeave={() => setShowText(false)}
        />
        {showText && (  <span  style={{  position: 'absolute',  top: '-25px',  left: '0',  backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000',   }} >   Filter by Vendors </span> )}
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
        <FontAwesomeIcon
          icon={faSort}
          onClick={handleCategorySortClick}
          style={{ cursor: 'pointer', fontSize: '18px', marginRight: '10px',padding:'15px 5px'}}
          onMouseEnter={() => setShowTextCategories(true)}
          onMouseLeave={() => setShowTextCategories(false)}
        />
        {showTextCategories && (
            <span
              style={{  position: 'absolute',  top: '-25px',  left: '0',  backgroundColor: 'black',  color: 'white',  padding: '5px 10px',  borderRadius: '5px',  fontSize: '12px',  whiteSpace: 'nowrap',  zIndex: '1000',
              }} >   Filter by Categories </span>
          )}
        </div>
        <select onChange={handleSortChange} value={sortOption} className="sort-dropdown">
        <option value="">Sort by Products</option>
          <option value="newest">Newest Products</option>
          <option value="oldest">Oldest Products</option>
        </select>
      </div>
      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : sortedProducts.length > 0 ? (
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column" style={{width:'3%'}}>
                <input type="checkbox" onChange={handleSelectAll} checked={selectedProducts.length === sortedProducts.length}  />
              </th>
              <th className="checkbox-column" style={{width:'3%'}} onClick={() => handleSort("product_image")}>Image{sortColumn === "product_image" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="mpn-column" style={{width:'8%'}} onClick={() => handleSort("mpn")}>MPN{sortColumn === "mpn" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="product-column" style={{width: '35%'}} onClick={() => handleSort("product_name")}>Product Name {sortColumn === "product_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="brand-column" style={{width:'10%'}} onClick={() => handleSort("brand")}>Vendor {sortColumn === "brand" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="taxonomy-column" style={{width: '40%'}} onClick={() => handleSort("taxonomy")}>Taxonomy {sortColumn === "taxonomy" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="others-column" style={{width: '5%'}}>Action</th> 
              {/* <th className="price-column" onClick={() => handleSort("base_price")}>Base Price {sortColumn === "base_price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="msrpprice-column" onClick={() => handleSort("msrp")}>MSRP {sortColumn === "msrp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th> */}
              {/* <th className="model-column" onClick={() => handleSort("model")}>Model {sortColumn === "model" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((item) => (
              <tr key={`product-${item.product_id}`} style={{cursor:'pointer'}} onClick={() => handleProductSelect(item.product_id)}>
                <td className="checkbox-column">
                  <input type="checkbox" checked={selectedProducts.includes(item.product_id)} onChange={() => handleSelectProduct(item.product_id)} />
                </td>
                <td className="checkbox-column">
                  {Array.isArray(item.image) ? (
                    <img src={item.image[0] || Soon } alt={item.product_name} className="product-image-round" />
                  ) : (
                    <img  src={item.image}  alt={item.product_name}  className="product-image-round"  />
                  )}
                </td>
                <td className="mpn-column" style={{width:'12%'}}>{item.mpn}</td>
                <td className="product-cell">
                  <span className="product-name">{item.product_name}</span>
                </td>
                <td className="mpn-column">{item.brand}</td>
                <td className="attributes-column">{item.category_name}</td>
                {/* <td className="others-column"> */}
                  {/* <FontAwesomeIcon
                    icon={faClone}
                    onClick={(e) => handleCloneClick(e, item)}
                    style={{ cursor: 'pointer', fontSize: '18px', color: '#007bff' }}
                  /> */}
                  {/* <FontAwesomeIcon
                    icon={isVisible ? faEye : faEyeSlash}
                    onClick={(e) => handleVisibilityToggle(e, item)}
                    style={{ cursor: 'pointer', fontSize: '16px' }}
                  />
                </td> */}
                <td className="others-column">
                  {/* <FontAwesomeIcon
                    icon={visibilityState[item.product_id] ? faEye : faEyeSlash}
                    onClick={(e) => handleVisibilityToggle(e, item.product_id)}
                    style={{ cursor: 'pointer', fontSize: '16px' }}
                  /> */}
                    <FontAwesomeIcon
                  icon={item.is_active ? faEye : faEyeSlash}
                  onClick={(e) => handleVisibilityToggle(e, item)}
                  style={{ cursor: 'pointer', fontSize: '16px' }}
                />
                </td>
                {/* <td className="price-column">{item.base_price ? `$${item.base_price}` : ''}</td>
                <td className="msrpprice-column">{item.msrp ? `$${item.msrp}` : ''}</td> */}
                {/* <td className="model-column">{item.model}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};
export default ProductList;