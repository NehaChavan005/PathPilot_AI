import React from 'react';
import BentoCard from '../common/BentoCard';

const SkillGapVisual = ({ skills, targetRole }) => {
  return (
    <BentoCard>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">Career Readiness</h3>
        {targetRole && (
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
            {targetRole}
          </span>
        )}
      </div>
      
      <div className="space-y-6">
        {skills.map((skill, i) => (
          <div key={i} className="group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">{skill.name}</span>
              <span className="font-bold text-indigo-600">{skill.score}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 bg-indigo-500 group-hover:bg-indigo-600" 
                style={{ width: `${skill.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};

export default SkillGapVisual;
