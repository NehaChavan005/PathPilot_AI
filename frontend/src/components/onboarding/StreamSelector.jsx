import React from 'react';

const StreamSelector = ({ selectedStream, onSelect }) => {
  const streams = [
    { id: 'AI & ML', icon: '🤖', desc: 'Deep Learning & Neural Networks' },
    { id: 'AI & DS', icon: '📊', desc: 'Data Analytics & Statistics' },
    { id: 'Computer Science', icon: '💻', desc: 'Full-Stack & Systems' }
  ];

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-right-4 duration-500">
      
      {/* Left Column: Perfectly Scaled Image with Soft Background Glow */}
      <div className="hidden md:flex flex-1 relative justify-center items-center h-full min-h-[350px]">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-[60px] opacity-80 animate-pulse-slow"></div>
        <img 
          src="/ChatGPT Image Sep 2, 2026, 09_33_09 AM.png" 
          alt="Stream Selection Illustration" 
          className="relative z-10 w-full max-w-[420px] h-auto object-contain drop-shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-700"
        />
      </div>

      {/* Right Column: Stream Selection Options */}
      <div className="flex-1 w-full">
        <h2 className="text-3xl font-black text-slate-900 mb-2">Choose Your Stream</h2>
        <p className="text-slate-500 text-sm mb-6 font-medium">This calibrates your foundational learning matrix and baseline roadmap.</p>
        
        <div className="space-y-3">
          {streams.map(stream => {
            const isSelected = selectedStream === stream.id;
            return (
              <button 
                key={stream.id}
                onClick={() => onSelect(stream.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border flex items-center gap-4 group ${
                  isSelected 
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-1 ring-indigo-600' 
                    : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                <span className="text-2xl p-3 bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                  {stream.icon}
                </span>
                <div>
                  <span className={`text-base font-black block ${isSelected ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {stream.id}
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    {stream.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default StreamSelector;
