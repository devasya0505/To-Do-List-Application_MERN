import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import { useState, useEffect } from 'react';

const Navbar = ({ onSearch, onToggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (onSearch) onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <nav className="navbar" id="navbar">
      <div className="navbar-left">
        <button
          className="btn btn-ghost btn-icon sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          style={{ display: 'none' }}
          id="sidebar-toggle"
        >
          ☰
        </button>
        <div className="navbar-brand">
          <div className="navbar-brand-icon">✓</div>
          <span>TaskFlow</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <span className="navbar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            id="global-search"
            aria-label="Search tasks"
          />
        </div>

        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <div
          className="user-menu"
          onClick={() => setShowMenu(!showMenu)}
          id="user-menu"
        >
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <span className="user-name">{user?.name}</span>
        </div>

        {showMenu && (
          <div
            style={{
              position: 'absolute',
              top: '60px',
              right: '32px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 200,
              animation: 'fadeInDown 0.2s ease',
              minWidth: '160px',
            }}
          >
            <div style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
              {user?.email}
            </div>
            <button
              className="btn btn-ghost w-full"
              style={{ justifyContent: 'flex-start', width: '100%', color: 'var(--danger)' }}
              onClick={() => { setShowMenu(false); logout(); }}
              id="logout-btn"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>

      {/* Click-outside handler */}
      {showMenu && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          onClick={() => setShowMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
