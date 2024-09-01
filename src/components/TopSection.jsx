import React from 'react';
import { Link } from 'react-router-dom';

// MountainIcon component
const MountainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
  </svg>
);

// NavigationButton component
const NavigationButton = ({ label, path }) => (
  <Link to={path} className="text-sm font-medium font-mono text-black hover:text-gray-700 transition duration-300 ease-in-out">
    {label}
  </Link>
);

// TopSection component
const TopSection = () => {
  const navigationButtons = [
    { label: 'Home', path: '/' },
    { label: 'Patient List', path: '/patients' },
    { label: 'Analytics', path: '/analytics' },
  
    { label: 'Alerts', path: '/alerts' },


  ];

  return (
    <header className="top-0 right-0 z-50 flex h-16 items-center justify-between bg-gradient-to-r from-blue-100 to-blue-200 px-4 sm:px-6 rounded-b-lg shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <MountainIcon className="h-6 w-6" />
        <span className="text-lg font-mono font-semibold">Acme Clinic</span>
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        {navigationButtons.map((button, index) => (
          <NavigationButton key={index} label={button.label} path={button.path} />
        ))}
      </nav>
    </header>
  );
};

export default TopSection;