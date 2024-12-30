import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Dashboard.css'; // Add your custom styles here
import axiosInstance from '../../../../src/utils/axiosConfig';
import Unauthorized from '../../Unauthorized';
import Modal from '@mui/material/Modal'; // Correct Modal import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [showVendors, setShowVendors] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [parentCategories, setParentCategories] = useState([]); // Parent categories state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [isModalOpenvendor, setIsModalOpenVendor] = useState(false); // Modal state

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    animation: {
      duration: 1500, // Duration for the chart animation
      easing: 'easeInOutQuad',
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainDashboardCount/`);
        if (response.status === 401) {
          setUnauthorized(true);
        } else if (response.data) {
          const categories = response.data.data.parent_level_category_list;
          setParentCategories(categories); // Set parent categories
          setDashboardData(response.data.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUnauthorized(true);
        } else console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  const fetchVendors = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_IP}/obtainBrand/`);
      if (response.data) {
        setVendors(response.data.data.brand_list); // Adjust based on the actual structure of the response
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const handleVendorClick = () => {
    setIsModalOpenVendor(true)
    fetchVendors(); // Fetch vendors when the section is being displayed
  };
  const closeVendorModal = () => {
    setShowVendors(false);
    setIsModalOpenVendor(false);
  };

  if (unauthorized) {
    return <Unauthorized />;
  }

  if (loading) {
    return (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  if (!dashboardData) {
    return (
      <div className="superAdmin-error-message">
        <p>Error loading dashboard data. Please try again later.</p>
      </div>
    );
  }
  const variantData = {
    labels: dashboardData.varent_list.map(item => item.type_name),
    datasets: [
      {
        label: 'Option Value Count',
        data: dashboardData.varent_list.map(item => item.option_value_count),
        backgroundColor: 'rgba(38, 198, 218, 0.7)',
        borderColor: 'rgba(38, 198, 218, 1)',
        borderWidth: 2,
      },
      {
        label: 'Option Value Count 2',
        data: dashboardData.varent_list.map(item => item.option_value_count + 5),
        backgroundColor: 'rgba(255, 159, 64, 0.7)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(dashboardData.category_project_dict),
    datasets: [
      {
        label: 'Projects/Products Count',
        data: Object.values(dashboardData.category_project_dict),
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        borderWidth: 2,
      },
      {
        label: 'Another Data',
        data: Object.values(dashboardData.category_project_dict).map(val => val + 10),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="stats-cards">
        <div className="card card-blue">
          <h3>Total Products</h3>
          <p>{dashboardData.total_product}</p>
        </div>
        <div className="card card-green" onClick={handleVendorClick}>
          <h3>Total Vendors</h3>
          <p>{dashboardData.total_brand}</p>
        </div>
        <div className="card card-yellow">
          <h3>Total End Level Categories</h3>
          <p>{dashboardData.total_last_level_category}</p>
        </div>
        <div className="card card-orange" onClick={openModal}>
          <h3>Total Parent Level Categories</h3>
          <p>{dashboardData.total_parent_level_category}</p>
        </div>
      </div>
      <div className="charts-section">
        <div className="chart-card">
          <h3>Variant-Options Count</h3>
          <Line data={variantData} options={options} />
        </div>

        <div className="chart-card">
          <h3>Category-Products Count</h3>
          <Bar data={categoryData} options={options} />
        </div>
      </div>
      <Modal open={isModalOpen} className='modal-content-dashboard' onClose={closeModal}>
  <div className="modal-container">
    <h2>Parent Level Categories</h2>
    <ul className='ulliclass'>
      {parentCategories.length > 0 ? (
        parentCategories.map((category) => (
          <li key={category.id} className='ulliclass'>
            {category.name}
          </li>
        ))
      ) : (
        <p>No categories found.</p>
      )}
    </ul>
    <button onClick={closeModal} className='btn_dash'>Close</button>
  </div>
</Modal>
<Modal open={isModalOpenvendor} className='modal-content-dashboard' onClose={closeVendorModal}>
  <div className="modal-container">
    <h2>Total Vendors</h2>
    <ul className="ulliclass">
              {vendors.length > 0 ? (
                vendors.map(vendor => (
                  <li key={vendor.id} className="ulliclass">
                    <div className="vendor-name">{vendor.name}</div>
                  </li>
                ))
              ) : (
                <p>No vendors found.</p>
              )}
            </ul>
    <button onClick={closeVendorModal} className='btn_dash'>Close</button>
  </div>
</Modal>
    </div>
  );
}
export default Dashboard;