import React, { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';
import './VariantList.css';
import axiosInstance from '../../../src/utils/axiosConfig';

const VariantList = ({ categories }) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [selectedLevel2Id, setSelectedLevel2Id] = useState('');
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
    // const [data, setData] = useState([]);
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
    const [selectedCategoryLevelForVariant, setSelectedCategoryLevelForVariant] = useState('');

    const filteredCategories = categories.category_list.filter(category =>
        category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
    );

    const levelOneCategory = categories.category_list.find(level1 => level1._id === selectedCategoryId);

    const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';
    const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)) : categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)
    );
    const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;
    const filteredCategoriesLevel3 = levelTwoCategory
        ? levelTwoCategory.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery)) : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 =>
            level3.name.toLowerCase().includes(safeSearchQuery)
        );

    const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;
    const filteredCategoriesLevel4 = levelThreeCategory ? levelThreeCategory.level_three_category_list.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery)) : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

    const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;
    const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery)) : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));
    const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;
    const filteredCategoriesLevel6 = levelFiveCategory
        ? levelFiveCategory.level_five_category_list.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery)) : categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));


    const handleSearchChange = (level, value) => {
        setSearchQueries(prev => ({ ...prev, [level]: value }));
    };
    const handleCategorySelect = async (id) => {
        setSelectedCategoryId(id);
        setSelectedLevel2Id('');
        setSelectedLevel3Id('');
        setSelectedlevel4('');
        setSelectedlevel5('');
        setSelectedlevel6('');
        setIsCategoryDropdownOpen(false);
    };
    const [lastLevelCategoryIds, setLastLevelCategoryIds] = useState([]);
    const [isAddProductVisible, setIsAddProductVisible] = useState(false);
    useEffect(() => {
        const fetchCategoryData = async () => {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainCategoryAndSections/`);
            setLastLevelCategoryIds(res.data.data.last_level_category);
        };

        fetchCategoryData();
    }, []);
    const handleCategorySelectForVariants = async (id, level) => {
        const selectedIdString = String(id);
        const isIdInLastLevel = lastLevelCategoryIds.some(category => String(category.id) === selectedIdString);
        if (isIdInLastLevel) {
            setIsAddProductVisible(true);
        }
        else {
            setIsAddProductVisible(false);
        }
        setSelectedCategoryForVariant(id);
        setSelectedCategoryLevelForVariant(level);
        try {
            const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
            setVariantsData(res.data.data);
        } catch (err) {
            console.log('ERROR', err);
        }
    };
    useEffect(() => {
        handleCategorySelectForVariants();
    }, []);
    const handleLevel2Select = (id) => {
        const selectedValue = id;
        if (selectedValue !== '') {
            let level1Category;
            categories.category_list.some(level1 => {
                const foundLevel2 = level1.level_one_category_list.some(level2 => level2._id === selectedValue);
                if (foundLevel2) {
                    level1Category = level1;
                    return true;
                }
                return false;
            });

            if (!level1Category) {
                console.error('Level 1 category not found for Level 2 category with ID:', selectedValue);
                return;
            }
            setSelectedCategoryId(level1Category._id);
            setSelectedLevel2Id(selectedValue);
            setSelectedLevel3Id('');
            setSelectedlevel4('');
            setSelectedlevel5('');
            setSelectedlevel6('');
            setIsLevel2DropdownOpen(false);
        }
        else {
            setSelectedLevel2Id('');
        }
    };

    const handleLevel3Select = (id) => {
        const selectedValue = id;
        console.log(selectedValue, 'selectedValue');
        if (selectedValue !== '') {
            let level1Category, level2Category;
            categories.category_list.some(level1 => {
                const foundLevel2 = level1.level_one_category_list.find(level2 =>
                    level2.level_two_category_list.some(level3 => level3._id === selectedValue)
                );
                if (foundLevel2) {
                    level1Category = level1;
                    level2Category = foundLevel2;
                    return true;
                }
                return false;
            });
            if (!level2Category || !level1Category) {
                console.error('Parent categories not found for selected Level 3 category with ID:', selectedValue);
                return;
            }
            setSelectedCategoryId(level1Category._id);
            setSelectedLevel2Id(level2Category._id);
            setSelectedLevel3Id(selectedValue);
            setSelectedlevel4('');
            setSelectedlevel5('');
            setSelectedlevel6('');
            setIsLevel3DropdownOpen(false);
        }
        else {
            setSelectedLevel3Id('');
        }
    };

    const handleLevelSelect = (level, id) => {
        const selectedValue = id || '';
        if (selectedValue !== '') {
            switch (level) {
                case 4:
                    const level3Category = categories.category_list
                        .flatMap(level1 => level1.level_one_category_list)
                        .flatMap(level2 => level2.level_two_category_list)
                        .find(level3 => level3._id === selectedValue);

                    if (!level3Category) {
                        console.error('Level 3 category not found for ID:', level3Category._id);
                        return;
                    }
                    const level2Category = categories.category_list.flatMap(level1 => level1.level_one_category_list).find(level2 => level2.level_two_category_list.some(level3 => level3._id === selectedValue));

                    if (!level2Category) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2Category._id);
                        return;
                    }
                    const level1Category = categories.category_list.find(level1 =>level1.level_one_category_list.some(level2 => level2._id));

                    if (!level1Category) {
                        console.error('Level 1 category not found for Level 2 category with ID:', level1Category._id);
                        return;
                    }

                    setSelectedCategoryId(level1Category._id);
                    setSelectedLevel2Id(level2Category._id);
                    setSelectedLevel3Id(level3Category._id);
                    setSelectedlevel4(selectedValue);
                    break;
                case 5:
                    const level4Category = categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).find(level4 => level4._id);

                    if (!level4Category) {
                        console.error('Level 4 category not found for ID:', level4Category._id);
                        return;
                    }
                    const level3CategoryForLevel5 = categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).find(level3 => level3._id);

                    if (!level3CategoryForLevel5) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel5._id);
                        return;
                    }
                    const level2CategoryForLevel5 = categories.category_list.flatMap(level1 => level1.level_one_category_list).find(level2 => level2.level_two_category_list.some(level3 => level3._id));

                    if (!level2CategoryForLevel5) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel5._id);
                        return;
                    }
                    const level1CategoryForLevel5 = categories.category_list.find(level1 => level1.level_one_category_list.some(level2 => level2._id));

                    if (!level1CategoryForLevel5) {
                        console.error('Level 1 category not found for Level 2 category with ID:', level1CategoryForLevel5._id);
                        return;
                    }

                    setSelectedCategoryId(level1CategoryForLevel5._id);
                    setSelectedLevel2Id(level2CategoryForLevel5._id);
                    setSelectedLevel3Id(level3CategoryForLevel5._id);
                    setSelectedlevel4(level4Category._id);
                    setSelectedlevel5(selectedValue);
                    break;
                case 6:
                    const level5Category = categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).find(level5 => level5._id);

                    if (!level5Category) {
                        console.error('Level 5 category not found for ID:', level5Category._id);
                        return;
                    }

                    const level4CategoryForLevel6 = categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).find(level4 => level4._id);

                    if (!level4CategoryForLevel6) {
                        console.error('Level 4 category not found for ID:', level4CategoryForLevel6._id);
                        return;
                    }
                    const level3CategoryForLevel6 = categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).find(level3 => level3._id);

                    if (!level3CategoryForLevel6) {
                        console.error('Level 3 category not found for ID:', level3CategoryForLevel6._id);
                        return;
                    }
                    const level2CategoryForLevel6 = categories.category_list.flatMap(level1 => level1.level_one_category_list).find(level2 => level2.level_two_category_list.some(level3 => level3._id));

                    if (!level2CategoryForLevel6) {
                        console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel6._id);
                        return;
                    }
                    const level1CategoryForLevel6 = categories.category_list.find(level1 =>
                        level1.level_one_category_list.some(level2 => level2._id)
                    );

                    if (!level1CategoryForLevel6) {
                        console.error('Level 1 category not found for Level 2 category with ID:', level1CategoryForLevel6._id);
                        return;
                    }

                    setSelectedCategoryId(level1CategoryForLevel6._id);
                    setSelectedLevel2Id(level2CategoryForLevel6._id);
                    setSelectedLevel3Id(level3CategoryForLevel6._id);
                    setSelectedlevel4(level4CategoryForLevel6._id);
                    setSelectedlevel5(level5Category._id);
                    setSelectedlevel6(selectedValue);
                    break;
                default:
                    break;
            }
        }
        else {
            switch (level) {
                case 4:
                    setSelectedlevel4('');
                    break;
                case 5:
                    setSelectedlevel5('');
                    break;
                case 6:
                    setSelectedlevel6('');
                    break;
                default:
                    break;
            }
        }
    };
    // const [isLoading, setIsLoading] = useState(false);
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
    console.log(level6Categories,'level6Categories');
    
    const handleAddVariant = useCallback(async (category_varient_id, selectedCategoryForVariant, selectedCategoryLevelForVariant) => {
        // setIsLoading(true);
        setError(null);
        Swal.fire({title: 'Add New Variant',input: 'text',showCancelButton: true,confirmButtonText: 'Save',cancelButtonText: 'Cancel',customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-variant', cancelButton: 'swal-custom-cancel',
            },
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write something!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                   await axiosInstance.post(`${process.env.REACT_APP_IP}/createVarientOption/`, {
                        name: result.value,
                        category_varient_id: category_varient_id,
                        category_id: selectedCategoryForVariant,
                        category_name: selectedCategoryLevelForVariant
                    });
                    Swal.fire({ title: 'Success', text: 'Variant added successfully!', icon: 'success', customClass: {  container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel',  },});
                    handleCategorySelectForVariants(selectedCategoryForVariant, selectedCategoryLevelForVariant);
                    
                } catch (err) {
                    console.error('Error adding variant:', err);
                    setError('Failed to add variant. Please try again.');
                } finally {
                    // setIsLoading(false);
                }
            }
        });
    }, []); // Add dependencies if required

    const handleAddVariantValue = async (typeId) => {
        // Show Swal popup to get the new type_value_name
        const { value: typeValueName } = await Swal.fire({title: 'Add Variant Value',input: 'text',inputPlaceholder: 'Enter variant value name',showCancelButton: true,confirmButtonText: 'Save',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter a value!';
                }
            },
            customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-variant', cancelButton: 'swal-custom-cancel'
            }
        });

        if (typeValueName) {
            try {
                // setIsLoading(true);
                setError(null);
                // Make API call to add the new variant value
                 await axiosInstance.post(
                    `${process.env.REACT_APP_IP}/createValueForVarientName/`,
                    {
                        name: typeValueName,
                        option_id: typeId,
                    }
                );
                Swal.fire({ title: 'Success', text: 'Variant value added successfully!', icon: 'success', customClass: {  container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm-value', cancelButton: 'swal-custom-cancel',  },});
                handleCategorySelectForVariants(selectedCategoryForVariant,selectedCategoryLevelForVariant); 

            } catch (err) {
                console.error('Error adding variant value:', err);
                setError('Failed to add variant value. Please try again.');
            } finally {
                // setIsLoading(false);
            }
        }
    };
    const variantList = variantsData && variantsData.varient_list ? variantsData.varient_list : [];
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
                                        <div className="dropdown-option" key={level1._id} onClick={() => { handleCategorySelect(level1._id); handleCategorySelectForVariants(level1._id, 'level-1'); }}>
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
                                        <div className="dropdown-option" key={level2._id} onClick={() => { handleLevel2Select(level2._id); handleCategorySelectForVariants(level2._id, 'level-2'); }}>
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
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level31'); }}>
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
                                        <div className="dropdown-option" key={level4._id} onClick={() => { handleLevelSelect(4, level4._id); handleCategorySelectForVariants(level4._id, 'level-4'); }}>
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
                                        <div className="dropdown-option" key={level5._id} onClick={() => { handleLevelSelect(5, level5._id); handleCategorySelectForVariants(level5._id, 'level-5'); }}>
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
                                        <div className="dropdown-option" key={level6._id} onClick={() => { handleLevelSelect(6, level6._id); handleCategorySelectForVariants(level6._id, 'level-6'); }}>
                                            <span>{level6.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {isAddProductVisible && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAddVariant(variantsData.category_varient_id, selectedCategoryForVariant, selectedCategoryLevelForVariant);
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

                                                        </td>
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
