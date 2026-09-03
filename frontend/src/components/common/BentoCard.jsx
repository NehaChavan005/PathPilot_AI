import React from 'react';

const BentoCard = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default BentoCard;
