const StatsCards = ({ overview }) => {
  if (!overview) return null;

  const stats = [
    {
      label: 'Total Tasks',
      value: overview.total,
      icon: '📋',
      accent: 'total',
    },
    {
      label: 'Completed',
      value: overview.completed,
      icon: '✅',
      accent: 'completed',
    },
    {
      label: 'Pending',
      value: overview.total - overview.completed,
      icon: '⏳',
      accent: 'pending',
    },
    {
      label: 'Overdue',
      value: overview.overdue,
      icon: '🔴',
      accent: 'overdue',
    },
    {
      label: 'Completion Rate',
      value: `${overview.completionRate}%`,
      icon: '📈',
      accent: 'rate',
    },
  ];

  return (
    <div className="stats-grid" id="stats-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className={`stat-card-icon ${stat.accent}`}>{stat.icon}</div>
          <div className="stat-card-value">{stat.value}</div>
          <div className="stat-card-label">{stat.label}</div>
          <div className={`stat-card-accent ${stat.accent}`} />
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
