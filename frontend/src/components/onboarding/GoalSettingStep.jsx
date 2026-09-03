import React from 'react';
import { STREAMS } from '../../config/streamConfig';

const GoalSettingStep = ({ name, onNameChange, careerGoal, onCareerGoalChange, selectedStream }) => {
  const streamConfig = selectedStream ? STREAMS[selectedStream] : null;
  const careerGoals = streamConfig?.careerGoals || [];

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm text-center">
        🎯
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Set Your Goal</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium max-w-md mx-auto text-center">
        Almost done! Tell us your name and what you're working toward.
      </p>

      <div className="space-y-6 max-w-md mx-auto">
        {/* Name */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm"
          />
        </div>

        {/* Career Goal */}
        {careerGoals.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
              Target Career Role
            </label>
            <div className="space-y-2">
              {careerGoals.map(goal => (
                <button
                  key={goal}
                  onClick={() => onCareerGoalChange(goal)}
                  className={`w-full p-4 rounded-xl text-left transition-all border flex items-center gap-3 ${
                    careerGoal === goal
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-1 ring-indigo-600'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0 transition-colors ${
                    careerGoal === goal ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}></span>
                  <span className={`text-sm font-bold ${careerGoal === goal ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {goal}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom goal if stream not selected or no matching goals */}
        {careerGoals.length === 0 && (
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              Career Goal
            </label>
            <input
              type="text"
              value={careerGoal}
              onChange={(e) => onCareerGoalChange(e.target.value)}
              placeholder="e.g., Full-Stack Developer"
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-sm font-medium shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalSettingStep;
