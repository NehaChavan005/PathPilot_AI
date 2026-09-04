import React, { useState, useEffect } from 'react';

const messages = [
  'Analyzing your skills...',
  'Matching your domain...',
  'Calculating your learning capacity...',
  'Creating your roadmap...',
  'Personalizing course recommendations...',
  'Building your personalized PathPilot...'
];

const GeneratingScreen = ({ onComplete }) => {
  const [currentMsg, setCurrentMsg] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg(prev => {
        if (prev >= messages.length - 1) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(progressInterval); return 100; }
        return prev + Math.ceil(100 / (messages.length * 1.2));
      });
    }, 500);

    return () => { clearInterval(interval); clearInterval(progressInterval); };
  }, [onComplete]);

  return (
    <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500 py-12">
      <div className="w-20 h-20 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      
      <h2 className="text-2xl font-black text-slate-900 mb-2">Building Your PathPilot</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium">Personalizing your learning experience...</p>
      
      <div className="w-full max-w-sm mb-6">
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(progress, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="text-sm font-bold text-indigo-600 animate-pulse">
        {messages[currentMsg]}
      </div>
    </div>
  );
};

export default GeneratingScreen;
