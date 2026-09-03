import React from 'react';

const Field = ({ label, type = "text", placeholder, value, onChange, required = false }) => {
  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">
        {label}
      </label>
      <input 
        required={required}
        type={type} 
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all shadow-sm"
      />
    </div>
  );
};

export default Field;
