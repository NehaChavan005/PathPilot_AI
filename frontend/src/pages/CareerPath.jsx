import React from 'react';

const CareerPath = () => {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">🎯</span> Career Matches
        </h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl border bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50 flex justify-between items-center cursor-pointer transition-all hover:-translate-y-1">
            <div className="flex items-center gap-4">
              <span className="text-2xl text-indigo-600">🏆</span>
              <h3 className="font-bold text-lg text-indigo-900">AI/ML Engineer</h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-indigo-600">92%</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Career Readiness</h2>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2"><div className="bg-indigo-600 h-full rounded-full w-[90%]"></div></div>
            <p className="text-sm font-bold text-slate-700">AI/ML Engineer: 90%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerPath;
