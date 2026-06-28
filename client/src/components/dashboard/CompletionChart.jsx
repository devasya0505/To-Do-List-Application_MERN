import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CompletionChart = ({ statusDistribution }) => {
  if (!statusDistribution || statusDistribution.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title">Status Distribution</h3>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
          No data yet
        </div>
      </div>
    );
  }

  const statusMap = {};
  statusDistribution.forEach((s) => {
    statusMap[s._id] = s.count;
  });

  const data = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [
          statusMap['pending'] || 0,
          statusMap['in-progress'] || 0,
          statusMap['completed'] || 0,
        ],
        backgroundColor: [
          '#f59e0b',
          '#3b82f6',
          '#10b981',
        ],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 8,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyleWidth: 10,
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#6b7280',
          font: { family: 'Inter', size: 12, weight: 500 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { family: 'Inter', size: 13, weight: 600 },
        bodyFont: { family: 'Inter', size: 12 },
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="chart-card" id="status-chart">
      <div className="chart-card-header">
        <h3 className="chart-card-title">Status Distribution</h3>
      </div>
      <div className="chart-container">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default CompletionChart;
