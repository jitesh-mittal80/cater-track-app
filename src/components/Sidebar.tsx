import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ShoppingBag, History, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Sidebar = () => {
  const { logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/order-food', icon: ShoppingBag, label: 'Order Food' },
    { to: '/order-history', icon: History, label: 'Order History' }
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          CaterTrack
        </h1>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="mr-3 h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;