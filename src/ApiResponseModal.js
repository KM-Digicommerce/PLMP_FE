import React, { useState, useEffect } from "react";
import axiosInstance from "./utils/axiosConfig";
import "./ModalStyles.css";

const ApiResponseModal = ({
  showResponseModal,
  setShowResponseModal,
  apiResponse,
  selectedFilepath,
}) => {
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSource, setDraggedSource] = useState(null);

  const databaseOptions = apiResponse?.Database_options || [];
  const databaseList = apiResponse?.Database_list || {};

  if (selectedFilepath) {
    localStorage.setItem("selectedFile", selectedFilepath);
  }
  const selectedFiles = localStorage.getItem("selectedFile");

  useEffect(() => {
    if (apiResponse?.extract_list) {
      const initialMapping = apiResponse.extract_list.map((item) => ({
        columnHeader: item,
        databaseOption: databaseList[item] || "",
      }));
      setMapping(initialMapping);
    }
  }, [apiResponse]);

  const handleDragStart = (item, index, source) => {
    setDraggedItem(item);
    setDraggedIndex(index);
    setDraggedSource(source);
  };

  const handleDropDatabaseOption = () => {
    if (draggedSource === "mapToWhere") {
      const updatedMapping = mapping.map((row, index) => {
        if (index === draggedIndex) {
          return { ...row, databaseOption: "" };
        }
        return row;
      });
      setMapping(updatedMapping);
    }
    setDraggedItem(null);
    setDraggedSource(null);
  };

  const handleDropMapToWhere = (targetIndex) => {
    const updatedMapping = [...mapping];

    if (draggedSource === "databaseOptions") {
      // Assign dragged item from database options
      updatedMapping[targetIndex].databaseOption = draggedItem;
    } else if (draggedSource === "mapToWhere") {
      // Swap values within mapToWhere
      const temp = updatedMapping[targetIndex].databaseOption;
      updatedMapping[targetIndex].databaseOption = draggedItem;
      updatedMapping[draggedIndex].databaseOption = temp;
    }

    setMapping(updatedMapping);
    setDraggedItem(null);
    setDraggedSource(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const fieldData = {};
    mapping.forEach((row) => {
      if (row.databaseOption) {
        fieldData[row.columnHeader] = row.databaseOption;
      }
    });

    const formData = new FormData();
    formData.append("file_path", selectedFiles);
    formData.append("field_data", JSON.stringify(fieldData));

    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/saveXlData/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowResponseModal(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isHighlighted = (value) =>
    draggedItem && value && draggedItem === value;

  return (
    <>
      {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Mapping</h2>
              <button onClick={() => setShowResponseModal(false)} className="btn_close_map">
                X
              </button>
            </div>
            <div className="modal-body">
              {error && <div className="error-message">{error}</div>}
              <div className="modal-content-box">
                <div className="database-options">
                  <h3>Database Options</h3>
                  <div
                    className="options-list"
                    onDrop={handleDropDatabaseOption}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    {databaseOptions
                      .filter((option) => !mapping.some((row) => row.databaseOption === option))
                      .map((option, index) => (
                        <div
                          key={index}
                          className={`draggable-item ${isHighlighted(option) ? "highlighted" : ""}`}
                          draggable
                          onDragStart={() => handleDragStart(option, null, "databaseOptions")}
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                </div>

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
                        <td
                          onDrop={() => handleDropMapToWhere(index)}
                          onDragOver={(e) => e.preventDefault()}
                          className="map-to-where-cell"
                        >
                          <div
                            className={`draggable-item ${isHighlighted(row.databaseOption) ? "highlighted" : ""}`}
                            draggable={!!row.databaseOption}
                            onDragStart={() =>
                              row.databaseOption &&
                              handleDragStart(row.databaseOption, index, "mapToWhere")
                            }
                          >
                            {row.databaseOption || "Drop here"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
