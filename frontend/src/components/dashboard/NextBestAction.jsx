import React from 'react';

const NextBestAction = () => {
  return (
    <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="absolute -right-4 -top-4 text-white/10 text-8xl transform group-hover:scale-110 transition-transform duration-500">🎯</div>
      <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3 relative z-10">Next Best Action</h3>
      <h4 className="text-2xl font-black mb-2 relative z-10 leading-tight">Decision Tree Assessment</h4>
      <p className="text-indigo-200 text-sm mb-6 relative z-10 font-medium">Estimated time: 20 minutes</p>
      <button className="w-full py-3.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm relative z-10">
        Start Now
      </button>
    </div>
  );
};

export default NextBestAction;
