import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import axiosInstance from '../../../../src/utils/axiosConfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter,faSort } from '@fortawesome/free-solid-svg-icons';

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
  const handleSearchChange = (event) => { setSearchQuery(event.target.value);};
  const filteredProducts = responseData.filter((item) =>  item.product_name.toLowerCase().includes(searchQuery.toLowerCase()) );
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue === bValue) return 0;
    return (aValue > bValue ? 1 : -1) * (sortOrder === "asc" ? 1 : -1);
  });

  return (
    <div className="product-list">
      <div className="search-container">
        <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearchChange} className="search-input"  />
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
              <th className="checkbox-column">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProducts.length === sortedProducts.length}
                />
              </th>
              <th className="checkbox-column" onClick={() => handleSort("product_image")}>Image{sortColumn === "product_image" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="mpn-column" onClick={() => handleSort("mpn")}>MPN{sortColumn === "mpn" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="product-column" onClick={() => handleSort("product_name")}>Product Name {sortColumn === "product_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="brand-column" onClick={() => handleSort("brand")}>Vendor {sortColumn === "brand" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="taxonomy-column" style={{ width: '16%' }} onClick={() => handleSort("taxonomy")}>Taxonomy {sortColumn === "taxonomy" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              {/* <th className="price-column" onClick={() => handleSort("base_price")}>Base Price {sortColumn === "base_price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th>
              <th className="msrpprice-column" onClick={() => handleSort("msrp")}>MSRP {sortColumn === "msrp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th> */}
              {/* <th className="model-column" onClick={() => handleSort("model")}>Model {sortColumn === "model" ? (sortOrder === "asc" ? "↑" : "↓") : ""}</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((item) => (
              <tr key={`product-${item.product_id}`} style={{cursor:'pointer'}} onClick={() => handleProductSelect(item.product_id)}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(item.product_id)}
                    onChange={() => handleSelectProduct(item.product_id)}
                  />
                </td>
                <td className="checkbox-column">
                  {Array.isArray(item.image) ? (
                    <img
                      src={item.image[0]}
                      alt={item.product_name}
                      className="product-image-round"
                    />
                  ) : (
                    <img
                      src={item.image}
                      alt={item.product_name}
                      className="product-image-round"
                    />
                  )}
                </td>
                <td className="mpn-column">{item.mpn}</td>
                <td className="product-cell">
                  <span className="product-name">{item.product_name}</span>
                </td>
                <td className="mpn-column">{item.brand}</td>
                <td className="attributes-column">{item.category_name}</td>
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