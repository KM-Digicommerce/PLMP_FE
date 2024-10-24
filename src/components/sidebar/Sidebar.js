// src/components/sidebar/Sidebar.js

import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ setSelectedProductTypeId, refreshCategories, onCategoriesClick, onAllProductsClick }) => {
  const [showProductsSubmenu, setShowProductsSubmenu] = useState(false);

  // Toggle the Products submenu
  const handleProductsClick = () => {
    setShowProductsSubmenu(!showProductsSubmenu);
  };

  return (
    <div className="sidebar">
      <ul className="topMenu">
        <li onClick={onCategoriesClick}>Categories</li>
        <li onClick={handleProductsClick}>
          Products
          {showProductsSubmenu && (
            <ul className="subMenu">
              <li onClick={onAllProductsClick}>All Products</li> {/* Add this line */}
              <li>Add New Product</li>
            </ul>
          )}
        </li>
        <li>Variants</li>
        <li>Import</li>
        <li>Export</li>
        <li>Settings</li>
      </ul>
    </div>
  );
};

export default Sidebar;
