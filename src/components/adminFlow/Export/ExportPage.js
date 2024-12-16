import React, { useState, useEffect } from 'react';
import './ExportPage.css';
import axiosInstance from '../../../utils/axiosConfig';
import Swal from 'sweetalert2';
// import CircularProgress from '@mui/material/CircularProgress';
// import Button from '@mui/material/Button';
import ChevronDownIcon from '@mui/icons-material/ExpandMore';


const ExportPage = (categories) => {
    const [clearBtn, setShowclearBtn] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedLevel2Id, setselectedLevel2Id] = useState('');
  const [selectedLevel3Id, setSelectedLevel3Id] = useState('');
  const [selectedlevel4, setSelectedlevel4] = useState('');
  const [selectedlevel5, setSelectedlevel5] = useState('');
  const [selectedlevel6, setSelectedlevel6] = useState('');
  const [isExportAllVisible, setIsExportAllVisible] = useState(true); 

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isLevel2DropdownOpen, setIsLevel2DropdownOpen] = useState(false);
  const [isLevel3DropdownOpen, setIsLevel3DropdownOpen] = useState(false);
  const [islevel4DropdownOpen, setIslevel4DropdownOpen] = useState(false);
  const [islevel5DropdownOpen, setIslevel5DropdownOpen] = useState(false);
  const [islevel6DropdownOpen, setIslevel6DropdownOpen] = useState(false);
  const [searchQueries, setSearchQueries] = useState({
      level1: '',
      level2: '',
      level3: '',
      level4: '',
      level5: '',
      level6: '',
  });
  const [selectedCategoryForVariant, setSelectedCategoryForVariant] = useState('');

  const filteredCategories = categories.categories.category_list.filter(category =>
      category.name.toLowerCase().includes(searchQueries.level1.toLowerCase())
  );

  const levelOneCategory = categories.categories.category_list.find(level1 => level1._id === selectedCategoryId);

  const safeSearchQuery = typeof searchQueries === 'string' ? searchQueries.toLowerCase() : '';
  const filteredCategoriesLevel2 = levelOneCategory ? levelOneCategory.level_one_category_list.filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).filter(level2 => level2.name.toLowerCase().includes(safeSearchQuery)
  );

  const levelTwoCategory = levelOneCategory ? levelOneCategory.level_one_category_list.find(level2 => level2._id === selectedLevel2Id) : null;

  const filteredCategoriesLevel3 = levelTwoCategory
      ? levelTwoCategory.level_two_category_list.filter(level3 => level3.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).filter(level3 =>
          level3.name.toLowerCase().includes(safeSearchQuery)
      );

  const levelThreeCategory = levelTwoCategory ? levelTwoCategory.level_two_category_list.find(level3 => level3._id === selectedLevel3Id) : null;

  const filteredCategoriesLevel4 = levelThreeCategory ? levelThreeCategory.level_three_category_list.filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).filter(level4 => level4.name.toLowerCase().includes(safeSearchQuery));

  const levelFourCategory = levelThreeCategory ? levelThreeCategory.level_three_category_list.find(level4 => level4._id === selectedlevel4) : null;

  const filteredCategoriesLevel5 = levelFourCategory ? levelFourCategory.level_four_category_list.filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).filter(level5 => level5.name.toLowerCase().includes(safeSearchQuery));

  const levelFiveCategory = levelFourCategory ? levelFourCategory.level_four_category_list.find(level5 => level5._id === selectedlevel5) : null;

  const filteredCategoriesLevel6 = levelFiveCategory
      ? levelFiveCategory.level_five_category_list.filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery)) : categories.categories.category_list.flatMap(level1 => level1.level_one_category_list).flatMap(level2 => level2.level_two_category_list).flatMap(level3 => level3.level_three_category_list).flatMap(level4 => level4.level_four_category_list).flatMap(level5 => level5.level_five_category_list).filter(level6 => level6.name.toLowerCase().includes(safeSearchQuery));

  const handleSearchChange = (level, value) => {
      setSearchQueries(prev => ({ ...prev, [level]: value }));
  };
  const handleLevelClear = (e) => {
      setSelectedCategoryId(e);
      setselectedLevel2Id(e);
      setSelectedLevel3Id(e);
      setSelectedlevel4(e);
      setSelectedlevel5(e);
      setSelectedlevel6(e);
      setShowclearBtn(false);
      setIsExportAllVisible(true);
      setIsCategoryDropdownOpen(false);
      setIsLevel2DropdownOpen(false);
      setIsLevel3DropdownOpen(false);
      setIslevel4DropdownOpen(false);
      setIslevel5DropdownOpen(false);
      setIslevel6DropdownOpen(false);
  }
  const handleCategorySelect = async (id) => {
      setSelectedCategoryId(id);
      try {
          const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
          console.log('API Response: here', res.data.data);
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

  const handleCategorySelectForVariants = async (id, category_level) => {
      console.log(id, 'ID');
      if (id && category_level) {
          setShowclearBtn(true);
          setIsExportAllVisible(false);
          setSelectedCategoryForVariant(id);
      }
      try {
          const res = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainVarientForCategory/?id=${id}`);
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
          categories.categories.category_list.some(level1 => {
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
          setselectedLevel2Id(selectedValue);
          setSelectedLevel3Id('');
          setSelectedlevel4('');
          setSelectedlevel5('');
          setSelectedlevel6('');
          setIsLevel2DropdownOpen(false);
      }
      else {
          setselectedLevel2Id('');
      }
  };

  const handleLevel3Select = (id) => {
      const selectedValue = id;
      if (selectedValue !== '') {
          let level1Category, level2Category;
          categories.categories.category_list.some(level1 => {
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
          setselectedLevel2Id(level2Category._id);
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
      const selectedValue = id;
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
                  const level2Category = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .find(level2 => level2.level_two_category_list.some(level3 => level3._id === selectedValue));

                  if (!level2Category) {
                      console.error('Level 2 category not found for Level 3 category with ID:', level2Category._id);
                      return;
                  }
                  const level1Category = categories.category_list.find(level1 =>
                      level1.level_one_category_list.some(level2 => level2._id)
                  );

                  if (!level1Category) {
                      console.error('Level 1 category not found for Level 2 category with ID:', level1Category._id);
                      return;
                  }

                  setSelectedCategoryId(level1Category._id);
                  setselectedLevel2Id(level2Category._id);
                  setSelectedLevel3Id(level3Category._id);
                  setSelectedlevel4(selectedValue);
                  break;
              case 5:
                  const level4Category = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .flatMap(level2 => level2.level_two_category_list)
                      .flatMap(level3 => level3.level_three_category_list)
                      .find(level4 => level4._id);

                  if (!level4Category) {
                      console.error('Level 4 category not found for ID:', level4Category._id);
                      return;
                  }
                  const level3CategoryForLevel5 = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .flatMap(level2 => level2.level_two_category_list)
                      .find(level3 => level3._id);

                  if (!level3CategoryForLevel5) {
                      console.error('Level 3 category not found for ID:', level3CategoryForLevel5._id);
                      return;
                  }
                  const level2CategoryForLevel5 = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

                  if (!level2CategoryForLevel5) {
                      console.error('Level 2 category not found for Level 3 category with ID:', level2CategoryForLevel5._id);
                      return;
                  }
                  const level1CategoryForLevel5 = categories.category_list.find(level1 =>
                      level1.level_one_category_list.some(level2 => level2._id)
                  );

                  if (!level1CategoryForLevel5) {
                      console.error('Level 1 category not found for Level 2 category with ID:', level1CategoryForLevel5._id);
                      return;
                  }

                  setSelectedCategoryId(level1CategoryForLevel5._id);
                  setselectedLevel2Id(level2CategoryForLevel5._id);
                  setSelectedLevel3Id(level3CategoryForLevel5._id);
                  setSelectedlevel4(level4Category._id);
                  setSelectedlevel5(selectedValue);
                  break;
              case 6:
                  const level5Category = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .flatMap(level2 => level2.level_two_category_list)
                      .flatMap(level3 => level3.level_three_category_list)
                      .flatMap(level4 => level4.level_four_category_list)
                      .find(level5 => level5._id);

                  if (!level5Category) {
                      console.error('Level 5 category not found for ID:', level5Category._id);
                      return;
                  }

                  const level4CategoryForLevel6 = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .flatMap(level2 => level2.level_two_category_list)
                      .flatMap(level3 => level3.level_three_category_list)
                      .find(level4 => level4._id);

                  if (!level4CategoryForLevel6) {
                      console.error('Level 4 category not found for ID:', level4CategoryForLevel6._id);
                      return;
                  }
                  const level3CategoryForLevel6 = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .flatMap(level2 => level2.level_two_category_list)
                      .find(level3 => level3._id);

                  if (!level3CategoryForLevel6) {
                      console.error('Level 3 category not found for ID:', level3CategoryForLevel6._id);
                      return;
                  }
                  const level2CategoryForLevel6 = categories.category_list
                      .flatMap(level1 => level1.level_one_category_list)
                      .find(level2 => level2.level_two_category_list.some(level3 => level3._id));

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
                  setselectedLevel2Id(level2CategoryForLevel6._id);
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
  if (!level6Categories) {
      console.log(level6Categories);
  }
  const [loading, setLoading] = useState(false);




  const handleExport = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/exportAll/`, {
        responseType: 'blob',
        params: {
            category_id: selectedCategoryForVariant
        }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      Swal.fire({ title: 'Success!', text: 'File exported successfully!', icon: 'success', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel'
        }
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Swal.fire({ title: 'Export Failed', text: 'An error occurred while exporting the data.', icon: 'error', confirmButtonText: 'OK', customClass: { container: 'swal-custom-container', popup: 'swal-custom-popup', title: 'swal-custom-title', confirmButton: 'swal-custom-confirm', cancelButton: 'swal-custom-cancel',
        },
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
         <div className='CategoryTable-header'>
                <h2 className='header_cls_prod'>Export Schema</h2>
            </div>
            <div className='CategoryContainer'>
            {clearBtn && (
      <button className='clear_cat_btn' onClick={() => handleLevelClear('')} >Clear all</button>
      )}
                <div className='DropdownsContainer'>
                    {/* Level 1 Dropdown */}
                    <div className='DropdownColumn'>
                        <label htmlFor="categorySelect">Level 1:</label>
                        <div className="custom-dropdown" onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                            <div className="selected-category">
                                {selectedCategoryId ? categories.categories.category_list.find(level1 => level1._id === selectedCategoryId)?.name : 'Select Category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {isCategoryDropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level1}
                                        onChange={(e) => handleSearchChange('level1', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
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
                                {selectedLevel2Id ? levelOneCategory?.level_one_category_list.find(level2 => level2._id === selectedLevel2Id)?.name : 'Select category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
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
                                {selectedLevel3Id ? levelTwoCategory?.level_two_category_list.find(level3 => level3._id === selectedLevel3Id)?.name : 'Select category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
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
                                        <div className="dropdown-option" key={level3._id} onClick={() => { handleLevel3Select(level3._id); handleCategorySelectForVariants(level3._id, 'level-3'); }}>
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
                                {selectedlevel4 ? levelThreeCategory?.level_three_category_list.find(level4 => level4._id === selectedlevel4)?.name : 'Select category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel4DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level4}
                                        onChange={(e) => handleSearchChange('level4', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
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
                                {selectedlevel5 ? levelFourCategory?.level_four_category_list.find(level5 => level5._id === selectedlevel5)?.name : 'Select category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel5DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level5}
                                        onChange={(e) => handleSearchChange('level5', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
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
                                {selectedlevel6 ? levelFiveCategory?.level_five_category_list.find(level6 => level6._id === selectedlevel6)?.name : 'Select category'}
                                <span className="dropdown-icons">

                                    <ChevronDownIcon style={{ fontSize: 25, float: "right" }} />
                                </span>
                            </div>
                            {islevel6DropdownOpen && (
                                <div className="dropdown-options">
                                    <input
                                        type="text"
                                        placeholder="Search category..."
                                        value={searchQueries.level6}
                                        onChange={(e) => handleSearchChange('level6', e.target.value)}
                                        className="dropdown-search-input"
                                        onClick={(e) => e.stopPropagation()}
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
            {isExportAllVisible &&(
            <button onClick={() =>handleExport() } className="Export-button">Export All</button>
            )}
            {!isExportAllVisible &&(
            <button onClick={() =>handleExport() } className="Export-button">Export</button>
            )}
    </div>
  );
};

export default ExportPage;
