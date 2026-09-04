import React from 'react';

const StreakCounter = ({ days = 3 }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-2xl shadow-inner">
        🔥
      </div>
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Learning Streak</h4>
        <p className="text-2xl font-black text-slate-900">{days} <span className="text-sm font-bold text-slate-500">Days</span></p>
      </div>
    </div>
  );
};

export default StreakCounter;
