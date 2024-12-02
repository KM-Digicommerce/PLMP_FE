import React, { useState, useEffect } from 'react';
import './Clients.css';
import axiosInstance from '../../../../src/utils/axiosConfig';
import Fab from '@mui/material/Fab'; 
import AddIcon from '@mui/icons-material/Add'; 
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; // Import useNavigate for programmatic navigation

const Client = () => {
  const [Clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); 
  const [newClient, setNewClient] = useState({ name: '', logo: '', location: '' }); 
  const navigate = useNavigate(); // Initialize useNavigate
  
  const fetchClients = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainClient/`);
      if (!response.data.estatus) {
        throw new Error(`Error: ${response.statusText}`);
      }
      setClients(response.data.data.client_list || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(); // Fetch clients initially
  }, []);

  // Handle form submission and API call
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const newClientData = {
      name: newClient.name,
      logo: newClient.logo,
      location: newClient.location,
    };

    try {
      // API call to create a new client
      const response = await axiosInstance.post(
        `${process.env.REACT_APP_IP}/createClient/`,  // Adjust the URL as needed for your API
        newClientData
      );

      if (response.data.estatus) {
        // If the API call is successful, close the form dialog
        setOpen(false);
        
        // Show success message via alert
        alert('Client added successfully!');

        // Refresh the client list by re-fetching the data
        fetchClients();
      } else {
        throw new Error('Error adding client');
      }
    } catch (err) {
      setError(err.message); // Set error if API call fails
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient({ ...newClient, [name]: value });
  };

  const handleClientClick = (clientId) => {
    // Navigate to the ClientDetail component with the clientId
    navigate(`/superadmin/clientDetail/${clientId}`);
  };

  return (
    <div className="client-container">
      <h2 className="client-heading">Clients</h2>
      {loading ? (
        <p>Loading clients...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : Clients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <div className="client-list">
          {Clients.map((client) => (
            <div
              key={client.id}
              className="client-item"
              onClick={() => handleClientClick(client.id)} // Add onClick to each client card
            >
              <div className="client-image-container">
                <img
                  src={client.logo || 'https://via.placeholder.com/150'}
                  alt={client.name}
                  className="client-image"
                />
              </div>
              <h3>{client.name}</h3>
              <p>Location: {client.location}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add client button */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: '20px', right: '20px' }} // Positioned at bottom-right corner
        onClick={() => setOpen(true)} // Open the form on click
      >
        <AddIcon />
      </Fab>

      {/* Form Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <form className="client-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <TextField
                label="Client Name"
                variant="outlined"
                fullWidth
                name="name"
                value={newClient.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <TextField
                label="Logo URL"
                variant="outlined"
                fullWidth
                name="logo"
                value={newClient.logo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <TextField
                label="Location"
                variant="outlined"
                fullWidth
                name="location"
                value={newClient.location}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            color="primary"
            type="submit"
          >
            Add Client
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Client;
