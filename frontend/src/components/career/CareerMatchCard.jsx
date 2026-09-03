import React from 'react';

const CareerMatchCard = ({ title, score, isActive, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer flex justify-between items-center group ${
        isActive 
          ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' 
          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
          {isActive ? '🏆' : '🎯'}
        </div>
        <h3 className={`font-black text-lg ${isActive ? 'text-indigo-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
          {title}
        </h3>
      </div>
      <div className="text-right">
        <span className={`text-2xl font-black ${isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-500'}`}>
          {score}%
        </span>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Match</p>
      </div>
    </div>
  );
};

export default CareerMatchCard;
