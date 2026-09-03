import React from 'react';

const RoadmapTimeline = ({ phases }) => {
  return (
    <div className="relative pl-6 md:pl-8 py-4">
      {/* Main Vertical Track Line */}
      <div className="absolute left-[39px] md:left-[47px] top-4 bottom-12 w-1 rounded-full bg-slate-100">
        <div className="w-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ height: '35%' }}></div>
      </div>

      <div className="space-y-8 relative">
        {phases.map((phase) => (
          <div key={phase.id} className="relative flex items-start group animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Timeline Node Indicator */}
            <div className="flex-shrink-0 w-8 flex justify-center z-10 mt-6 mr-6 md:mr-8">
              <div className={`w-4 h-4 rounded-full border-4 ${
                phase.status === 'Completed' ? 'bg-green-500 border-white ring-2 ring-green-200' : 
                phase.status === 'In Progress' ? 'bg-indigo-600 border-white ring-2 ring-indigo-200 animate-pulse' : 
                'bg-slate-200 border-white ring-2 ring-slate-100'
              }`}></div>
            </div>

            {/* Phase Content Card */}
            <div className={`flex-1 rounded-3xl p-6 md:p-8 transition-all duration-300 border ${
              phase.status === 'Locked' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md'
            }`}>
              
              {/* Header */}
              <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {phase.phase} <span className="mx-1">•</span> {phase.duration}
                </p>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                  phase.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' : 
                  phase.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 
                  'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {phase.status}
                </span>
              </div>
              
              <h3 className={`text-xl md:text-2xl font-black mb-4 ${phase.status === 'Locked' ? 'text-slate-500' : 'text-slate-900'}`}>
                {phase.title}
              </h3>

              {/* Skills Tag Pills - Enlarged for readability */}
              <div className="flex flex-wrap gap-3 mb-6">
                {phase.skills?.map((skill, idx) => (
                  <span key={idx} className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                    phase.status === 'Locked' 
                      ? 'bg-white text-slate-400 border-slate-200' 
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-sm'
                  }`}>
                    {skill}
                  </span>
                ))}
              </div>

              {/* NEW: Curated Video Playlist Section */}
              {phase.resources && phase.resources.length > 0 && (
                <div className="mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                    Curated Playlist
                  </h4>
                  <div className="space-y-2">
                    {phase.resources.map((res, rIdx) => (
                      <a 
                        key={rIdx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          phase.status === 'Locked' ? 'bg-transparent border-transparent pointer-events-none' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm group'
                        }`}
                      >
<div className="flex items-center gap-4 overflow-hidden">
                          {/* ENLARGED: Play Button Icon */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${phase.status === 'Locked' ? 'bg-slate-200' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white shadow-sm'}`}>
                            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>
                          </div>
                          <div className="truncate">
                            <p className={`text-sm font-bold truncate ${phase.status === 'Locked' ? 'text-slate-500' : 'text-slate-800'}`}>{res.title}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{res.channel}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0 ml-3">
                          {res.duration}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Active Action Area */}
              {phase.status === "In Progress" && (
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                      <span>Module Progress</span>
                      <span className="text-indigo-600">{phase.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${phase.progress}%` }}></div>
                    </div>
                  </div>
                  <button className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    Continue Learning
                  </button>
                </div>
              )}

              {/* Completed State Action */}
              {phase.status === "Completed" && (
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                  <button className="text-sm font-bold text-slate-400 hover:text-green-600 transition-colors flex items-center gap-1">
                    Review Materials <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
