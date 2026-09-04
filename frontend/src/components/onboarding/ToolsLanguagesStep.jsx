import React from 'react';
import { STREAMS } from '../../config/streamConfig';

const ToolsLanguagesStep = ({ selectedTools, onToggleTool, selectedStream }) => {
  const streamConfig = selectedStream ? STREAMS[selectedStream] : null;
  const tools = streamConfig?.tools || [];

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm text-center">
        🛠️
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Tools & Languages</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium max-w-md mx-auto text-center">
        Select the programming languages and tools you're already familiar with.
      </p>

      <div className="max-w-lg mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tools.map(tool => {
            const isSelected = selectedTools.includes(tool);
            return (
              <button
                key={tool}
                onClick={() => onToggleTool(tool)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all border flex items-center gap-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:shadow-sm'
                }`}
              >
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {tool}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] font-bold text-slate-400 mt-4 text-center">
          {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
        </p>
      </div>
    </div>
  );
};

export default ToolsLanguagesStep;
