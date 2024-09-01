import React from 'react';
import TopSection from '../components/TopSection';
import HeroParent from '../components/HeroParent';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';
import PatientTable from '../components/Table';
const PatientData = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 bg-gray-800 text-white p-4 border-r border-gray-600">
        <SideBar />
      </div>

      {/* Main content */}
      <div className="w-5/6 flex flex-col ">
        <div className="flex-1 ">
          {/* Top Section */}
          <div className="bg-blue-100 mb-4 border border-blue-300">
            <TopSection />
          </div>

          {/* Patient Table */}
          <PatientTable />
        </div>

        {/* Footer */}
        <footer className="bg-gray-200 p-4 border-t border-gray-400">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default PatientData;
