import React from 'react';
import ChatInterface from '../components/ai-roleplay/ChatInterface';

const AIRolePlay = () => {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans flex flex-col h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-2">
             <img src="/ai-education-icon.png" alt="AI Roleplay" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">AI Role Play</h1>
            <p className="text-sm font-bold text-slate-500">Interview Simulator</p>
          </div>
        </div>
      </div>
      <div className="flex-1"><ChatInterface /></div>
    </div>
  );
};
export default AIRolePlay;
