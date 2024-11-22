import React, { useState, useEffect } from "react";
import axiosInstance from "./utils/axiosConfig";
import "./ModalStyles.css";

const ApiResponseModal = ({ showResponseModal, setShowResponseModal, apiResponse, selectedFilepath }) => {
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const databaseOptions = apiResponse?.Database_options || [];
  const databaseList = apiResponse?.Database_list || {};
if (selectedFilepath) {
  localStorage.setItem('selectedFile', selectedFilepath);
}
let selectedFiles = localStorage.getItem('selectedFile');

  useEffect(() => {
    if (apiResponse?.extract_list) {
      const initialMapping = apiResponse.extract_list.map((item) => ({
        columnHeader: item,
        databaseOption: "",
        isDisabled: false,
        isMatched: false,
        isHighlighted: false,
      }));

      const updatedMapping = initialMapping.map((row) => {
        const matchingValue = databaseList[row.columnHeader];
        if (matchingValue) {
          return {
            ...row,
            databaseOption: matchingValue,
            isDisabled: true,
            isMatched: true,
            isHighlighted: true,
          };
        }
        return { ...row, isMatched: false, isHighlighted: false };
      });

      setMapping(updatedMapping);
    }
  }, [apiResponse]);

  const getFilteredOptions = (currentValue) => {
    const matchedValues = mapping
      .filter((row) => row.isMatched)
      .map((row) => row.databaseOption);
    return databaseOptions.filter(
      (option) => option === currentValue || !matchedValues.includes(option)
    );
  };

  const handleDropdownChange = (index, selectedValue) => {
    const updatedMapping = [...mapping];
    updatedMapping[index].databaseOption = selectedValue;
    updatedMapping[index].isDisabled = false;
    updatedMapping[index].isMatched = false;
    updatedMapping[index].isHighlighted = false;

    if (databaseList[updatedMapping[index].columnHeader] === selectedValue) {
      updatedMapping[index].isMatched = true;
      updatedMapping[index].isHighlighted = true;
    }

    setMapping(updatedMapping);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const fieldData = {};
    mapping.forEach((row) => {
      if (row.databaseOption) {
        fieldData[row.databaseOption] = row.columnHeader;
      }
    });

    const formData = new FormData();
    formData.append('file_path', selectedFiles);
    formData.append("field_data", JSON.stringify(fieldData));

    try {
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/saveXlData/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setShowResponseModal(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 >Mapping</h2>
              <button onClick={() => setShowResponseModal(false)} className='btn_close_map'>X</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <table>
                <thead>
                  <tr>
                    <th>Your Column Header</th>
                    <th>Map to Where</th>
                  </tr>
                </thead>
                <tbody>
                  {mapping.map((row, index) => (
                    <tr key={index}>
                      <td>{row.columnHeader}</td>
                      <td>
                        <select
                          value={row.databaseOption}
                          onChange={(e) =>
                            handleDropdownChange(index, e.target.value)
                          }
                          disabled={row.isDisabled}
                          className={`mapping-dropdown ${
                            row.isMatched ? "matched" : "not-matched"
                          } ${row.isHighlighted ? "highlighted" : ""}`}
                        >
                          <option value="">Select...</option>
                          {getFilteredOptions(row.databaseOption).map(
                            (option, idx) => (
                              <option key={idx} value={option}>
                                {option}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save Mapping"}
              </button>
              <button onClick={() => setShowResponseModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiResponseModal;
