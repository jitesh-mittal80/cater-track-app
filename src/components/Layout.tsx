import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { state } = useApp();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!state.user && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // Show login page without layout
  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;