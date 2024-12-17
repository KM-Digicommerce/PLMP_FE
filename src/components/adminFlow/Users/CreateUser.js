import React, { useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import Swal from "sweetalert2";
const CreateUser = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    // Check if all fields are filled
    if (!formData.user_name || !formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Make API call to create user
      const response =  await axiosInstance.post(`${process.env.REACT_APP_IP}/createUser/`, formData);
      console.log("User Created:", response.data);
      if (response.data.data.is_created === true) {
          Swal.fire({ title: "Success", text: "User Created Successfully", icon: "Success", confirmButtonText: "OK", customClass: {   container: 'swal-custom-container',   popup: 'swal-custom-popup',   title: 'swal-custom-title',   confirmButton: 'swal-custom-confirm',   cancelButton: 'swal-custom-cancel', },
                  });
      }
      setFormData({ user_name: "", name: "", email: "", password: "" });
    } catch (error) {
      setError("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    }

    setLoading(false); // Stop loading
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label htmlFor="user_name">Username</label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              style={styles.input}
              required
              autoComplete="off"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
              autoComplete="off"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              required
              autoComplete="off"
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              style={styles.input}
              required
              autoComplete="off"
            />
          </div>
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f7f7",
  },
  card: {
    backgroundColor: "white",
    padding: "0px 40px 40px 40px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "93%",
    padding: "10px",
    margin: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "15px",
  },
};

export default CreateUser;
