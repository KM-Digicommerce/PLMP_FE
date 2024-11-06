import React, { useState, useEffect,useCallback  } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import './VariantList.css';

const VariantList = ({ categories, variants, refreshVariants }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [selectedProductTypeId, setSelectedProductTypeId] = useState('');
    const [selectedlevel4, setSelectedlevel4] = useState('');
    const [selectedlevel5, setSelectedlevel5] = useState('');
    const [selectedlevel6, setSelectedlevel6] = useState('');

    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isSectionDropdownOpen, setIsSectionDropdownOpen] = useState(false);
    const [isProductTypeDropdownOpen, setIsProductTypeDropdownOpen] = useState(false);
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

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.find(level1 => level1._id === selectedCategoryId);
    const filteredCategoriesLevel2 = levelOneCategory?.level_one_category_list.filter(level2 =>
        level2.name.toLowerCase().includes(searchQueries.level2.toLowerCase())
    );

    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedSectionId) : null;
    const filteredCategoriesLevel3 = levelTwoCategory?.level_two_category_list.filter(level3 =>
        level3.name.toLowerCase().includes(searchQueries.level3.toLowerCase())
    );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedProductTypeId) : null;
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
            const res = await axios.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            console.log('API Response: here', res.data.data); // Log the API response
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
        setSelectedSectionId('');
        setSelectedProductTypeId('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };

    const handleCategorySelectForVariants = async (id) => {
        setSelectedCategoryForVariant(id);
        try {
            const res = await axios.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            // console.log('API Response: here', res.data.data); // Log the API response
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleSectionSelect = (id) => {
        setSelectedSectionId(id);
        setSelectedProductTypeId('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsSectionDropdownOpen(false);
    };

    const handleProductTypeSelect = (id) => {
        setSelectedProductTypeId(id);
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsProductTypeDropdownOpen(false);
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
const levelTwoCategoryForVisible = level2Categories.find(level2 => level2._id === selectedSectionId);
const level3Categories = levelTwoCategoryForVisible ? levelTwoCategoryForVisible.level_two_category_list : [];
const levelThreeCategoryForVisible = level3Categories.find(level3 => level3._id === selectedProductTypeId);
const level4Categories = levelThreeCategoryForVisible ? levelThreeCategoryForVisible.level_three_category_list : [];
const levelFourCategoryForVisible = level4Categories.find(level4 => level4._id === selectedlevel4);
const level5Categories = levelFourCategoryForVisible ? levelFourCategoryForVisible.level_four_category_list : [];
const levelFiveCategoryForVisible = level5Categories.find(level5 => level5._id === selectedlevel5);
const level6Categories = levelFiveCategoryForVisible ? levelFiveCategoryForVisible.level_five_category_list : [];
    const handleAddVariant = useCallback(async (category_varient_id,selectedCategoryForVariant) => {
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
                    const response = await axios.post(`${process.env.REACT_APP_IP}/createVarientOption/`, {
                        name: result.value,
                        category_varient_id: category_varient_id,
                        category_id:selectedCategoryForVariant
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
        });

        if (typeValueName) {
            try {
                setIsLoading(true);
                setError(null);

                // Make API call to add the new variant value
                const response = await axios.post(
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
                                {selectedCategoryId ? categories.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
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
                        <div className="custom-dropdown" onClick={() => setIsSectionDropdownOpen(!isSectionDropdownOpen)}>
                            <div className="selected-category">
                                {selectedSectionId ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedSectionId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isSectionDropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level2}
                                        onChange={(e) => handleSearchChange('level2', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleSectionSelect('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel2?.map(level2 => (
                                        <div className="dropdown-option" key={level2._id} onClick={() => { handleSectionSelect(level2._id); handleCategorySelectForVariants(level2._id); }}>
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
                        <div className="custom-dropdown" onClick={() => setIsProductTypeDropdownOpen(!isProductTypeDropdownOpen)}>
                            <div className="selected-category">
                                {selectedProductTypeId ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedProductTypeId)?.name : 'Select category'}<ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                            </div>
                            {isProductTypeDropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level3}
                                        onChange={(e) => handleSearchChange('level3', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()} // Keeps dropdown open on input click
                                    />
                                    <div className="dropdown-option" onClick={() => handleProductTypeSelect('')}>
                                        <span>Select category</span>
                                    </div>
                                    {filteredCategoriesLevel3?.map(level3 => (
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleProductTypeSelect(level3._id); handleCategorySelectForVariants(level3._id); }}>
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
                                handleAddVariant(variantsData.category_varient_id,selectedCategoryForVariant);
                        }}
                        disabled={isLoading}
                        className='addvariant_btn'
                        style={{

                        }}
                    >
                        {isLoading ? 'Adding...' : 'Add Variant'}
                    </button>
                      )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
            {variantsData.varient_list && variantsData.varient_list.length > 0 && (
                <div>
                    {/* <table className="variant-table">
                        <thead>
                            <tr>
                                {variantsData.varient_list.map((variant, index) => (
                                    <th key={index}>{variant.type_name}</th>
                                ))}

                            </tr>
                        </thead>
                        <tbody>
                            {variantsData.varient_list.length > 0 ? (
                                variantsData.varient_list.map((variant, variantIndex) => (
                                    variant.option_value_list && variant.option_value_list.length > 0 ? (
                                        variant.option_value_list.map((variants, index) => (
                                            <tr key={index}>
                                                <td>{variants.type_value_name}</td>
                                                <td>{variants.type_value_id}</td>

                                            </tr>

                                        ))
                                    ) : (
                                        <tr key={`no-variants-${variantIndex}`}>
                                            <td colSpan={3}>No product variants available</td>
                                        </tr>
                                    )
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>No product variants available</td>
                                </tr>
                            )}
                            <tr>

                                <td>
                                    <button
                                        onClick={() => ("name")}
                                        disabled={isLoading}
                                    >
                                        Add Variant Name
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => ("type")}
                                        disabled={isLoading}
                                    >
                                        Add Type
                                    </button>
                                </td>
                                <td>
                                    <button
                                        onClick={() => ("price")}
                                        disabled={isLoading}
                                    >
                                        Add Price
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table> */}

{variantsData.varient_list && (
  <table className="variant-table">
    <thead>
      <tr>
        {variantsData.varient_list.map((variant, index) => (
          <th key={index}>{variant.type_name}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {/* Using a dynamic row structure to ensure all type_value_name values are displayed */}
      {variantsData.varient_list.length > 0 && (
        <tr>
          {variantsData.varient_list.map((variant, index) => (
            <td key={index}>
              {/* Check for multiple values */}
              {variant.option_value_list && variant.option_value_list.length > 0 ? (
                <>
                  {/* Highlight if there are multiple values */}
                  <ul style={{ padding: 0, listStyleType: 'none' }}>
                    {variant.option_value_list.map((value, valueIndex) => (
                      <li key={valueIndex}>
                        * {value.type_value_name || ""}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                "No value available"
              )}
            </td>
          ))}
        </tr>
      )}

      {/* Add variant button row */}
      <tr>
        {variantsData.varient_list.map((variant, index) => (
          <td key={index}>
            <button
              onClick={() => handleAddVariantValue(variant.type_id)}
              disabled={isLoading}
              style={{
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              {isLoading ? 'Saving...' : 'Add Variant Value'}
            </button>
          </td>
        ))}
      </tr>

      {/* Displaying a single message row if no variants are available */}
      {variantsData.varient_list.length === 0 && (
        <tr>
          <td colSpan={variantsData.varient_list.length}>No product variants available</td>
        </tr>
      )}
    </tbody>
  </table>
)}


                </div>
            )}
        </div>
    );
};

export default VariantList;
