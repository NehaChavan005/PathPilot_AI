import React from 'react';
import { DAILY_TIME_OPTIONS, DURATION_OPTIONS, DAY_OPTIONS } from '../../config/streamConfig';

const LearningPreferencesStep = ({ 
  dailyStudyMinutes, onDailyTimeChange,
  studyDays, onToggleDay,
  targetMonths, onDurationChange,
  preferredStudyTime, onTimeChange
}) => {
  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm text-center md:w-16">
        ⏱️
      </div>
      
      <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">Learning Preferences</h2>
      <p className="text-slate-500 text-sm mb-8 font-medium max-w-md mx-auto text-center">
        Tell us about your schedule so we can create a realistic learning plan.
      </p>

      <div className="space-y-8 max-w-lg mx-auto">
        {/* Daily Study Time */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            How much time can you study daily?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DAILY_TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onDailyTimeChange(opt.value)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  dailyStudyMinutes === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Study Days */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Which days can you study?
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {DAY_OPTIONS.map(day => {
              const shortDay = day.slice(0, 3);
              const isSelected = studyDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => onToggleDay(day)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border text-center ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-white'
                  }`}
                >
                  {shortDay}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-2 text-center">
            {studyDays.length} days/week · {dailyStudyMinutes * studyDays.length} min/week
          </p>
        </div>

        {/* Preferred Study Time */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Preferred study time
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Morning', 'Afternoon', 'Evening'].map(time => (
              <button
                key={time}
                onClick={() => onTimeChange(time)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  preferredStudyTime === time
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                {time === 'Morning' && '🌅 '}
                {time === 'Afternoon' && '☀️ '}
                {time === 'Evening' && '🌙 '}
                {time}
              </button>
            ))}
          </div>
        </div>

        {/* Target Duration */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Target completion duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onDurationChange(opt.value)}
                className={`p-3 rounded-xl text-xs font-bold transition-all border text-center ${
                  targetMonths === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200 hover:bg-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-2 text-center">
            Total: ~{Math.round(dailyStudyMinutes * studyDays.length * 4.33 * targetMonths / 60)} hours of learning
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPreferencesStep;
