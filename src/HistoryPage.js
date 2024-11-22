import React, { useState } from 'react';
import axiosInstance from './utils/axiosConfig';
import Swal from 'sweetalert2';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const HistoryPage = () => {
  const [apiResponse, setApiResponse] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle API calls
  const handleApiCall = async (apiUrl) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/${apiUrl}`);
      setApiResponse(response.data);
    } catch (error) {
      console.error(`Error fetching data from ${apiUrl}:`, error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while fetching data.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'swal-custom-container',
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-confirm',
          cancelButton: 'swal-custom-cancel',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page" style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>History Logs</h2>

      <div
        className="buttons-container"
        style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApiCall('obtainCategoryLog')}
          disabled={loading}
          style={{ borderRadius: '10px',width:'22%',padding:'10px',lineHeight:'20px' }}
        >
          Category Log
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApiCall('obtainCategoryVarientLog')}
          disabled={loading}
          style={{ borderRadius: '10px',width:'22%',padding:'10px',lineHeight:'20px' }}
        >
          Category Variant Log
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApiCall('obtainProductLog')}
          disabled={loading}
          style={{ borderRadius: '10px',width:'22%',padding:'10px',lineHeight:'20px' }}
        >
          Product Log
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleApiCall('obtainProductVarientLog')}
          disabled={loading}
          style={{ borderRadius: '10px',width:'22%',padding:'10px',lineHeight:'20px' }}
        >
          Product Variant Log
        </Button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      {apiResponse.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>User Name</strong></TableCell>
                <TableCell><strong>Category ID</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
                <TableCell><strong>Level</strong></TableCell>
                <TableCell><strong>Log Date</strong></TableCell>
                <TableCell><strong>Category Name</strong></TableCell>
                <TableCell><strong>Log Date (IST)</strong></TableCell>
                <TableCell><strong>Log Date (EST)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apiResponse.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.user_name}</TableCell>
                  <TableCell>{log.category_id}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.level}</TableCell>
                  <TableCell>{log.log_date}</TableCell>
                  <TableCell>{log.category_name}</TableCell>
                  <TableCell>{log.log_date_ist}</TableCell>
                  <TableCell>{log.log_date_est}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default HistoryPage;
