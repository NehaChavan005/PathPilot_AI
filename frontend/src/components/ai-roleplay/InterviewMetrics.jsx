import React from 'react';

const InterviewMetrics = () => {
  const metrics = [
    { label: "Technical Accuracy", score: 85 },
    { label: "Communication", score: 92 },
    { label: "Problem Solving", score: 78 }
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-right-8 duration-500">
      <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
        Real-Time Evaluation
      </h3>
      
      <div className="space-y-5">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
              <span>{metric.label}</span>
              <span className="text-indigo-600">{metric.score}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-1000" 
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewMetrics;
