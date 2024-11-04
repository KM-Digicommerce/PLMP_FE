import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';

const AddProduct = () => {
    const [productData, setProductData] = useState({
        title: '',
        description: '',
        price: '',
        variants: [],
        // Add other fields here as needed
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/addProduct`, 
                productData
            );
            if (response.data.status === 'success') {
                alert('Product added successfully!');
                setProductData({
                    title: '',
                    description: '',
                    price: '',
                    variants: [],
                    // Reset other fields if needed
                });
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    };

    return (
        <div className="add-product-container">
            <h2>Add Product</h2>
            <input
                type="text"
                name="title"
                placeholder="Product Title"
                value={productData.title}
                onChange={handleChange}
            />
            <textarea
                name="description"
                placeholder="Product Description"
                value={productData.description}
                onChange={handleChange}
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={productData.price}
                onChange={handleChange}
            />
            {/* Add more fields as needed */}
            <button onClick={handleSave}>Save Product</button>
        </div>
    );
};

export default AddProduct;
