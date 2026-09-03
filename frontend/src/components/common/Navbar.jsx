import React, { useState, useRef, useEffect } from 'react';
import MegaMenu from './MegaMenu';

const Navbar = ({ userName = "Omkar" }) => {
  const [showCourses, setShowCourses] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowCourses(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex justify-between items-center w-full sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-6">
        <div className="font-black text-indigo-600 md:hidden text-lg tracking-tight">PATHPILOT</div>
        
        <div className="relative hidden md:block" ref={menuRef}>
          <button 
            onClick={() => setShowCourses(!showCourses)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              showCourses ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            All Courses
          </button>
          <MegaMenu isVisible={showCourses} />
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 hidden lg:block">
        <div className="relative group">
          <svg className="absolute left-4 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search courses, skills..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors">
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 cursor-pointer hover:shadow-md transition-shadow">
          {userName.charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
