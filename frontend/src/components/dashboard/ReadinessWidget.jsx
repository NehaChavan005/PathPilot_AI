import React from 'react';
import ProgressBar from '../common/ProgressBar';

const ReadinessWidget = ({ score }) => {
  return (
    <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Overall Readiness</span>
        <span className="text-3xl font-black text-indigo-600">{score}%</span>
      </div>
      <ProgressBar progress={score} />
    </div>
  );
};

export default ReadinessWidget;
