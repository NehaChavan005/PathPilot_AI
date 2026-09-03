import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();
  
  const links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/profile', label: 'My Profile' },
    { path: '/courses', label: 'All Courses' },
    { path: '/learning', label: 'Learning Path' },
    { path: '/career', label: 'Career Path' },
    { path: '/roleplay', label: 'AI Role Play' },
    { path: '/certifications', label: 'Certifications' },
    { path: '/analytics', label: 'Skill Analytics' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 hidden md:flex flex-col h-screen sticky top-0 flex-shrink-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="p-8">
        <h2 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center gap-2">
          PATHPILOT
        </h2>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI Navigator</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {links.map(link => {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link 
              key={link.path} 
              to={link.path} 
              className={`block px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50 scale-[1.02]' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
