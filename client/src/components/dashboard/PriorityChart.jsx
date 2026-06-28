import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriorityChart = ({ priorityDistribution }) => {
  if (!priorityDistribution || priorityDistribution.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Priority Breakdown</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
          No data yet
        </div>
      </div>
    );
  }

  const priorityMap = {};
  priorityDistribution.forEach((p) => {
    priorityMap[p._id] = p.count;
  });

  const data = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          priorityMap['low'] || 0,
          priorityMap['medium'] || 0,
          priorityMap['high'] || 0,
          priorityMap['critical'] || 0,
        ],
        backgroundColor: [
          'rgba(107, 114, 128, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(220, 38, 38, 0.9)',
        ],
        borderRadius: 8,
        borderSkipped: false,
        barThickness: 40,
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
    <div className="chart-card" id="priority-chart">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Priority Breakdown</h3>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default PriorityChart;
