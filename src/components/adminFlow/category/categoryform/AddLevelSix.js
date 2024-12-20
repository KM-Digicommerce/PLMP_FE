// src/components/AddLevelSix.js
import React, { useState, useEffect } from 'react';
import './AddCategory.css'; // Assuming you have a CSS file for styling
import Swal from 'sweetalert2';
import axiosInstance from '../../../../utils/axiosConfig';

const AddLevelSix = ({ 
    selectedCategoryIdPopup, selectedLevel2IdPopup, selectedLevel3IdPopup, selectedLevel4IdPopup, selectedLevel5IdPopup, categories, refreshCategories, setIsTyping,
    onCloseDialog
}) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState(selectedCategoryIdPopup || '');
    const [selectedLevel2Id, setselectedLevel2Id] = useState(selectedLevel2IdPopup || '');
    const [selectedLevel3Id, setSelectedLevel3Id] = useState(selectedLevel3IdPopup || '');
    const [selectedLevel4Id, setSelectedLevel4Id] = useState(selectedLevel4IdPopup || '');
    const [selectedLevel5Id, setSelectedLevel5Id] = useState(selectedLevel5IdPopup || '');
    const [levelSixName, setLevelSixName] = useState('');
    const handleInputChange = (e) => {
        setLevelSixName(e.target.value);
        setIsTyping(e.target.value.trim().length > 0); 
      };
    const handleCategoryChange = (e) => {
        setSelectedCategoryId(e.target.value);
        setselectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedLevel4Id('');
        setSelectedLevel5Id('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post(`${process.env.REACT_APP_IP}/createCategory5/`, {
                name: levelSixName,
                category_id: selectedLevel5Id,
            });

            // Reset form fields
            setLevelSixName('');
            setSelectedCategoryId('');
            setselectedLevel2Id('');
            setSelectedLevel3Id('');
            setSelectedLevel4Id('');
            setSelectedLevel5Id('');
            setIsTyping(false);

            await refreshCategories(); // Refresh the category list
            Swal.fire({ title: 'Success', text: 'Category added successfully!', icon: 'success', confirmButtonText: 'OK', customClass: {
                container: 'swal-custom-container',
                popup: 'swal-custom-popup',
                title: 'swal-custom-title',
                confirmButton: 'swal-custom-confirm',
                cancelButton: 'swal-custom-cancel',
            },
        }).then(() => { });  
        onCloseDialog();
        } catch (error) {
            console.error('Error adding level 6 category:', error);
            Swal.fire('Error', 'Error adding level 6 category. Please try again.', 'error');
        }
    };

    useEffect(() => {
        // Resetting states when the props change
        setSelectedCategoryId(selectedCategoryIdPopup);
        setselectedLevel2Id(selectedLevel2IdPopup);
        setSelectedLevel3Id(selectedLevel3IdPopup);
        setSelectedLevel4Id(selectedLevel4IdPopup);
        setSelectedLevel5Id(selectedLevel5IdPopup);
    }, [selectedCategoryIdPopup, selectedLevel2IdPopup, selectedLevel3IdPopup, selectedLevel4IdPopup, selectedLevel5IdPopup]);

    return (
        <div className="add-level-six">
            <p className="form-title">Add Level 6 Category</p>
            <form onSubmit={handleSubmit}>
                <select value={selectedCategoryId} onChange={handleCategoryChange} required>
                    <option value="">Select a Category</option>
                    {categories.category_list.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {selectedCategoryId && (
                    <select value={selectedLevel2Id} onChange={(e) => setselectedLevel2Id(e.target.value)} required>
                        <option value="">Select a Section</option>
                        {categories.category_list
                            .find((cat) => cat._id === selectedCategoryId)
                            ?.level_one_category_list.map((section) => (
                                <option key={section._id} value={section._id}>
                                    {section.name}
                                </option>
                            ))}
                    </select>
                )}
                {selectedLevel2Id && (
                    <select value={selectedLevel3Id} onChange={(e) => setSelectedLevel3Id(e.target.value)} required>
                        <option value="">Select a Product Type</option>
                        {categories.category_list
                            .find((cat) => cat._id === selectedCategoryId)
                            ?.level_one_category_list.find((sec) => sec._id === selectedLevel2Id)
                            ?.level_two_category_list.map((productType) => (
                                <option key={productType._id} value={productType._id}>
                                    {productType.name}
                                </option>
                            ))}
                    </select>
                )}
                {selectedLevel3Id && (
                    <select value={selectedLevel4Id} onChange={(e) => setSelectedLevel4Id(e.target.value)} required>
                        <option value="">Select a Level 4</option>
                        {categories.category_list
                            .find((cat) => cat._id === selectedCategoryId)
                            ?.level_one_category_list.find((sec) => sec._id === selectedLevel2Id)
                            ?.level_two_category_list.find((pt) => pt._id === selectedLevel3Id)
                            ?.level_three_category_list.map((levelFour) => (
                                <option key={levelFour._id} value={levelFour._id}>
                                    {levelFour.name}
                                </option>
                            ))}
                    </select>
                )}
                {selectedLevel4Id && (
                    <select value={selectedLevel5Id} onChange={(e) => setSelectedLevel5Id(e.target.value)} required>
                        <option value="">Select a Level 5</option>
                        {categories.category_list
                            .find((cat) => cat._id === selectedCategoryId)
                            ?.level_one_category_list.find((sec) => sec._id === selectedLevel2Id)
                            ?.level_two_category_list.find((pt) => pt._id === selectedLevel3Id)
                            ?.level_three_category_list.find((lf) => lf._id === selectedLevel4Id)
                            ?.level_four_category_list.map((levelFive) => (
                                <option key={levelFive._id} value={levelFive._id}>
                                    {levelFive.name}
                                </option>
                            ))}
                    </select>
                )}
                <input
                    type="text"
                    value={levelSixName}
                    className='add_category_input'
                    onChange={handleInputChange}
                    placeholder="Enter Level 6 name"
                    required
                />
                <button type="submit">Add New Category</button>
            </form>
        </div>
    );
};

export default AddLevelSix;