import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../src/utils/axiosConfig';
import './clientDetails.css';

const ClientDetails = () => {
  const { clientId } = useParams(); // Get the clientId from the URL
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // Track form visibility
  const [newUser, setNewUser] = useState({ name: '', email: '' }); // New user data

  useEffect(() => {
    const fetchClientDetail = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainClientDetail/?id=${clientId}`);
        if (response.data.estatus) {
          setClient(response.data.data.client_obj);
        } else {
          throw new Error('Client not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetail();
  }, [clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/addUser`,
        { clientId, ...newUser }
      );
      if (response.data.estatus) {
        // Update the user list with the new user
        setClient((prevClient) => ({
          ...prevClient,
          users: [...prevClient.users, response.data.data]
        }));
        setShowForm(false); // Hide the form after submission
      } else {
        throw new Error('Failed to add user');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="loading-message">Loading client details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="client-details-container">
      <div className="client-card">
        {client ? (
          <>
            {/* <img 
              src={client.logo} 
              alt={client.name} 
              className="client-logo" 
            /> */}
            <h3 className="client-name">{client.name}</h3>
            <p className="client-location">Location: {client.location}</p>
          </>
        ) : (
          <p className="no-client-message">No client found.</p>
        )}
      </div>

      <div className="user-details-section">
        <h3 className="user-details-heading">Users</h3>
        <button
          className="create-user-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Create User'}
        </button>

        {showForm && (
          <form className="create-user-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">User Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        )}

        <table className="user-details-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {client?.users && client.users.length > 0 ? (
              client.users.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="no-users-message">No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientDetails;
