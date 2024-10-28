import React, { useState, useContext } from 'react';
import { Menu, X, User, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, userRole, logout } = useContext(AuthContext); // Get login state and logout from context
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = () => {
    console.log('Sign Out clicked');
    logout();

    // Force immediate navigation to home page
    console.log('Navigating to home page after logout');
    navigate('/', { replace: true });
  };

  // Menu items conditionally displayed based on login status and role
  const menuItems = [
    { label: 'Home', href: '/' },
    !isLoggedIn && { label: 'Login', href: '/login' },
    !isLoggedIn && { label: 'Register', href: '/register' }, 
    isLoggedIn && userRole === 'user' && { label: 'Transactions', href: '/transactions' },
    isLoggedIn && userRole === 'admin' && { label: 'Administrators', href: '/admin' }, 
    isLoggedIn && userRole === 'admin' && { label: 'Pending Transactions', href: '/pending-transactions' }, 
    isLoggedIn && { label: 'Sign Out', href: '#', onClick: handleSignOut }, 
  ].filter(Boolean); // Filter out null/undefined items

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CP</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">Customer Portal</span>
            </div>
            {/* Menu Items for larger screens */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href !== '#' ? item.href : undefined} // Use undefined for onClick items
                  onClick={item.onClick || null} // Call onClick if present
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right-hand icons (Search, Profile) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 py-2 rounded-md border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Profile Icon */}
            <button className="rounded-full">
              <User className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Hamburger Icon for Mobile */}
          <div className="flex items-center sm:hidden">
            <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <X className="h-6 w-6 text-gray-500" />
              ) : (
                <Menu className="h-6 w-6 text-gray-500" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.href !== '#' ? item.href : undefined} // Use undefined for onClick items
                onClick={item.onClick || null} // Call onClick if present
                className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
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
