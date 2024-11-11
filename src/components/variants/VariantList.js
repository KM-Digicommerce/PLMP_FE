import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import './VariantList.css';
import axiosInstance from '../../../src/utils/axiosConfig';

const VariantList = ({ categories, variants, refreshVariants }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedLevel2Id, setselectedLevel2Id] = useState('');
    const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
    const [selectedlevel4, setSelectedlevel4] = useState('');
    const [selectedlevel5, setSelectedlevel5] = useState('');
    const [selectedlevel6, setSelectedlevel6] = useState('');

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
    const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
    const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
    const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
    const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
    const [data, setData] = useState([]);
    const [variantsData, setVariantsData] = useState([]);

    const [searchQueries, setSearchQueries] = useState({
        level1: '',
        level2: '',
        level3: '',
        level4: '',
        level5: '',
        level6: '',
    });
    const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');

    const filteredCategories = categories.category_list.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.category_list.find(level1 => level1._id === selectedCategoryId);
    const filteredCategoriesLevel2 = levelOneCategory?.level_one_category_list.filter(level2 =>
        level2.name.toLowerCase().includes(searchQueries.level2.toLowerCase())
    );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;
    const filteredCategoriesLevel3 = levelTwoCategory?.level_two_category_list.filter(level3 =>
        level3.name.toLowerCase().includes(searchQueries.level3.toLowerCase())
    );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;
    const filteredCategoriesLevel4 = levelThreeCategory?.level_three_category_list.filter(level4 =>
        level4.name.toLowerCase().includes(searchQueries.level4.toLowerCase())
    );

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;
    const filteredCategoriesLevel5 = levelFourCategory?.level_four_category_list.filter(level5 =>
        level5.name.toLowerCase().includes(searchQueries.level5.toLowerCase())
    );

    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;
    const filteredCategoriesLevel6 = levelFiveCategory?.level_five_category_list.filter(level6 =>
        level6.name.toLowerCase().includes(searchQueries.level6.toLowerCase())
    );

    const handleSearchChange = (level, value) => {
        setSearchQueries(prev => ({ ...prev, [level]: value }));
    };

    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            console.log('API Response: here', res.data.data); // Log the API response
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
        setselectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };

    const handleCategorySelectForVariants = async (id) => {
        setSelectedCategoryForVariant(id);
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            // console.log('API Response: here', res.data.data); 
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleLevel2Select = (id) => {
        setselectedLevel2Id(id);
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsLevel2DropdownOpen(false);
    };

    const handleLevel3Select = (id) => {
        setSelectedLevel3Id(id);
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsLevel3DropdownOpen(false);
    };

    const handleLevelSelect = (level, id) => {
        switch (level) {
            case 4:
                setSelectedlevel4(id);
                break;
            case 5:
                setSelectedlevel5(id);
                break;
            case 6:
                setSelectedlevel6(id);
                break;
            default:
                break;
        }
    };
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //  To make visible the next level categories
    const level2Categories = levelOneCategory ? levelOneCategory.level_one_category_list : [];
    const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedLevel2Id);
    const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
    const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedLevel3Id);
    const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
    const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
    const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
    const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
    const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
    const handleAddVariant = useCallback(async (category_varient_id, selectedCategoryForVariant) => {
        setIsLoading(true);
        setError(null);
        Swal.fire({
            title: 'Add New Variant',
            input: 'text',
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/createVarientOption/`, {
                        name: result.value,
                        category_varient_id: category_varient_id,
                        category_id: selectedCategoryForVariant
                    });
                    Swal.fire('Success', 'Variant added successfully!', 'success')
                    await handleCategorySelectForVariants(); // Ensure it's awaited for proper sequencing

                } catch (err) {
                    console.error('Error adding variant:', err);
                    setError('Failed to add variant. Please try again.');
                } finally {
                    setIsLoading(false);
                }
            }
        });
    }, []); // Add dependencies if required

    const handleAddVariantValue = async (typeId) => {
        // Show Swal popup to get the new type_value_name
        const { value: typeValueName } = await Swal.fire({
            title: 'Add Variant Value',
            input: 'text',
            inputPlaceholder: 'Enter variant value name',
            showCancelButton: true,
            confirmButtonText: 'Save',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a value!';
                }
            },
            customClass: {
              container: 'swal-custom-container',  
              popup: 'swal-custom-popup',          
              title: 'swal-custom-title',          
              confirmButton: 'swal-custom-confirm',
              cancelButton: 'swal-custom-cancel'   
          }
        });

        if (typeValueName) {
            try {
                setIsLoading(true);
                setError(null);

                // Make API call to add the new variant value
                const response = await axiosInstance.post(
                    `${process.env.REACT_APP_IP}/createValueForVarientName/`,
                    {
                        name: typeValueName,
                        option_id: typeId,
                    }
                );
                Swal.fire('Success', 'Variant value added successfully!', 'success')
                await handleCategorySelectForVariants(); // Ensure it's awaited for proper sequencing
                // Here you can update the state or fetch the updated data if needed

            } catch (err) {
                console.error('Error adding variant value:', err);
                setError('Failed to add variant value. Please try again.');
            } finally {
                setIsLoading(false);
            }
        }
    };
    const [searchQuery, setSearchQuery] = useState('');
    // Safely access the variant list if available
    const variantList = variantsData && variantsData.varient_list ? variantsData.varient_list : [];

    // Check if there are any variants before performing filtering
    const filteredVariantList = variantList.length > 0
      ? variantList.flatMap((variant) =>
          variant.option_value_list
            ? variant.option_value_list.filter((value) =>
                value.type_value_name && 
                value.type_value_name.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : []
        )
      : [];
  
    const handleSearchChangeforVariants = (e) => {
      setSearchQuery(e.target.value);
    };
    return (
        <div>
            <h2 className='header_cls'>VariantList Schema!</h2>
            <div className='CategoryContainer'>
                <div className='DropdownsContainer'>
                    {/* Level 1 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="categorySelect">Level 1:</label>
                        <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                            <div className="selected-category">
                                {selectedCategoryId ? categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isCategoryDropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level1}
                                        onChange={(e) => handleSearchChange('level1', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleCategorySelect('')}>
                                        <span>Select Category</span>
                                    </div>
                                    {filteredCategories.map(level1 => (
                                        <div className="dropdown-option" key={level1._id} onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id); }}>
                                            <span>{level1.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Level 2 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="sectionSelect">Level 2:</label>
                        <div className="custom-dropdown" onClick={() => setIsLevel2DropdownOpen(!isLevel2DropdownOpen)}>
                            <div className="selected-category">
                                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isLevel2DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level2}
                                        onChange={(e) => handleSearchChange('level2', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevel2Select('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel2?.map(level2 => (
                                        <div className="dropdown-option" key={level2._id} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id); }}>
                                            <span>{level2.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Level 3 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="productTypeSelect">Level 3:</label>
                        <div className="custom-dropdown" onClick={() => setIsLevel3DropdownOpen(!isLevel3DropdownOpen)}>
                            <div className="selected-category">
                                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isLevel3DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level3}
                                        onChange={(e) => handleSearchChange('level3', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevel3Select('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel3?.map(level3 => (
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id); }}>
                                            <span>{level3.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Level 4 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="level4Select">Level 4:</label>
                        <div className="custom-dropdown" onClick={() => setIslevel4DropdownOpen(!islevel4DropdownOpen)}>
                            <div className="selected-category">
                                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {islevel4DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level4}
                                        onChange={(e) => handleSearchChange('level4', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(4, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel4?.map(level4 => (
                                        <div className="dropdown-option" key={level4._id} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id); }}>
                                            <span>{level4.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Level 5 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="level5Select">Level 5:</label>
                        <div className="custom-dropdown" onClick={() => setIslevel5DropdownOpen(!islevel5DropdownOpen)}>
                            <div className="selected-category">
                                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {islevel5DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level5}
                                        onChange={(e) => handleSearchChange('level5', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(5, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel5?.map(level5 => (
                                        <div className="dropdown-option" key={level5._id} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id); }}>
                                            <span>{level5.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Level 6 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="level6Select">Level 6:</label>
                        <div className="custom-dropdown" onClick={() => setIslevel6DropdownOpen(!islevel6DropdownOpen)}>
                            <div className="selected-category">
                                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {islevel6DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level6}
                                        onChange={(e) => handleSearchChange('level6', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleLevelSelect(6, '')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel6?.map(level6 => (
                                        <div className="dropdown-option" key={level6._id} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id); }}>
                                            <span>{level6.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {level2Categories.length > 0 && variantsData.varient_list && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddVariant(variantsData.category_varient_id, selectedCategoryForVariant);
                    }}
                    className='addvariant_btn'
                    style={{

                    }}
                >+ Add variant
                </button>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {variantsData.varient_list && variantsData.varient_list.length > 0 && (
                <div>
                   

{variantsData.varient_list && (
  <div className="variant-container">
    <div className="variant-header">
      <span>Variants</span>
    </div>

{variantList.length > 0 && (
      <div className="variant-container">
        <div className="variant-option-table">
          <table>
            <thead>
              <tr>
                <th>Option Type</th>
                <th>Values</th>
              </tr>
            </thead>
            <tbody>
              {variantList.map((variant, index) => (
                <tr key={index}>
                  <td>{variant.type_name} <button
                      onClick={() => handleAddVariantValue(variant.type_id)}
                      className="add-variant-value-button"
                    >+
                    </button></td>
                  <td>
                    {variant.option_value_list.length > 0 ? (
                      <ul className="option-value-list">
                        {variant.option_value_list.map((value, valueIndex) => (
                          <li key={valueIndex} className="option-value-item">
                            {value.type_value_name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No values available</span>
                    )}
                    <button
                      onClick={() => handleAddVariantValue(variant.type_id)}
                      disabled={isLoading}
                      className="add-variant-value-button"
                    >
                      {isLoading ? "Saving..." : "+ Add Variant Value"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Search Bar for the second table */}
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChangeforVariants}
            className='variant_search'
            placeholder="Search variant values..."
          
          />
        </div>

        {/* Second table for displaying Variant, Price, and Available */}
        <div className="variant-table">
          <table>
            <thead>
              <tr>
                <th>Variant</th>
                <th>Price</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredVariantList.map((value, valueIndex) => (
                <tr key={value.type_value_id}>
                  <td>{value.type_value_name}</td>
                  <td><input type="text" placeholder="price" /></td>
                  <td><input type="text" placeholder="stock" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
)}

                </div>
            )}
        </div>
    );
};

export default VariantList;
