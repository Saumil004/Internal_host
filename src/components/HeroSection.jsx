import React, { useState } from 'react';

// SearchIcon component
function SearchIcon(props) {
  return (
    <svg
      {...props}
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

// HeroSection component
const HeroSection = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(searchInput);  
    setIsSubmitted(true);  
  };

  return (
    <section className={`w-full pt-12 md:pt-24 lg:pt-32 ease-in-out transition-transform ${isSubmitted ? 'translate-y-[-100px]' : ''}`}>
      <div className="container flex flex-col items-center justify-center space-y-4">
        <div className={`flex items-center w-full max-w-[600px] rounded-full border  bg-white shadow-sm transition-transform ${isSubmitted ? 'translate-y-[-50px]' : ''}`}>
          <input
            type="search"
            placeholder="Search.. paitients"
            value={searchInput}
            onChange={handleSearchChange}
            className="flex-1 h-12 px-4 text-base rounded-l-full border-none focus:ring-0 focus:outline-none"
          />
          <button
            onClick={handleSearchSubmit}
            className="flex items-center justify-center bg-blue-200 w-12 h-12 rounded-r-full bg-primary text-primary-foreground"
          >
            <SearchIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
