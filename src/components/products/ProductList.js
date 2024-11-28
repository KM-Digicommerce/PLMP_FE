// src\components\products\ProductList.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import axiosInstance from '../../../src/utils/axiosConfig';

const ProductList = () => {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainAllProductList/`);

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

    fetchData();
  }, []);

  const handleProductSelect = (productId) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/HomePage/product/${productId}`);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allProductIds = responseData.map((item) => item.product_id);
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = responseData.filter((item) =>
    item.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
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
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
        />
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
              <th className="checkbox-column" onClick={() => handleSort("product_image")}>Image{sortColumn === "product_image" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="mpn-column" onClick={() => handleSort("mpn")}>
                MPN{sortColumn === "mpn" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="product-column" onClick={() => handleSort("product_name")}> Product Name {sortColumn === "product_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="brand-column" onClick={() => handleSort("brand")}>
                Brand {sortColumn === "brand" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="taxonomy-column" onClick={() => handleSort("taxonomy")}>
              Taxonomy {sortColumn === "taxonomy" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="price-column" onClick={() => handleSort("base_price")}>
                Base Price {sortColumn === "base_price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="msrpprice-column" onClick={() => handleSort("msrp")}>
                MSRP {sortColumn === "msrp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="model-column" onClick={() => handleSort("model")}>
                Model {sortColumn === "model" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              {/* <th className="upc_ean-column" onClick={() => handleSort("upc_ean")}>
                UPC_EAN {sortColumn === "upc_ean" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th> */}
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((item) => (
              <tr key={`product-${item.product_id}`}>
                <td className="checkbox-column">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(item.product_id)}
                    onChange={() => handleSelectProduct(item.product_id)}
                  />
                </td>
                <td className="checkbox-column"> {Array.isArray(item.image) ? (
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
                )} </td>
                <td className="mpn-column">{item.mpn}</td>
                <td className="product-cell" onClick={() => handleProductSelect(item.product_id)}>
                  <span className="product-name" onClick={() => handleProductSelect(item.product_id)}>{item.product_name}</span>
                </td>
                <td className="mpn-column">{item.brand}</td>
                <td className="attributes-column">{item.category_name}</td>
                <td className="price-column">{item.base_price ? `$${item.base_price}` : ''}</td>
                <td className="msrpprice-column"> {item.msrp ? `$${item.msrp}` : ''}</td>
                <td className="model-column">{item.model}</td>
                {/* <td className="upc_ean-column">{item.upc_ean}</td> */}
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
