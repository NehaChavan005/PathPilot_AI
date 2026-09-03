import React, { useState } from 'react';

const DomainRatingStep = ({ rating, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  const domainTags = [
    "Artificial Intelligence", "Machine Learning", "Data Engineering", 
    "Software Architecture", "Cloud Computing", "UI/UX Experience"
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="w-full text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm">
        ⭐
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-2">Rate Your Domain Interest</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium max-w-md mx-auto">
        Help our AI recommendation engine calibrate content weight by rating your confidence in your chosen domain.
      </p>

      {/* Interactive Star Rating */}
      <div className="flex justify-center gap-3 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-4xl transition-transform hover:scale-110 focus:outline-none"
          >
            <span className={`${(hoverRating || rating) >= star ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}>
              ★
            </span>
          </button>
        ))}
      </div>

      {/* Domain Focus Tags */}
      <div className="text-left max-w-lg mx-auto">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
          Select Primary Specialization Tags
        </label>
        <div className="flex flex-wrap justify-center gap-2">
          {domainTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DomainRatingStep;
