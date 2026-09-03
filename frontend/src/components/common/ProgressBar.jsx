import React from 'react';

const ProgressBar = ({ progress, color = "bg-indigo-600", trackColor = "bg-slate-100", height = "h-1.5" }) => {
  return (
    <div className={`w-full rounded-full overflow-hidden ${trackColor} ${height}`}>
      <div 
        className={`${color} h-full rounded-full transition-all duration-1000 ease-out`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
