import React from 'react';

const BackgroundGlow = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
    </div>
  );
};

export default BackgroundGlow;
