import React, { useState, useContext } from 'react';
import { Menu, X, User, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/', { replace: true });
    setIsOpen(false);
  };

  const menuItems = [
    { label: 'Home', href: '/' },
    !isLoggedIn && { label: 'Login', href: '/login' },
    !isLoggedIn && { label: 'Register', href: '/register' },
    isLoggedIn && userRole === 'user' && { label: 'Transactions', href: '/transactions' },
    isLoggedIn && userRole === 'admin' && { label: 'Administrators', href: '/admin' },
    isLoggedIn && userRole === 'admin' && { label: 'Pending Transactions', href: '/pending-transactions' },
    isLoggedIn && { label: 'Sign Out', href: '#', onClick: handleSignOut },
  ].filter(Boolean);

  return (
    <nav className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <span className="text-xl font-semibold">Customer Portal</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href !== '#' ? item.href : undefined}
                  onClick={item.onClick || null}
                  className="text-white hover:text-gray-200 inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search and Profile for Desktop */}
          <div className="hidden sm:flex sm:items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-200" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 py-2 rounded-md border border-transparent bg-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-white focus:border-transparent"
                aria-label="Search"
              />
            </div>
            {isLoggedIn && (
              <div className="relative group">
                <button className="rounded-full focus:outline-none">
                  <User className="h-6 w-6 text-white" />
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center sm:hidden">
            <button className="p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href !== '#' ? item.href : undefined}
                onClick={() => {
                  item.onClick && item.onClick();
                  setIsOpen(false);
                }}
                className="text-white hover:bg-blue-700 hover:text-gray-100 block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
