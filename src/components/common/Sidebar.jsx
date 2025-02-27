import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="3" y="3" width="7" height="9" rx="2" />
          <rect x="14" y="3" width="7" height="5" rx="2" />
          <rect x="14" y="12" width="7" height="9" rx="2" />
          <rect x="3" y="16" width="7" height="5" rx="2" />
        </svg>
      )
    },
    {
      path: '/payments',
      name: 'Payments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <rect x="2" y="9" width="20" height="3" />
          <circle cx="16" cy="14" r="2" />
        </svg>
      )
    },
    {
      path: '/students',
      name: 'Students',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <circle cx="8" cy="6" r="3" />
          <path d="M4 14C4 11.7909 5.79086 10 8 10C10.2091 10 12 11.7909 12 14V16H4V14Z" />
          <circle cx="16" cy="6" r="3" />
          <path d="M12 14C12 11.7909 13.7909 10 16 10C18.2091 10 20 11.7909 20 14V16H12V14Z" />
          <rect x="8" y="18" width="8" height="2" rx="1" />
        </svg>
      )
    },
    {
      path: '/expenses',
      name: 'Expenses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10H6V8Z" />
          <path d="M4 10C2.89543 10 2 10.8954 2 12V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V12C22 10.8954 21.1046 10 20 10H4Z" />
          <path d="M12 14V18M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="white" strokeWidth="2" />
        </svg>
      )
    },
    {
      path: '/reports',
      name: 'Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#EEF2FF" />
          <rect x="5" y="14" width="2" height="5" />
          <rect x="9" y="10" width="2" height="9" />
          <rect x="13" y="12" width="2" height="7" />
          <rect x="17" y="8" width="2" height="11" />
          <path d="M5 8L9 6L13 9L17 5" stroke="#3730A3" strokeWidth="2" fill="none" />
        </svg>
      )
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M10.3256 2.64172C10.8072 1.07111 13.1928 1.07111 13.6744 2.64172L14.0592 3.81711C14.2384 4.36423 14.7126 4.76093 15.2809 4.85773L16.5316 5.07493C18.1932 5.35947 18.863 7.4975 17.6301 8.66344L16.6848 9.54989C16.2604 9.95021 16.0709 10.5504 16.1869 11.1274L16.4401 12.3656C16.7384 13.9881 14.9353 15.2754 13.5069 14.4926L12.4574 13.9173C11.9382 13.6417 11.3161 13.6417 10.7968 13.9173L9.74732 14.4926C8.31898 15.2754 6.51593 13.9881 6.81419 12.3656L7.06741 11.1274C7.18336 10.5504 6.99392 9.95021 6.56953 9.54989L5.62416 8.66344C4.39126 7.4975 5.06102 5.35947 6.72266 5.07493L7.97329 4.85773C8.54155 4.76093 9.01581 4.36423 9.19506 3.81711L10.3256 2.64172Z" />
          <circle cx="12" cy="12" r="3" fill="white" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60" className="h-10 w-auto">
            <rect x="10" y="10" width="40" height="40" rx="8" fill="#4F46E5" />
            <path d="M22 20C22 19.4477 22.4477 19 23 19H37C37.5523 19 38 19.4477 38 20V40C38 40.5523 37.5523 41 37 41H23C22.4477 41 22 40.5523 22 40V20Z" fill="white" />
            <path d="M26 23H34V27H26V23Z" fill="#4F46E5" />
            <path d="M26 29H34V33H26V29Z" fill="#4F46E5" />
            <path d="M26 35H34V37H26V35Z" fill="#4F46E5" />
            <text x="55" y="30" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#4F46E5">School</text>
            <text x="55" y="45" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="14" fill="#4F46E5">Manager</text>
          </svg>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  pathname === item.path
                    ? 'bg-primary-50 text-primary-700 fill-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 fill-gray-500 hover:text-gray-900 hover:fill-gray-700'
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 mr-3 ${
                    pathname === item.path ? 'fill-primary-700' : 'fill-current'
                  }`
                })}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={signOut}
          className="flex items-center px-4 py-2 w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
