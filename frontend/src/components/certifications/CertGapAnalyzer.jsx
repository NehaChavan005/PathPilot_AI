import React from 'react';
import BentoCard from '../common/BentoCard';

const CertGapAnalyzer = ({ missingPrereqs }) => {
  return (
    <BentoCard className="bg-orange-50/50 border-orange-100">
      <h3 className="text-sm font-bold text-orange-800 mb-4 flex items-center gap-2">
        <span className="text-lg">⚠️</span> Prerequisites Required
      </h3>
      <ul className="space-y-3">
        {missingPrereqs.map((req, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-orange-100/50 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            {req}
          </li>
        ))}
      </ul>
      <button className="mt-5 w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
        Add to Learning Path
      </button>
    </BentoCard>
  );
};

export default CertGapAnalyzer;
