import React, { useState } from 'react';
import CareerMatchCard from './CareerMatchCard';

const CareerMatchList = ({ matches }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Top Recommendations</h2>
      {matches.map((match, idx) => (
        <CareerMatchCard 
          key={idx}
          title={match.title}
          score={match.score}
          isActive={activeIndex === idx}
          onClick={() => setActiveIndex(idx)}
        />
      ))}
    </div>
  );
};

export default CareerMatchList;
