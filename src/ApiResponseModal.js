import React, { useState, useEffect } from "react";
import axiosInstance from "./utils/axiosConfig";
import "./ModalStyles.css";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ApiResponseModal = ({
  showResponseModal,
  setShowResponseModal,
  apiResponse,
  selectedFilepath,
}) => {
  const [mapping, setMapping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [draggedSource, setDraggedSource] = useState(null);
  const [allMapped, setAllMapped] = useState(false);
  const [toDashboard, setToDashboard] = useState(false);
  const navigate = useNavigate();

  const databaseOptions = apiResponse?.Database_options || [];
  const databaseList = apiResponse?.Database_list || [];

  useEffect(() => {
    if (apiResponse?.extract_list && mapping.length === 0) {
      const initialMapping = apiResponse.extract_list.map((item) => ({
        columnHeader: item,
        databaseOption: databaseList[item] || "",
      }));
      setMapping(initialMapping);
    }
    setLoading(false);
  }, [apiResponse, databaseList, mapping.length]);

  useEffect(() => {
    const allMappedValues = mapping.every((row) => row.databaseOption !== "");
    if (allMappedValues !== allMapped) {
      setAllMapped(allMappedValues);
    }
  }, [mapping, allMapped]);

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
    if (draggedSource && draggedItem) {
      const updatedMapping = [...mapping];

      if (draggedSource === "databaseOptions") {
        updatedMapping[targetIndex].databaseOption = draggedItem;
      } else if (draggedSource === "mapToWhere") {
        const temp = updatedMapping[targetIndex].databaseOption;
        updatedMapping[targetIndex].databaseOption = draggedItem;
        updatedMapping[draggedIndex].databaseOption = temp;
      }

      setMapping(updatedMapping);
      setDraggedItem(null);
      setDraggedSource(null);
    }
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
    formData.append("file_path", selectedFilepath);
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
      if (response.data) {
        Swal.fire({
          title: "Success!",
          text: "File uploaded successfully!",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            container: "swal-custom-container",
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel",
          },
        }).then(() => {
          setToDashboard(true);
          handleClose();
        });
      }
      setShowResponseModal(false);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to save data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowResponseModal(false);
    if (toDashboard) {
      navigate("/Admin");
      window.location.reload();
    }
  };

  const isMatched = (value) => draggedItem && value && draggedItem === value;
  const isUnmatched = (value) =>
    draggedItem && value && draggedItem !== value && value !== "";

  return (
    <>
      {showResponseModal && (
        <div className="modal-overlay">
          <div className="modal-content-import">
            <div className="modal-header">
              <h2>Field Mapping</h2>
              <button
                onClick={() => setShowResponseModal(false)}
                className="btn-close"
              >
                X
              </button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loading-spinner-container">
                  <CircularProgress size={50} />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="modal-content-box">
                  <div className="table-container">
                    <table className="styled-table">
                      <thead>
                        <tr>
                          <th>Your Column Header</th>
                          <th>Map to Where</th>
                          <th>Unmatched Values</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mapping.map((row, index) => (
                          <tr key={index}>
                            <td>{row.columnHeader}</td>
                            <td
                              onDrop={() => handleDropMapToWhere(index)}
                              onDragOver={(e) => e.preventDefault()}
                              className={`map-to-where-cell ${
                                allMapped || isMatched(row.databaseOption)
                                  ? ""
                                  : "highlight"
                              } ${
                                isMatched(row.databaseOption) ? "matched" : ""
                              } ${
                                isUnmatched(row.databaseOption)
                                  ? "unmatched"
                                  : ""
                              }`}
                            >
                              <div
                                className={`draggable-item ${
                                  isMatched(row.databaseOption) ? "matched" : ""
                                } ${
                                  isUnmatched(row.databaseOption)
                                    ? "unmatched"
                                    : ""
                                }`}
                                draggable={!!row.databaseOption}
                                onDragStart={() =>
                                  row.databaseOption &&
                                  handleDragStart(
                                    row.databaseOption,
                                    index,
                                    "mapToWhere"
                                  )
                                }
                              >
                                {row.databaseOption || "Drop here"}
                              </div>
                            </td>
                            {index === 0 ? (
                              <td rowSpan={mapping.length}>
                                <div
                                  className="options-list"
                                  onDrop={handleDropDatabaseOption}
                                  onDragOver={(e) => e.preventDefault()}
                                >
                                  {databaseOptions
                                    .filter(
                                      (option) =>
                                        !mapping.some(
                                          (row) =>
                                            row.databaseOption === option
                                        )
                                    )
                                    .map((option, i) => (
                                      <div
                                        key={i}
                                        className={`draggable-item ${
                                          isMatched(option) ? "matched" : ""
                                        } ${
                                          isUnmatched(option) ? "unmatched" : ""
                                        }`}
                                        draggable
                                        onDragStart={() =>
                                          handleDragStart(
                                            option,
                                            null,
                                            "databaseOptions"
                                          )
                                        }
                                      >
                                        {option}
                                      </div>
                                    ))}
                                </div>
                              </td>
                            ) : null}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button
                className="btn-submit"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Mapping"}
              </button>
              <button
                className="btn-close-down"
                onClick={() => handleClose(true)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApiResponseModal;
