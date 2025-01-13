import React, { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import Swal from "sweetalert2";
import './CreateUser.css';
const CreateUser = () => {
  const [formData, setFormData] = useState({
    user_name: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [users, setUsers] = useState([]); // State to store the list of users
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainUserBasedOnClient/`);
      setUsers(response.data.data.user_list || []); // Assuming the API returns an array of users
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  useEffect(() => {
    fetchUsers(); // Fetch users on initial load
  }, []);

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
    if (!formData.user_name || !formData.name || !formData.email || !formData.password) {
      setError("All fields are required.");
      return;
    }
    setLoading(true); // Start loading

    try {
      // Make API call to create user
      const response = await axiosInstance.post(`${process.env.REACT_APP_IP}/createUser/`, formData);      
      if (response.data.data.is_created === true) {
        Swal.fire({
          title: "Success",
          text: "User Created Successfully",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            container: "swal-custom-container",
            popup: "swal-custom-popup",
            title: "swal-custom-title",
            confirmButton: "swal-custom-confirm",
            cancelButton: "swal-custom-cancel",
          },
        });
        fetchUsers();
        setFormData({ user_name: "", name: "", email: "", password: "" });
        setShowForm(false); // Hide form after successful submission
      }
    } catch (error) {
      setError("Failed to create user. Please try again.");
      console.error("Error creating user:", error);
    }
    setLoading(false); // Stop loading
  };
  return (
    <div className="container">
      <div className="userheader">
        <button className="createUserButton" onClick={() => setShowForm(true)}>
          Create User
        </button>
      </div>
      {/* Modal Form for Create User */}
      {showForm && (
        <div className="modalOverlay">
          <div className="modalCard">
            <h2>Create Account</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="inputGroup">
                <label htmlFor="user_name">Username</label>
                <input
                  type="text"
                  id="user_name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className="input"
                  required
                  autoComplete="off"
                />
              </div>
              <div className="inputGroup">
                <label htmlFor="name">Name</label>
                <input  type="text"  id="name"  name="name"  value={formData.name}  onChange={handleInputChange}  className="input"  required  autoComplete="off"
                />
              </div>
              <div className="inputGroup">
                <label htmlFor="email">Email</label>
                <input  type="email"  id="email"  name="email"  value={formData.email}  onChange={handleInputChange}  className="input"  required  autoComplete="off"
                />
              </div>
              <div className="inputGroup">
                <label htmlFor="password">Password</label>
                <input  type="password"  id="password"  name="password"  value={formData.password}  onChange={handleInputChange}  className="input"  required  autoComplete="off"
                />
              </div>
              <div className="inputGroup">
                <label htmlFor="role">Role</label>
                <select  id="role"  name="role"  style={{width:'98%'}} value={formData.role}  onChange={handleInputChange}  className="input"  required
                >
                  <option value="">Select User</option>
                  <option value="admin">Admin</option>
                  <option value="client-user">User</option>
                </select>
              </div>
              <button type="submit" className="signbutton" disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>
            <button className="closeButton" onClick={() => setShowForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* User List Displayed in Card */}
      <div className="userListCard">
        <h2 style={{margin:'0px 0px 20px 0px'}}>Users Schema</h2>
        <div className="userList">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="userCard">
                <h3> {user.name}</h3>
                <p>Role: {user.role || "N/A"}</p>
                <p>Status: {user.is_active ? "Active" : "Inactive"}</p>
              </div>
            ))
          ) : (
            <div className="noUsers">No users available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CreateUser;