import React, { useState } from 'react';

const MegaMenu = ({ isVisible }) => {
  const [activeCategory, setActiveCategory] = useState("Generative AI");
  const categories = ["Generative AI", "AI & Machine Learning", "Data Science & Analytics"];

  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-0 mt-4 w-[600px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden flex animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="w-1/3 bg-slate-50 py-4 border-r border-slate-100">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onMouseEnter={() => setActiveCategory(cat)}
            className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${
              activeCategory === cat ? 'bg-white text-indigo-600 border-l-4 border-indigo-600 shadow-sm' : 'text-slate-500 hover:bg-slate-100 border-l-4 border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="w-2/3 p-6 bg-white min-h-[300px]">
        <h3 className="text-lg font-black text-slate-900 mb-4">{activeCategory}</h3>
        <div className="border border-slate-100 p-4 rounded-xl cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all bg-slate-50/50">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Featured</span>
          <h4 className="text-sm font-bold text-indigo-900 mt-1">Applied Generative AI</h4>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
