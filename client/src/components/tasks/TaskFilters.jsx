import { STATUSES, PRIORITIES, SORT_OPTIONS } from '../../utils/constants';

const TaskFilters = ({ filters, onChange, onClear, activeCount = 0 }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  return (
    <div className="filters-bar" id="task-filters">
      <div className="filters-bar-header">
        <h3>
          🔍 Filters
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button className="btn btn-ghost btn-sm" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className="filters-grid">
        {/* Status filter */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            className="form-select"
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            className="form-select"
            value={filters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.icon} {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort by */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-sort">Sort By</label>
          <select
            id="filter-sort"
            className="form-select"
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Sort order */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-order">Order</label>
          <select
            id="filter-order"
            className="form-select"
            value={filters.sortOrder || 'desc'}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Due before */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-due-before">Due Before</label>
          <input
            type="date"
            id="filter-due-before"
            className="form-input"
            value={filters.dueBefore || ''}
            onChange={(e) => handleChange('dueBefore', e.target.value)}
          />
        </div>

        {/* Due after */}
        <div className="form-group">
          <label className="form-label" htmlFor="filter-due-after">Due After</label>
          <input
            type="date"
            id="filter-due-after"
            className="form-input"
            value={filters.dueAfter || ''}
            onChange={(e) => handleChange('dueAfter', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
