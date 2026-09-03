import React from 'react';

const SkillLevelInput = ({ skills, onChange }) => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Left Column: Seamless Image with Background Glow */}
      <div className="hidden md:flex flex-1 relative justify-center items-center h-full min-h-[350px]">
        {/* Soft Animated Background Glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[60px] opacity-80 animate-pulse-slow"></div>
        
        {/* 3D Illustration */}
        <img 
          src="/ChatGPT Image Sep 2, 2026, 08_06_48 AM.png" 
          alt="Skill Assessment Visualization" 
          className="relative z-10 w-full max-w-[420px] h-auto object-contain drop-shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-700"
        />
      </div>

      {/* Right Column: Skill Sliders */}
      <div className="flex-1 w-full">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Assess Capabilities</h2>
        <p className="text-slate-500 text-sm mb-6 font-medium">Calibrate your current proficiency for accurate learning path generation.</p>
        
        {/* Scrollable container prevents the card from stretching too tall */}
        <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
          {Object.keys(skills).map((skill) => (
            <div key={skill} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md group">
              <div className="flex justify-between mb-3">
                <span className="font-bold text-sm text-slate-700 group-hover:text-indigo-900 transition-colors">{skill}</span>
                <span className="text-indigo-600 font-black text-sm bg-indigo-50 px-2 py-0.5 rounded-md">{skills[skill]}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="10"
                value={skills[skill]}
                onChange={(e) => onChange(skill, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SkillLevelInput;
