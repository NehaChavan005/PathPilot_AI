import React from 'react';

const SkillGapVisual = ({ skillsData }) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 hover:border-indigo-100 transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black text-slate-900">Required vs Current Skills</h3>
        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full border border-orange-100">AI/ML Target</span>
      </div>
      
      <div className="space-y-6">
        {skillsData.map((skill, index) => (
          <div key={index} className="flex flex-col group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">{skill.name}</span>
              <span className="text-slate-500 font-medium">
                <span className={`font-bold ${skill.current >= skill.required ? 'text-green-600' : 'text-indigo-600'}`}>
                  {skill.current}%
                </span> / {skill.required}%
              </span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-slate-200" style={{ width: `${skill.required}%` }}></div>
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${skill.current >= skill.required ? 'bg-green-500' : 'bg-indigo-500'}`} 
                style={{ width: `${skill.current}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillGapVisual;
