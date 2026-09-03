import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { generateRoadmap, getRecommendedCourses, generateDailyPlan, calculateProgress } from '../utils/roadmapEngine';
import { generateNotifications } from '../utils/notifications';
import { STREAMS } from '../config/streamConfig';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, weeklyAvailableMinutes, setNotifications } = useLearnerProfile();

  const roadmap = useMemo(() => generateRoadmap(profile), [profile]);
  const recommendedCourses = useMemo(() => getRecommendedCourses(profile).slice(0, 4), [profile]);
  const dailyPlan = useMemo(() => generateDailyPlan(profile), [profile]);
  const overallProgress = useMemo(() => calculateProgress(profile), [profile]);

  useEffect(() => {
    if (profile.onboardingComplete) {
      const existingIds = new Set(profile.notifications.map(n => n.id));
      const notifs = generateNotifications(profile).filter(n => !existingIds.has(n.id));
      if (notifs.length > 0) {
        setNotifications([...notifs, ...profile.notifications]);
      }
    }
  }, []);

  const streamConfig = STREAMS[profile.selectedStream];
  const currentPhase = roadmap?.phases?.find(p => p.status === 'In Progress');
  const nextCourse = recommendedCourses[0];

  const weeklyTarget = weeklyAvailableMinutes;
  const weeklyCompleted = profile.progress?.weeklyMinutesStudied || 0;
  const weeklyPercent = weeklyTarget > 0 ? Math.min(100, Math.round((weeklyCompleted / weeklyTarget) * 100)) : 0;

  const skillGapData = useMemo(() => {
    if (!streamConfig) return [];
    const caps = profile.capabilities || {};
    const allSkills = Object.values(streamConfig.capabilities).flat();
    return allSkills.slice(0, 6).map(skill => ({
      name: skill,
      current: caps[skill] || 0,
      required: 80
    }));
  }, [streamConfig, profile.capabilities]);

  return (
    <div className="p-4 md:p-8 font-sans w-full max-w-7xl mx-auto">
      {/* Welcome Hero */}
      <div className="bg-white rounded-[2rem] p-8 md:p-12 mb-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">AI Career Engine</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            Welcome back, <span className="text-indigo-600">{profile.name || 'Learner'}</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Your personalized {profile.selectedStream || 'learning'} path is ready. 
            {profile.careerGoal ? ` Targeting ${profile.careerGoal}.` : ''}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
            <button 
              onClick={() => navigate('/learning')}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              View My Roadmap
            </button>
            {streamConfig && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{streamConfig.icon}</span>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  {profile.selectedStream} <span className="text-slate-500 font-medium block">{profile.selectedDomains?.length || 0} domains selected</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="relative flex justify-center items-center">
          <img 
            src="/ChatGPT Image Sep 2, 2026, 09_44_10 AM.png" 
            alt="AI Career and Learning Navigator" 
            className="w-full max-w-lg h-auto object-contain"
          />
        </div>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms' }}>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Goal</p>
          <p className="text-sm font-black text-slate-900 truncate">{profile.careerGoal || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stream</p>
          <p className="text-sm font-black text-slate-900 truncate">{profile.selectedStream || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Domain</p>
          <p className="text-sm font-black text-slate-900 truncate">{profile.selectedDomains?.[0] || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</p>
          <p className="text-sm font-black text-slate-900">{profile.targetMonths || 0} months</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms' }}>
        {/* Today's Plan */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Today's Learning</p>
          <div className="text-3xl font-black text-indigo-600 mb-4">{profile.dailyStudyMinutes || 0} min</div>
          <div className="space-y-3">
            {dailyPlan.map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0">{i + 1}</span>
                  <span className="text-xs font-bold text-slate-700 truncate">{task.title}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 flex-shrink-0 ml-2">{task.duration} min</span>
              </div>
            ))}
            {dailyPlan.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Complete onboarding to see your daily plan</p>
            )}
          </div>
        </div>

        {/* Progress + Streak */}
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Progress</p>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-black text-slate-900">{overallProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          {/* Streak */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -right-4 -top-4 text-white/10 text-7xl transform group-hover:scale-110 transition-transform duration-500">🔥</div>
            <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mb-1 relative z-10">Current Streak</p>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-4xl font-black tracking-tighter">{profile.progress?.streakDays || 0}</span>
              <span className="text-orange-200 font-bold">Days</span>
            </div>
          </div>

          {/* Weekly Target */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Weekly Target</p>
            <div className="flex items-baseline gap-1 mb-3">
              <span className="text-lg font-black text-slate-900">{weeklyCompleted}</span>
              <span className="text-slate-400 font-bold text-sm">/ {weeklyTarget} min</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${weeklyPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Next Best Action */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Next Best Action</p>
          {nextCourse ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-xs font-bold text-indigo-600 mb-1">Continue Learning</p>
                <p className="text-sm font-black text-slate-900">{nextCourse.title}</p>
                <p className="text-[10px] font-bold text-slate-500 mt-1">{nextCourse.reason}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span>{nextCourse.difficulty}</span>
                  <span>{nextCourse.duration}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {nextCourse.technologies?.slice(0, 3).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-slate-400">No recommendations yet.</p>
              <p className="text-[10px] text-slate-400 mt-1">Complete onboarding to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '300ms' }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recommended For You</p>
            <h3 className="text-xl font-black text-slate-900">Personalized Courses</h3>
          </div>
          <button 
            onClick={() => navigate('/courses')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View All →
          </button>
        </div>
        {recommendedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedCourses.map((course) => (
              <div key={course.id} className="border border-slate-100 bg-white rounded-2xl p-5 hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-full">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">{course.domain}</span>
                    {course.recommended && (
                      <span className="text-[9px] font-bold text-white px-2 py-1 rounded-sm bg-indigo-600">Recommended</span>
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">No personalized recommendations yet. Complete your profile to generate your learning path.</p>
          </div>
        )}
      </div>

      {/* Skill Gap Visual */}
      {skillGapData.length > 0 && (
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '400ms' }}>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skill Assessment</p>
          <h3 className="text-xl font-black text-slate-900 mb-6">Your {profile.selectedStream} Skills</h3>
          <div className="space-y-4">
            {skillGapData.map((skill) => (
              <div key={skill.name} className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 w-40 truncate">{skill.name}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-3 relative">
                  <div 
                    className="bg-indigo-500 h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${skill.current}%` }}
                  ></div>
                  <div 
                    className="absolute top-0 h-3 w-0.5 bg-red-400" 
                    style={{ left: `${skill.required}%` }}
                    title={`Required: ${skill.required}%`}
                  ></div>
                </div>
                <span className="text-xs font-bold text-slate-500 w-12 text-right">{skill.current}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
