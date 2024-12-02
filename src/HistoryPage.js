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
  const [activeButton, setActiveButton] = useState('');

  // Function to handle API calls
  const handleApiCall = async (apiUrl, buttonKey) => {
    setLoading(true);
    setActiveButton(buttonKey);
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/${apiUrl}`);
      setApiResponse(response.data.data.result); 
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

  const renderHeaders = () => {
    if (activeButton === 'productLog' || activeButton === 'productVariantLog') {
      return (
        <>
          <TableCell><strong>User Name</strong></TableCell>
          <TableCell><strong>Product Name</strong></TableCell>
          <TableCell><strong>Action</strong></TableCell>
          <TableCell><strong>Log Date</strong></TableCell>
        </>
      );
    } else if (activeButton === 'priceLog') {
      return (
        <>
          <TableCell><strong>Price Name</strong></TableCell>
          <TableCell><strong>User Name</strong></TableCell>
          <TableCell><strong>Product Name</strong></TableCell>
          <TableCell><strong>Action</strong></TableCell>
          <TableCell><strong>Log Date</strong></TableCell>
        </>
      );
    } else {
      return (
        <>
          <TableCell><strong>User Name</strong></TableCell>
          <TableCell><strong>Category ID</strong></TableCell>
          <TableCell><strong>Action</strong></TableCell>
          <TableCell><strong>Level</strong></TableCell>
          <TableCell><strong>Category Name</strong></TableCell>
          <TableCell><strong>Log Date</strong></TableCell>
        </>
      );
    }
  };

  const renderRows = () => {
    return apiResponse.map((log, index) => (
      <TableRow key={index}>
        {activeButton === 'priceLog' ? (
          <>
            <TableCell>{log['price name']}</TableCell>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.product_name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
        ) : activeButton === 'productLog' || activeButton === 'productVariantLog' ? (
          <>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.product_name}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
        ) : (
          <>
            <TableCell>{log.user_name}</TableCell>
            <TableCell>{log.category_id}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.level}</TableCell>
            <TableCell>{log.category_name}</TableCell>
            <TableCell>{log.log_date}</TableCell>
          </>
        )}
      </TableRow>
    ));
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
          color={activeButton === 'categoryLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainCategoryLog/', 'categoryLog')}
          disabled={loading}
          style={{ borderRadius: '10px', width: '16%', padding: '10px', lineHeight: '20px' }}
        >
          Category Log
        </Button>
        <Button
          variant="contained"
          color={activeButton === 'categoryVariantLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainCategoryVarientLog/', 'categoryVariantLog')}
          disabled={loading}
          style={{ borderRadius: '10px', width: '21%', padding: '10px', lineHeight: '20px' }}
        >
          Category Variant Log
        </Button>
        <Button
          variant="contained"
          color={activeButton === 'productLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainProductLog/', 'productLog')}
          disabled={loading}
          style={{ borderRadius: '10px', width: '18%', padding: '10px', lineHeight: '20px' }}
        >
          Product Log
        </Button>
        <Button
          variant="contained"
          color={activeButton === 'productVariantLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainProductVarientLog/', 'productVariantLog')}
          disabled={loading}
          style={{ borderRadius: '10px', width: '21%', padding: '10px', lineHeight: '20px' }}
        >
          Product Variant Log
        </Button>
        <Button
          variant="contained"
          color={activeButton === 'priceLog' ? 'secondary' : 'primary'}
          onClick={() => handleApiCall('obtainPriceLog/', 'priceLog')}
          disabled={loading}
          style={{ borderRadius: '10px', width: '16%', padding: '10px', lineHeight: '20px' }}
        >
          Price Log
        </Button>
      </div>

      {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}

      {apiResponse.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>{renderHeaders()}</TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default HistoryPage;