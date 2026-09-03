import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { generateRoadmap } from '../utils/roadmapEngine';
import RoadmapTimeline from '../components/learning/RoadmapTimeline';

const LearningPath = () => {
  const navigate = useNavigate();
  const { profile } = useLearnerProfile();

  const roadmap = useMemo(() => generateRoadmap(profile), [profile]);

  const phases = useMemo(() => {
    if (!roadmap) return [];

    return roadmap.phases.map((phase, idx) => {
      let status = 'Locked';
      if (idx === 0) status = 'In Progress';
      if (profile.progress?.completedPhases?.includes(phase.id)) status = 'Completed';

      const progress = profile.progress?.phaseProgress?.[phase.id] || 0;

      return {
        ...phase,
        status,
        progress: status === 'In Progress' ? Math.max(10, progress) : undefined,
        skills: phase.skills || [],
        resources: (phase.courses || []).map(c => ({
          title: c.title,
          channel: c.domain,
          url: '#',
          duration: c.duration
        }))
      };
    });
  }, [roadmap, profile.progress]);

  if (!roadmap || phases.length === 0) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm">
            🗺️
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">No Roadmap Yet</h1>
          <p className="text-slate-500 font-medium text-sm mb-8 max-w-md mx-auto">
            Complete your onboarding to generate a personalized learning roadmap tailored to your goals.
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
      <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-200">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-widest mb-4 inline-block">Personalized Roadmap</span>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">{profile.careerGoal || profile.selectedStream}</h1>
        <p className="text-slate-500 font-medium text-sm mt-2 max-w-2xl">
          A {roadmap.totalWeeks}-week learning path for {profile.selectedStream}
          {profile.selectedDomains?.length > 0 ? ` focusing on ${profile.selectedDomains.join(', ')}` : ''}.
          Based on your {profile.dailyStudyMinutes} min/day, {profile.studyDays?.length || 0} days/week schedule.
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            📅 {profile.targetMonths} months
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            ⏱️ {profile.dailyStudyMinutes} min/day
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            📆 {profile.studyDays?.length || 0} days/week
          </div>
        </div>
      </div>
      
      <RoadmapTimeline phases={phases} />
    </div>
  );
};

export default LearningPath;
