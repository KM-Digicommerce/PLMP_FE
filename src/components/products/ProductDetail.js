
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ProductDetail.css'; // Importing CSS for styling

const ProductDetail = () => {
    const { productId } = useParams(); // Get the product ID from the URL
    const navigate = useNavigate(); // For navigation
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({}); // Store the original data
    const [variantData, setVariantData] = useState([]); // Store variant data

    useEffect(() => {
        const fetchProductDetail = async () => {
            console.log('Product ID from URL:', productId); // Add this line for debugging

            try {
                const response = await axios.post(`${process.env.REACT_APP_IP}/obtainProductDetails/`, {
                    id: productId, // Use the id from the URL
                });

                console.log(response.data, 'API Response'); // Log the full response for debugging

                if (response.data && response.data.data) {
                    const productObj = response.data.data.product_obj;
                    console.log(productObj, 'Parsed Product Object');
                    setFormData(productObj); // Set initial form data
                    setOriginalData(productObj); // Store a copy of the original data for comparison
                } else {
                    setError('Product not found');
                }
                const variantResponse = await axios.post(`${process.env.REACT_APP_IP}/obtainAllVarientList/`, {
                    product_id: productId, // Adjust if the API needs a product ID
                });
                console.log(variantResponse.data, 'Variant List Response');
                if (variantResponse.data && variantResponse.data.data) {
                    setVariantData(variantResponse.data.data || []);
                }
            } catch (err) {
                console.error('Error fetching product details', err); // Log error for debugging
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductDetail();
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            Swal.fire({
                title: 'Warning!',
                text: 'Please edit something! No changes detected',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        try {
            const payload = {
                id: formData.product_id || '', // Assuming you want to send the product_id as the ID
                update_obj: {
                    product_name: formData.product_name,
                    url: formData.url,
                    BasePrice: formData.BasePrice,
                    Manufacturer_name: formData.ManufacturerName,
                    tags: formData.tags,
                    Key_features: formData.Key_features
                },
            };
            const response = await axios.put(`${process.env.REACT_APP_IP}/productUpdate/`, payload); // Update the product
            console.log(response.data, 'Product updated successfully');
            Swal.fire({
                title: 'Success!',
                text: 'Product updated successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload(); // Refresh the page after successful update
            });
        } catch (err) {
            console.error('Error updating product', err);
            alert('Error updating product');
        }
    };
    const handleBackClick = () => {
        navigate('/'); // Adjust the path to match your product listing route
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-detail">
            <button onClick={handleBackClick} className="back-button">
                &larr; Back to Products
            </button>
            <form onSubmit={handleSubmit} className="product-edit-form">
                <div className="product-edit-container">
                    {/* Left side: Product Image */}
                    <div className="product-image-section">
                        <label htmlFor="image">Product Image</label>
                        {formData.ImageURL && formData.ImageURL.length > 0 && (
                            <img src={formData.ImageURL} alt={formData.product_name} className="product-image-preview" />
                        )}
                    </div>

                    {/* Right side: Product Information */}
                    <div className="product-info-section">
                        <h2>Edit Product Details</h2>
                        <div className="form-group">
                            <label htmlFor="product_name">Product Name</label>
                            <input
                                type="text"
                                id="product_name"
                                name="product_name"
                                value={String(formData.product_name || '')}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="BasePrice">Base Price</label>
                            <input
                                type="text"
                                id="BasePrice"
                                name="BasePrice"
                                value={String(formData.BasePrice || '')}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="ManufacturerName">Manufacturer Name</label>
                            <input
                                type="text"
                                id="ManufacturerName"
                                name="ManufacturerName"
                                value={String(formData.ManufacturerName || '')}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={String(formData.tags || '')}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Key_features">Key Features</label>
                            <input
                                type="text"
                                id="Key_features"
                                name="Key_features"
                                value={String(formData.Key_features || '')}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="save-button">Save Changes</button>
                    </div>
                </div>
            </form>

            {/* Product Variant Section */}
          <div className='product_variant'>
                <h3>Product Variants</h3>
                <table className="variant-table">
                    <thead>
                        <tr>
                            <th>Variant SKU</th>
                            <th>Unfinished Price</th>
                            <th>Finished Price</th>
                            <th>Options</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variantData.map((variant) => (
                            <tr key={variant.id}>
                                <td>{variant.varient_sku}</td>
                                <td>{variant.unfinished_price}</td>
                                <td>{variant.finished_price}</td>
                                <td>
                                    {variant.options.map((option, index) => (
                                        <div key={index}>
                                            {option.option_name}: {option.option_value}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;