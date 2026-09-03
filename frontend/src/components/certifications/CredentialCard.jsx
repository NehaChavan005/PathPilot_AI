import React from 'react';
import { Award, Lock } from 'lucide-react';

const CredentialCard = ({ title, provider, progress, locked, targetDate }) => {
  return (
    <div className={`p-6 rounded-3xl border transition-all duration-300 ${locked ? 'bg-slate-50 border-slate-200 opacity-70' : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200'}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${locked ? 'bg-slate-200 text-slate-400' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
          {locked ? (
            <Lock className="w-6 h-6" aria-hidden="true" />
          ) : (
            <Award className="w-6 h-6" aria-hidden="true" />
          )}
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{provider}</p>
          <h3 className={`text-lg font-black leading-tight mt-1 ${locked ? 'text-slate-600' : 'text-slate-900'}`}>{title}</h3>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
          <span>{locked ? 'Locked' : `${progress}% Complete`}</span>
          <span>{targetDate}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          {!locked && <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>}
        </div>
      </div>
    </div>
  );
};

export default CredentialCard;
