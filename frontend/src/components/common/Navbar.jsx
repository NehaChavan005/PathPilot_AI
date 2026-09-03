import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerProfile } from '../../context/LearnerProfileCtx';
import MegaMenu from './MegaMenu';

const Navbar = () => {
  const navigate = useNavigate();
  const { profile, markAllNotificationsRead } = useLearnerProfile();
  const [showCourses, setShowCourses] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = profile.notifications || [];
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowCourses(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setTimeout(() => markAllNotificationsRead(), 2000);
    }
  };

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
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={handleNotificationClick}
            className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.slice(0, 10).map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                        !notif.read ? 'bg-indigo-50/30' : ''
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-700">{notif.message}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-xs text-slate-400">No notifications yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div 
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 cursor-pointer hover:shadow-md transition-shadow"
        >
          {(profile.name || 'U').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
