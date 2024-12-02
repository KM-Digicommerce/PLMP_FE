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
import './Dashboard.css';
import axiosInstance from '../../../src/utils/axiosConfig';
import Unauthorized from '../Unauthorized';

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
        <div className="card card-green">
          <h3>Total Brands</h3>
          <p>{dashboardData.total_brand}</p>
        </div>
        <div className="card card-yellow">
          <h3>Total End Level Categories</h3>
          <p>{dashboardData.total_last_level_category}</p>
        </div>
        <div className="card card-orange">
          <h3>Total Parent Level Categories</h3>
          <p>{dashboardData.total_parent_level_category}</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Varient-Options Count</h3>
          <Line data={variantData} options={options} />
        </div>

        <div className="chart-card">
          <h3>Category-Products Count</h3>
          <Bar data={categoryData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
