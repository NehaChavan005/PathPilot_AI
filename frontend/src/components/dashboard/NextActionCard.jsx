import React from 'react';

const NextActionCard = ({ title, description, buttonText, icon = "🚀" }) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div>
          <h4 className="text-base font-black text-slate-900">{title}</h4>
          <p className="text-xs font-medium text-slate-500">{description}</p>
        </div>
      </div>
      <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm whitespace-nowrap">
        {buttonText}
      </button>
    </div>
  );
};

export default NextActionCard;
