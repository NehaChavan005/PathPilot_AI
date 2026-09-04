import React, { useState, useEffect } from 'react';
import ReadinessChart from '../components/analytics/ReadinessChart';
import SkillHistogram from '../components/analytics/SkillHistogram';
import { apiClient } from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

const SkillAnalytics = () => {
  const { isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [skillProgress, setSkillProgress] = useState([]);
  const [progressSummary, setProgressSummary] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      apiClient('/dashboard').then(setDashboardData).catch(() => {});
      apiClient('/progress/skills').then(setSkillProgress).catch(() => {});
      apiClient('/progress/summary').then(setProgressSummary).catch(() => {});
    }
  }, [isAuthenticated]);

  const totalHours = dashboardData ? Math.round((dashboardData.courses_enrolled * 25) || 0) : 0;
  const assessmentsTaken = dashboardData?.assessments_taken || 0;
  const skillsMastered = skillProgress.filter(s => s.latest_score >= 70).length;
  const readinessScore = progressSummary ? Math.round(progressSummary.overall_progress_percentage * 0.9 + skillsMastered * 3) : 0;

  const kpiStats = [
    { label: "Total Learning Hours", value: `${totalHours}h`, trend: dashboardData ? `Across ${dashboardData.courses_enrolled || 0} courses` : "No data yet", icon: 'hours' },
    { label: "Skills Mastered", value: `${skillsMastered}`, trend: skillProgress.length > 0 ? `${skillProgress.length} skills tracked` : "Complete assessments first", icon: 'skills' },
    { label: "Assessments Passed", value: `${assessmentsTaken}`, trend: assessmentsTaken > 0 ? "Keep progressing" : "Take your first assessment", icon: 'assessments' },
    { label: "Overall Progress", value: `${progressSummary?.overall_progress_percentage || 0}%`, trend: `${progressSummary?.completed_courses || 0} completed`, icon: 'rank' }
  ];

  const iconMap = {
    hours: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" /></svg>
    ),
    skills: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0011.25 19h1.5a3.374 3.374 0 001.353-2.838l-.548-.547z" /></svg>
    ),
    assessments: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    ),
    rank: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" /></svg>
    )
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Skill Analytics
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-2 max-w-xl">
          Comprehensive breakdown of your capability matrix and learning velocity.
        </p>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        {kpiStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all group cursor-default">
            <div className="mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                {iconMap[stat.icon]}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-2">{stat.label}</p>
              <p className="text-[11px] font-bold text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded-md">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '200ms' }}>
        <div className="lg:col-span-4 h-full">
          <ReadinessChart score={readinessScore || 0} />
        </div>
        <div className="lg:col-span-8 h-full">
          <SkillHistogram skillProgress={skillProgress} />
        </div>
      </div>

      {/* Bottom Insights Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '300ms' }}>
        
        {/* Strengths */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-green-200 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Verified Strengths
          </h3>
          <div className="space-y-4">
            {skillProgress.filter(s => s.improvement > 0).length > 0 ? (
              skillProgress.filter(s => s.improvement > 0).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-green-50/50 border border-green-100 rounded-xl">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <div>
                    <span className="text-sm font-bold text-slate-700">{item.skill}</span>
                    <span className="text-[10px] font-bold text-green-600 ml-2">+{item.improvement}%</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Take assessments to see your strengths</p>
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-orange-200 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Current Focus Areas
          </h3>
          <div className="space-y-4">
            {skillProgress.filter(s => s.latest_score < 70).length > 0 ? (
              skillProgress.filter(s => s.latest_score < 70).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    <div>
                      <span className="text-sm font-bold text-slate-700">{item.skill}</span>
                      <span className="text-[10px] font-bold text-orange-600 ml-2">Score: {item.latest_score}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">All skills are performing well!</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SkillAnalytics;
