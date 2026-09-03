import React from 'react';

const CourseCard = ({ course }) => {
  return (
    <div className="border border-slate-100 bg-white rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">{course.provider}</span>
          {course.badge && (
            <span className={`text-[9px] font-bold text-white px-2 py-1 rounded-sm ${course.badgeColor}`}>
              {course.badge}
            </span>
          )}
        </div>
        <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h4>
      </div>
      <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {course.duration}
        </span>
        <span className="text-indigo-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
          View →
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
