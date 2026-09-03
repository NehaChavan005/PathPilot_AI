import React, { useMemo } from 'react';

const MyProfile = () => {
  // Enhanced profile data with links
  const profileData = {
    name: "Omkar",
    targetCareer: "AI/ML Engineer",
    summary: "Aspiring AI/ML Engineer with a strong foundation in deep learning, data analytics, and building full-stack AI applications.",
    skills: ["Python", "TensorFlow", "React", "Streamlit", "Flask", "SQL"],
    links: {
      linkedin: "https://linkedin.com",
      github: "https://github.com",
      leetcode: "https://leetcode.com"
    }
  };

  // Generate 365 days of random activity data for the heatmap calendar
  const heatmapData = useMemo(() => {
    return Array.from({ length: 364 }, () => {
      const rand = Math.random();
      if (rand > 0.85) return 4;
      if (rand > 0.65) return 3;
      if (rand > 0.45) return 2;
      if (rand > 0.25) return 1;
      return 0;
    });
  }, []);
  
  const getHeatmapColor = (level) => {
    switch(level) {
      case 1: return 'bg-indigo-100 border-indigo-200/50'; 
      case 2: return 'bg-indigo-300 border-indigo-400/50';
      case 3: return 'bg-indigo-500 border-indigo-600/50'; 
      case 4: return 'bg-indigo-700 border-indigo-800/50';
      default: return 'bg-slate-50 border-slate-100'; 
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen space-y-6 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* 1. Profile Header */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl font-black text-indigo-600 shadow-sm relative">
            {profileData.name.charAt(0)}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <span className="w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              {profileData.name} <span className="text-indigo-600 text-2xl">✓</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm tracking-wide uppercase mt-1">
              {profileData.targetCareer}
            </p>
            
            {/* Social & Portfolio Links */}
            <div className="flex items-center gap-3 mt-4">
              <a href={profileData.links.linkedin} target="_blank" rel="noreferrer" title="LinkedIn" 
                 className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#0A66C2] hover:bg-blue-50 rounded-xl transition-all border border-slate-100 hover:border-blue-100 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href={profileData.links.github} target="_blank" rel="noreferrer" title="GitHub"
                 className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 hover:border-slate-300 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href={profileData.links.leetcode} target="_blank" rel="noreferrer" title="LeetCode"
                 className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#FFA116] hover:bg-orange-50 rounded-xl transition-all border border-slate-100 hover:border-orange-200 shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.543l3.995 3.979 3.331 3.141c.289.27.669.419 1.066.419a1.53 1.53 0 0 0 1.082-.445c.294-.28.468-.679.48-1.087a1.543 1.543 0 0 0-.422-1.122l-4.153-3.916a3.02 3.02 0 0 1-.884-1.745 3.056 3.056 0 0 1 .15-1.56 3.01 3.01 0 0 1 1.488-1.611l4.896-2.585a1.556 1.556 0 0 0 .82-1.31 1.532 1.532 0 0 0-.324-1.17l-4.22-4.516a2.915 2.915 0 0 1-.689-1.282 2.87 2.87 0 0 1-.027-1.393 2.844 2.844 0 0 1 1.135-1.624l4.246-3.05a1.53 1.53 0 0 0 .584-1.189 1.528 1.528 0 0 0-.496-1.157 1.524 1.524 0 0 0-1.08-.438zM2.877 15.655a3.178 3.178 0 0 1-.164-.783 3.16 3.16 0 0 1 .08-.857 3.084 3.084 0 0 1 .552-1.07l3.784-4.053 5.34-5.719-3.957 2.842a5.244 5.244 0 0 0-1.921 2.651 5.325 5.325 0 0 0 .044 2.693 5.34 5.34 0 0 0 1.258 2.378l4.153 4.444-4.82 2.545a5.412 5.412 0 0 0-2.613 2.766 5.467 5.467 0 0 0-.255 2.85 5.468 5.468 0 0 0 1.566 2.909l3.996 3.766-3.21-3.028-3.833-3.818a3.522 3.522 0 0 1-.775-.939 3.5 3.5 0 0 1-.225-.577zm18.349-1.52a1.5 1.5 0 0 0-.398.053l-6.864 1.839a1.5 1.5 0 0 0-1.085 1.875 1.5 1.5 0 0 0 1.876 1.085l6.864-1.84a1.5 1.5 0 0 0 1.084-1.874 1.5 1.5 0 0 0-1.477-1.138z"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <button className="px-8 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors shadow-sm">
          Edit Profile
        </button>
      </div>

      {/* 2. Calendar & Streak Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Activity Heatmap Calendar */}
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow overflow-hidden">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Learning Calendar</h2>
              <p className="text-xl font-black text-slate-900">145 Submissions <span className="text-slate-400 font-medium text-sm ml-1">in the last year</span></p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:flex">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map(level => (
                  <div key={level} className={`w-3 h-3 rounded-[3px] border ${getHeatmapColor(level)}`}></div>
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
          
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="grid grid-rows-7 grid-flow-col gap-[4px] min-w-[700px]">
              {heatmapData.map((level, i) => (
                <div 
                  key={i} 
                  className={`w-3.5 h-3.5 rounded-[4px] border ${getHeatmapColor(level)} transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-indigo-400 hover:scale-125 hover:z-10`} 
                  title={`Activity level ${level}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-4 min-w-[700px] px-1 uppercase tracking-widest">
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
            </div>
          </div>
        </div>

        {/* Streak Stats Vertical Column */}
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex-1 flex flex-col justify-center">
            <div className="absolute -right-4 -top-4 text-white/10 text-7xl transform group-hover:scale-110 transition-transform duration-500">🔥</div>
            <h3 className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mb-1 relative z-10">Current Streak</h3>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-black tracking-tighter">12</span>
              <span className="text-orange-200 font-bold">Days</span>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow flex-1 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Longest Streak</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">28</span>
              <span className="text-slate-500 font-bold text-sm">Days</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-4 overflow-hidden">
              <div className="w-[45%] h-full bg-indigo-500 rounded-full"></div>
            </div>
          </div>
        </div>
        
      </div>

      {/* 3. Synthesis & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">AI Synthesis</h2>
          <p className="text-slate-600 font-medium leading-relaxed text-sm">{profileData.summary}</p>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verified Stack</h2>
          <div className="flex flex-wrap gap-2.5">
            {profileData.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors cursor-default">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyProfile;
