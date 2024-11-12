
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './ProductDetail.css'; // Importing CSS for styling
import axiosInstance from '../../../src/utils/axiosConfig';

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
                const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainProductDetails/`, {
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
                const variantResponse = await axiosInstance.post(`${process.env.REACT_APP_IP}/obtainAllVarientList/`, {
                    product_id: productId, // Adjust if the API needs a product ID
                });
                console.log(variantResponse.data.data, 'Variant List Response');
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
                    base_price: formData.base_price,
                    breadcrumb: formData.breadcrumb,
                    tags: formData.tags,
                    key_features: formData.key_features,
                    msrp: formData.msrp,
                    features: formData.features,
                    long_description: formData.long_description,
                    short_description: formData.short_description,
                    attributes: formData.attributes,
                    model: formData.model,
                    upc_ean: formData.upc_ean,


                },
            };
            const response = await axiosInstance.put(`${process.env.REACT_APP_IP}/productUpdate/`, payload); // Update the product
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
        navigate('/Homepage'); // Adjust the path to match your product listing route
    };
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="product-detail">
            <button onClick={handleBackClick} className="back-button">
                &larr; Back to ProductList 
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
                        <h3 className='edit_prd'>Edit Product Details</h3>
                        <div className="form-group">
                            <label htmlFor="product_name">Product Name</label>
                            <input type="text" id="product_name" name="product_name" value={String(formData.product_name || '')} onChange={handleChange} required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="base_price">Base Price</label>
                            <span class="input-prefix">$</span>
                            <input type="text" id="base_price" name="base_price" value={String(formData.base_price || '')} onChange={handleChange} required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="msrp">MSRP</label>
                            <input type="text" id="msrp" name="msrp" value={String(formData.msrp || '')} onChange={handleChange} required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="model">Model</label>
                            <input type="text" id="model" name="model" value={String(formData.model || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="breadcrumb">Breadcrumb</label>
                            <input type="text" id="breadcrumb" name="breadcrumb" value={String(formData.breadcrumb || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="upc_ean">UPC_EAN</label>
                            <input type="text" id="upc_ean" name="upc_ean" value={String(formData.upc_ean || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="long_description">Long Description</label>
                            <input type="text" id="long_description" name="long_description" value={String(formData.long_description || '')} onChange={handleChange}
                            />
                            </div>
                        <div className="form-group">
                            <label htmlFor="short_description">Short Description</label>
                            <input type="text" id="short_description" name="short_description" value={String(formData.short_description || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="attributes">Attributes</label>
                            <input type="text" id="attributes" name="attributes" value={String(formData.attributes || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="tags">Tags</label>
                            <input type="text" id="tags" name="tags" value={String(formData.tags || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="features">Features</label>
                            <input type="text" id="features" name="features" value={String(formData.features || '')} onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="key_features">Key Features</label>
                            <input type="text" id="key_features" name="key_features" value={String(formData.key_features || '')} onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="save-button_pdp">Save Changes</button>
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
                        </tr>
                    </thead>
                    <tbody>
                        {variantData.map((variant) => (
                            <tr key={variant.sku_number}>
                                <td>{variant.sku_number}</td>
                                <td>{variant.unfinished_price}</td>
                                <td>{variant.finished_price}</td>
                                <td>
                                    {variant.varient_option_list.map((option, index) => (
                                        <div key={index}>
                                            {option.type_name}: {option.type_value}
                                        </div>
                                    ))}
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