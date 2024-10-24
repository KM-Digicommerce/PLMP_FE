// src/components/category/categorytable/CategoriesTable.js

import React, { useState } from 'react';
import './CategoriesTable.css';
import axios from 'axios';
import AddCategory from '../categoryform/AddCategory';
import AddSection from '../categoryform/AddSection';
import AddProductType from '../categoryform/AddProductType';

const CategoriesTable = ({ categories, refreshCategories }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!Array.isArray(filteredCategories) || filteredCategories.length === 0) {
    return <div>No categories available</div>;
  }

  // Delete Category API Call
  const handleDeleteCategory = async (categoryId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteCategory/`, {
        data: { id: categoryId }, // Payload for delete API
      });

      // Check if the response indicates a successful deletion
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server'); // Handle unexpected response
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this section?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteSection/`, {
        data: { id: sectionId },
      });
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Failed to delete section. Please try again.');
    }
  };

  const handleDeleteProductType = async (productTypeId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this product type?');
    if (!confirmDelete) return; // Exit if user cancels

    try {
      const response = await axios.delete(`${process.env.REACT_APP_IP}/deleteProductType/`, {
        data: { id: productTypeId },
      });
      if (response.status === 204 || response.status === 200) {
        await refreshCategories(); // Refresh categories after successful deletion
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error deleting product type:', error);
      alert('Failed to delete product type. Please try again.');
    }
  };

  return (
    <div className="CategoryMain">
      <div className="CategoryTable-header">
        <h3>Categories</h3>
      </div>

      <div className='CategoryContainer'>
        <div className='CategoryContainerLeft'>
          <table>
            <thead>
              <tr>
                <th>Category Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <React.Fragment key={category.category_id}>
                  <tr>
                    <td className='CategoryName'>
                      {category.name}
                      <div className="action-buttons">
                        <span className="action">Edit</span>
                        <span className="action" onClick={(e) => {
                          e.stopPropagation(); 
                          handleDeleteCategory(category.category_id);
                        }}>
                          Delete
                        </span>
                      </div>
                    </td>
                  </tr>

                  {category.sections && category.sections.length > 0 ? (
                    category.sections.map((section) => (
                      section.section_name ? (
                        <React.Fragment key={section.section_id}>
                          <tr>
                            <td style={{ paddingLeft: '20px' }}>
                              {section.section_name}
                              <div className="action-buttons">
                                <span className="action">Edit</span>
                                <span className="action" onClick={(e) => {
                                  e.stopPropagation(); 
                                  handleDeleteSection(section.section_id); // Call delete section function
                                }}>
                                  Delete
                                </span>
                              </div>
                            </td>
                          </tr>

                          {section.product_types && section.product_types.length > 0 ? (
                            section.product_types.map((productType) => (
                              productType.name ? (
                                <tr key={productType.id}>
                                  <td style={{ paddingLeft: '40px' }}>
                                    {productType.name}
                                    <div className="action-buttons">
                                      <span className="action">Edit</span>
                                      <span className="action" onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleDeleteProductType(productType.id); // Call delete product type function
                                      }}>
                                        Delete
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ) : null
                            ))
                          ) : null}
                        </React.Fragment>
                      ) : null
                    ))
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className='CategoryContainerRight'>
          <p>Categories Forms</p>
          <AddCategory refreshCategories={refreshCategories} />
          <AddSection categories={categories} refreshCategories={refreshCategories} />
          <AddProductType categories={categories} refreshCategories={refreshCategories} />
        </div>
      </div>
    </div>
  );
};

export default CategoriesTable;
