import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#B3CFE5] overflow-hidden font-sans">
      {/* Left Sidebar Fixed */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar Fixed */}
        <Navbar userName="Omkar" />
        
        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Outlet is where your Dashboard, Profile, etc. will inject */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
