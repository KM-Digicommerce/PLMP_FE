import React from 'react';
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
  // Sales Overview Data
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

  // Top Products Data
  const topProductsData = {
    labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
    datasets: [
      {
        label: 'Units Sold',
        data: [120, 150, 180, 200, 170],
        backgroundColor: [
          '#0156B7',
          '#0156B7',
          '#0156B7',
          '#0156B7',
          '#0156B7',
        ],
        borderWidth: 1,
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

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard Overview</h2>

      <div className="stats-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>1,245</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>3,678</p>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <p>$120,560</p>
        </div>
        <div className="card">
          <h3>New Customers</h3>
          <p>245</p>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Sales Overview</h3>
          <Line data={salesData} options={options} />
        </div>
        <div className="chart-card">
          <h3>Top Products</h3>
          <Bar data={topProductsData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
