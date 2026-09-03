import React, { useState, useMemo } from 'react';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { STREAMS } from '../config/streamConfig';

const AllCourses = () => {
  const { profile } = useLearnerProfile();
  const [filterStream, setFilterStream] = useState('All');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [filterDomain, setFilterDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allCourses = useMemo(() => {
    const courses = [];
    Object.entries(STREAMS).forEach(([streamName, config]) => {
      config.recommendedCourses.forEach(course => {
        courses.push({
          ...course,
          stream: streamName,
          streamIcon: config.icon
        });
      });
    });
    return courses;
  }, []);

  const domains = useMemo(() => {
    const d = new Set(allCourses.map(c => c.domain));
    return ['All', ...Array.from(d)];
  }, [allCourses]);

  const filtered = useMemo(() => {
    return allCourses.filter(course => {
      if (filterStream !== 'All' && course.stream !== filterStream) return false;
      if (filterDifficulty !== 'All' && course.difficulty !== filterDifficulty) return false;
      if (filterDomain !== 'All' && course.domain !== filterDomain) return false;
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [allCourses, filterStream, filterDifficulty, filterDomain, searchQuery]);

  const isRecommended = (course) => {
    return course.stream === profile.selectedStream;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-200">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-widest mb-4 inline-block">Course Catalog</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">All Courses</h1>
        <p className="text-slate-500 font-medium text-sm mt-2">
          Browse {allCourses.length} courses across all streams. 
          {profile.selectedStream ? ` Showing recommendations for ${profile.selectedStream}.` : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 mb-6 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Search</label>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Stream</label>
            <div className="flex flex-wrap gap-1.5">
              {['All', ...Object.keys(STREAMS)].map(s => (
                <button key={s} onClick={() => setFilterStream(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    filterStream === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Difficulty</label>
            <div className="flex flex-wrap gap-1.5">
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                <button key={d} onClick={() => setFilterDifficulty(d)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                    filterDifficulty === d ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'
                  }`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Domain</label>
            <select
              value={filterDomain}
              onChange={e => setFilterDomain(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none"
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3 text-[10px] font-bold text-slate-400">
          {filtered.length} course{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(course => (
            <div key={`${course.stream}-${course.id}`} className="border border-slate-100 bg-white rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">{course.domain}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{course.streamIcon}</span>
                  </div>
                  {isRecommended(course) ? (
                    <span className="text-[9px] font-bold text-white px-2 py-1 rounded-sm bg-indigo-600">Recommended</span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-500 px-2 py-1 rounded-sm bg-slate-100">Optional</span>
                  )}
                </div>
                <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                  {course.title}
                </h4>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(course.technologies || []).slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md">{tech}</span>
                  ))}
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md inline-block ${
                  course.difficulty === 'Beginner' ? 'bg-green-50 text-green-700' :
                  course.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {course.difficulty}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {course.duration}
                </span>
                <span className="text-indigo-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                  View →
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center">
          <p className="text-sm text-slate-400">No courses match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default AllCourses;
