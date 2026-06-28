import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ onSearch, trashCount }) => {
  return (
    <div className="app-layout">
      <Sidebar trashCount={trashCount} />
      <div className="app-main">
        <Navbar onSearch={onSearch} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
