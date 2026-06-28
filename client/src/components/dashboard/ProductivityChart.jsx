import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ProductivityChart = ({ weeklyProductivity }) => {
  if (!weeklyProductivity || weeklyProductivity.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Weekly Productivity</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
          Complete some tasks to see your productivity trend
        </div>
      </div>
    );
  }

  // Build last 7 days labels
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const productivityMap = {};
  weeklyProductivity.forEach((item) => {
    productivityMap[item._id] = item.count;
  });

  const labels = last7Days.map((d) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });

  const dataValues = last7Days.map((d) => productivityMap[d] || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Tasks Completed',
        data: dataValues,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { family: 'Inter', size: 13, weight: 600 },
        bodyFont: { family: 'Inter', size: 12 },
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#9ca3af',
          font: { family: 'Inter', size: 11 },
        },
        grid: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--border').trim() || '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280',
          font: { family: 'Inter', size: 12, weight: 500 },
        },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="chart-card" id="productivity-chart">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Weekly Productivity</h3>
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default ProductivityChart;
