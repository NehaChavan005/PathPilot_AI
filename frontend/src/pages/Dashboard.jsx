import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import NextBestAction from '../components/dashboard/NextBestAction';
import SkillGapVisual from '../components/dashboard/SkillGapVisual';

const Dashboard = () => {
  const navigate = useNavigate(); // 2. Initialize navigation

  const mockSkillsGap = [
    { name: "Python", current: 90, required: 80 },
    { name: "Machine Learning", current: 65, required: 85 },
    { name: "Deep Learning", current: 30, required: 80 },
  ];

  return (
    <div className="p-4 md:p-8 font-sans w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">AI Career Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Your AI-Powered <span className="text-indigo-600">Career & Learning</span> Navigator
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Welcome back, Omkar. Master essential skills, bridge your knowledge gaps, and accelerate your journey to becoming an AI/ML Engineer.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            {/* 3. Attach onClick navigation handler */}
            <button 
              onClick={() => navigate('/learning')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Learning Paths
            </button>
            <div className="flex items-center gap-3">
              <img src="/trust-avatars.png" alt="Learners" className="h-10 object-contain drop-shadow-sm rounded-full" />
              <div className="text-xs font-bold text-slate-700 leading-tight">17K+ <span className="text-slate-500 font-medium block">Active Learners</span></div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <img 
            src="/ChatGPT Image Sep 2, 2026, 09_44_10 AM.png" 
            alt="AI Career and Learning Navigator" 
            className="w-full max-w-lg h-auto object-contain"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
        <NextBestAction />
        <div className="lg:col-span-2"><SkillGapVisual skillsData={mockSkillsGap} /></div>
      </div>
    </div>
  );
};
export default Dashboard;
