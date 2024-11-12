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
    return <div>Loading...</div>;
  }

  const variantData = {
    labels: dashboardData.varent_list.map(item => item.type_name),
    datasets: [
      {
        label: 'Option Value Count',
        data: dashboardData.varent_list.map(item => item.option_value_count),
        backgroundColor: '#0156B7',
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(dashboardData.category_project_dict),
    datasets: [
      {
        label: 'Projects/Products Count',
        data: Object.values(dashboardData.category_project_dict),
        backgroundColor: '#0156B7',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="stats-cards">
        {/* Stats Cards with dynamic data */}
        <div className="card">
          <h3>Total Products</h3>
          <p>{dashboardData.total_product}</p>
        </div>
        <div className="card">
          <h3>Total Brands</h3>
          <p>{dashboardData.total_brand}</p>
        </div>
        <div className="card">
          <h3>Total Last Level Categories</h3>
          <p>{dashboardData.total_last_level_category}</p>
        </div>
        <div className="card">
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
