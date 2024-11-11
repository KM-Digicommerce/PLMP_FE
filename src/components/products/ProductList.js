// src\components\products\ProductList.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';
import axios from 'axios';
import Swal from 'sweetalert2';


const ProductList = () => {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkEditData, setBulkEditData] = useState({
    product_name: '',
    BasePrice: '',
    ManufacturerName: '',
    tags: '',
    Key_features: ''
  });
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
        const response = await axios.get(`${process.env.REACT_APP_IP}/obtainAllProductList/`);

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
    if (!sortColumn) return 0; // No sorting if no column selected

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue === bValue) return 0;
    return (aValue > bValue ? 1 : -1) * (sortOrder === "asc" ? 1 : -1);
  });

  // const handleBulkEditChange = (e) => {
  //   const { name, value } = e.target;
  //   setBulkEditData({ ...bulkEditData, [name]: value });
  // };

  // const handleBulkEditSubmit = async () => {
  //   if (!bulkEditData.product_name && !bulkEditData.BasePrice && !bulkEditData.tags) {
  //     Swal.fire('Please enter values to update!', '', 'warning');
  //     return;
  //   }
  //   const updates = {
  //     ids: selectedProducts,
  //     update_obj: {
  //       ...(bulkEditData.product_name && { product_name: bulkEditData.product_name }),
  //       ...(bulkEditData.BasePrice && { BasePrice: bulkEditData.BasePrice }),
  //       ...(bulkEditData.ManufacturerName && { ManufacturerName: bulkEditData.ManufacturerName }),
  //       ...(bulkEditData.tags && { tags: bulkEditData.tags }),
  //       ...(bulkEditData.Key_features && { Key_features: bulkEditData.Key_features }),
  //     },
  //   };

  //   try {
  //     const response = await axios.put(`${process.env.REACT_APP_IP}/productBulkUpdate/`, updates);
  //     Swal.fire('Success', 'Bulk edit applied successfully', 'success').then(() => {
  //       window.location.reload();
  //     });
  //   } catch (err) {
  //     Swal.fire('Error', 'Failed to apply bulk edit', 'error');
  //   }
  // };

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
      {/* <div className="bulk-edit-panel">
        <h3>Bulk Edit</h3>
        <div className="bulk-edit-inputs">
          <input
            type="text"
            name="product_name"
            placeholder="Edit Product Name"
            value={bulkEditData.product_name}
            onChange={handleBulkEditChange}
          />
          <input
            type="text"
            name="BasePrice"
            placeholder="Edit Base Price"
            value={bulkEditData.BasePrice}
            onChange={handleBulkEditChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Edit Tags"
            value={bulkEditData.tags}
            onChange={handleBulkEditChange}
          />
          <button onClick={handleBulkEditSubmit} className="apply-bulk-edit-button">
            Apply Changes
          </button>
        </div>
      </div> */}
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
              <th className="product-column" onClick={() => handleSort("product_name")}> Product Name {sortColumn === "product_name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="model-column" onClick={() => handleSort("model")}>
                Model {sortColumn === "model" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="price-column" onClick={() => handleSort("base_price")}>
                Base Price {sortColumn === "base_price" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="msrpprice-column" onClick={() => handleSort("msrp")}>
                MSRP Price {sortColumn === "msrp" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="attributes-column" onClick={() => handleSort("attributes")}>
                Attributes {sortColumn === "attributes" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
              <th className="upc_ean-column" onClick={() => handleSort("upc_ean")}>
                UPC_EAN {sortColumn === "upc_ean" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </th>
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
                <td className="product-cell" onClick={() => handleProductSelect(item.product_id)}>
                  {/* {Array.isArray(item.url) ? (
                    <img
                      src={item.url[0]}
                      alt={item.product_name}
                      className="product-image-round"
                    />
                  ) : (
                    <img
                      src={item.url}
                      alt={item.product_name}
                      className="product-image-round"
                    />
                  )} */}
                  <span className="product-name" onClick={() => handleProductSelect(item.product_id)}>{item.product_name}</span>
                </td>
                <td className="model-column">{item.model}</td>
                <td className="price-column">{item.base_price}</td>
                <td className="msrpprice-column">{item.msrp}</td>
                <td className="attributes-column">{item.attributes}</td>
                <td className="upc_ean-column">{item.upc_ean}</td>
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
