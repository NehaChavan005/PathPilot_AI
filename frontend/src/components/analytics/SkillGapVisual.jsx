import React from 'react';

const SkillGapVisual = ({ 
  title = "Required vs Current Skills", 
  skills = [
    { name: "Python", current: 90, required: 80 },
    { name: "TensorFlow", current: 65, required: 85 },
    { name: "Data Transformation", current: 80, required: 70 }
  ]
}) => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="text-lg font-bold text-slate-900 mb-8">{title}</h3>
      
      <div className="space-y-6">
        {skills.map((skill, index) => (
          <div key={index} className="flex flex-col group">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">{skill.name}</span>
              <span className="text-slate-500 font-medium">
                <span className={`font-bold ${skill.current >= skill.required ? 'text-green-600' : 'text-indigo-600'}`}>{skill.current}%</span> / {skill.required}%
              </span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-slate-200 w-full" style={{ width: `${skill.required}%` }}></div>
              <div 
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${skill.current >= skill.required ? 'bg-green-500' : 'bg-indigo-600'}`} 
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
