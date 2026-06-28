import { NavLink } from 'react-router-dom';

const Sidebar = ({ trashCount = 0 }) => {
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-section-title">Main</div>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          id="nav-dashboard"
        >
          <span className="sidebar-item-icon">📊</span>
          Dashboard
        </NavLink>
        <NavLink
          to="/tasks"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          id="nav-tasks"
        >
          <span className="sidebar-item-icon">📋</span>
          Tasks
        </NavLink>
        <NavLink
          to="/kanban"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          id="nav-kanban"
        >
          <span className="sidebar-item-icon">📌</span>
          Kanban Board
        </NavLink>
      </div>

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div className="sidebar-section-title">Manage</div>
        <NavLink
          to="/trash"
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          id="nav-trash"
        >
          <span className="sidebar-item-icon">🗑️</span>
          Trash
          {trashCount > 0 && (
            <span className="sidebar-item-badge">{trashCount}</span>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
