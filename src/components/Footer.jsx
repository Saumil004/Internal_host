import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-1">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center md:flex-row md:justify-between">
          <div className="text-center md:text-left mb-1 md:mb-0">
            <h1 className="text-3xl font-bold">Aceme</h1>
          </div>
        </div>
        <div className="text-center mt-8 border-t border-gray-700 pt-4">
          <p>&copy; {new Date().getFullYear()} Aceme. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
