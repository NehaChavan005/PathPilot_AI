import React from 'react';

const CareerMatchCard = ({ role, matchScore, readiness, skills }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
          🤖 {role}
        </h3>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
          Match: {matchScore}%
        </span>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
          <span>Current Readiness</span>
          <span className="text-indigo-600">{readiness}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${readiness}%` }}></div>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Core Skills Needed</p>
        <ul className="space-y-2.5">
          {skills.map((skill, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
              {skill.status === 'acquired' ? <span className="text-green-500 text-lg">✓</span> : 
               skill.status === 'learning' ? <span className="text-orange-400 text-lg">⚡</span> : 
               <span className="text-red-400 text-lg">✕</span>}
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CareerMatchCard;
