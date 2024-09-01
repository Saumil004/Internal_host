import React from 'react';
import TopSection from '../components/TopSection';
import HeroParent from '../components/HeroParent';
import SideBar from '../components/SideBar';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/6 h-screen ">
      <div className='fixed h-screen'>
        <SideBar />
        </div>
      </div>

      {/* Main content */}
      <div className="w-5/6 flex flex-col">
        <div className="flex-1 shadow-md">
          {/* Top Section */}
          <div className="bg-blue-100  mb-4 ">
            <TopSection />
          </div>
          
          {/* Hero Section */}
          <div className=" pt-4 pl-2 pr-2 ">
            <HeroParent />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="bg-gray-200 p-4 border-t border-gray-400">
          <Footer />
        </footer>
      </div>
    </div>
  );
}

export default Home;
