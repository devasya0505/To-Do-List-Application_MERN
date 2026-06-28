import { useEffect } from 'react';
import useTasks from '../hooks/useTasks';
import StatsCards from '../components/dashboard/StatsCards';
import CompletionChart from '../components/dashboard/CompletionChart';
import PriorityChart from '../components/dashboard/PriorityChart';
import ProductivityChart from '../components/dashboard/ProductivityChart';
import Loader from '../components/common/Loader';

const DashboardPage = () => {
  const { analytics, fetchAnalytics } = useTasks();

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (!analytics) {
    return <Loader text="Loading dashboard..." />;
  }

  return (
    <div id="dashboard-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Dashboard</h1>
          <p>Overview of your task management activity</p>
        </div>
      </div>

      <StatsCards overview={analytics.overview} />

      <div className="charts-grid">
        <CompletionChart statusDistribution={analytics.statusDistribution} />
        <PriorityChart priorityDistribution={analytics.priorityDistribution} />
        <ProductivityChart weeklyProductivity={analytics.weeklyProductivity} />
      </div>
    </div>
  );
};

export default DashboardPage;
