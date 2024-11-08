import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
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

// Register components with Chart.js
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

  // Sales Overview Data (static for now)
  const salesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [5000, 8000, 6000, 12000, 15000, 18000],
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Fetch dashboard data from backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://192.168.1.13:8000/api/obtainDashboardCount/');
        if (response.data) {
          setDashboardData(response.data.data); // Update state with fetched data
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Prepare category project data for the Bar chart
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
        {/* Sales Overview Chart */}
        {/* <div className="chart-card">
          <h3>Sales Overview</h3>
          <Line data={salesData} options={options} />
        </div> */}

        {/* Category Project Count Chart */}
        <div className="chart-card">
          <h3>Category Products Count</h3>
          <Bar data={categoryData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
