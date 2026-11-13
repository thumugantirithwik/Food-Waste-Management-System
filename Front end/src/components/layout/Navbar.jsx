import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  PlusCircle,
  ClipboardList,
  Search,
  Users,
  BarChart2,
  CheckSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { getInitials } from '../../utils/helpers';

function NavLink({ to, children, mobile = false, onClick }) {
  const location = useLocation();
  const active = location.pathname === to || location.pathname.startsWith(to + '/');
  const base = mobile
    ? `block px-4 py-2 text-sm rounded-lg font-medium ${active ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-100'}`
    : `px-3 py-2 text-sm rounded-lg font-medium transition-colors ${active ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`;
  return <Link to={to} className={base} onClick={onClick}>{children}</Link>;
}

function getRoleLinks(role) {
  if (role === 'donor') return [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/donor/create', label: 'Donate Food', icon: PlusCircle },
    { to: '/donor/my-donations', label: 'My Donations', icon: ClipboardList },
    { to: '/donor/requests', label: 'Requests', icon: CheckSquare },
  ];
  if (role === 'ngo') return [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/browse', label: 'Browse Food', icon: Search },
    { to: '/ngo/my-requests', label: 'My Requests', icon: ClipboardList },
  ];
  if (role === 'admin') return [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/donations', label: 'Donations', icon: ClipboardList },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  ];
  if (role === 'volunteer') return [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/volunteer/tasks', label: 'My Tasks', icon: CheckSquare },
  ];
  return [];
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications() || {};
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const links = user ? getRoleLinks(user.role) : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <span className="text-lg font-bold text-green-700">FoodShare</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {!user && (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/browse">Browse Food</NavLink>
              </>
            )}
            {links.map((l) => (
              <NavLink key={l.to} to={l.to}>{l.label}</NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                      {getInitials(user.name)}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="h-4 w-4" /> Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1">
          {!user && (
            <>
              <NavLink to="/" mobile onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/browse" mobile onClick={() => setMobileOpen(false)}>Browse Food</NavLink>
            </>
          )}
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} mobile onClick={() => setMobileOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          {!user && (
            <div className="flex gap-2 pt-2 border-t border-gray-100 mt-1">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

