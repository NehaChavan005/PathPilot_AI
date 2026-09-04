import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { apiClient } from '../services/apiClient';
import ReadinessChart from '../components/analytics/ReadinessChart';
import SkillHistogram from '../components/analytics/SkillHistogram';

const kpiIcons = {
  hours: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" /></svg>
  ),
  skills: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.674M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0011.25 19h1.5a3.374 3.374 0 001.353-2.838l-.548-.547z" /></svg>
  ),
  assessments: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  ),
  rank: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" /></svg>
  )
};

const SkillAnalytics = () => {
  const navigate = useNavigate();
  const { profile } = useLearnerProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [gap, setGap] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [progress, setProgress] = useState(null);

  const skills = useMemo(() => Object.entries(profile.capabilities || {}).filter(([, v]) => v > 0), [profile.capabilities]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      const capSkills = skills.map(([s]) => s);
      const interests = [profile.careerGoal, profile.selectedStream, profile.targetRole]
        .filter(Boolean)
        .concat(profile.selectedDomains || []);
      try {
        const [gapRes, dashRes, progRes] = await Promise.all([
          apiClient('/ai/skill-gaps', {
            method: 'POST',
            body: JSON.stringify({
              target_role: profile.careerGoal || profile.targetRole || profile.selectedStream || undefined,
              current_skills: capSkills,
              target_skills: interests.length ? interests : undefined,
            }),
          }).catch(() => null),
          apiClient('/dashboard').catch(() => null),
          apiClient('/progress/summary').catch(() => null),
        ]);
        if (!active) return;
        setGap(gapRes);
        setDashboard(dashRes);
        setProgress(progRes);
      } catch {
        if (active) setError('Unable to load analytics. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.careerGoal, profile.selectedStream, profile.targetRole]);

  const kWhours = Math.round((profile.progress?.totalMinutesStudied || 0) / 60);
  const mastered = gap ? (gap.matching_skills || []).length : 0;
  const readiness = Math.round(gap?.readiness_score || 0);

  const kpiStats = [
    { label: "Total Learning Hours", value: `${kWhours}h`, trend: `${dashboard ? dashboard.courses_in_progress : 0} courses in progress`, icon: kpiIcons.hours },
    { label: "Skills Mastered", value: String(mastered), trend: `${gap ? gap.total_required : 0} required for role`, icon: kpiIcons.skills },
    { label: "Assessments Taken", value: dashboard ? String(dashboard.assessments_taken) : '0', trend: 'Learner analytics', icon: kpiIcons.assessments },
    { label: "Overall Progress", value: `${Math.round(progress?.overall_progress_percentage || 0)}%`, trend: 'Across all courses', icon: kpiIcons.rank }
  ];

  const histogramData = useMemo(() => {
    const d = skills.slice(0, 6).map(([label, value]) => ({ label, value: Math.min(100, value) }));
    return d.length >= 2 ? d : null;
  }, [skills]);

  const strengths = useMemo(() => {
    const matches = (gap?.matching_skills || []).slice(0, 3);
    if (matches.length) return matches;
    return skills.slice(0, 3).map(([s]) => s);
  }, [gap, skills]);

  const focusAreas = useMemo(() => {
    const gaps = (gap?.skill_gaps || []).slice(0, 3).map((g) => g.skill);
    if (gaps.length) return gaps;
    return Object.keys(profile.capabilities || {})
      .filter((k) => (profile.capabilities[k] || 0) < 40)
      .slice(0, 3);
  }, [gap, profile.capabilities]);

  if (loading) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen font-sans">
        <div className="bg-white rounded-[2rem] p-16 border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-500">Loading skill analytics...</p>
        </div>
      </div>
    );
  }

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

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">{error}</div>
      )}

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
        {kpiStats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all group cursor-default">
            <div className="mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all">
                {stat.icon}
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
          <ReadinessChart score={readiness || 68} label={profile.careerGoal || profile.selectedStream || 'AI/ML Engineer'} />
        </div>
        <div className="lg:col-span-8 h-full">
          <SkillHistogram data={histogramData} />
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
            {(strengths || []).map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-green-50/50 border border-green-100 rounded-xl">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <span className="text-sm font-bold text-slate-700">{item}</span>
              </div>
            ))}
            {(strengths || []).length === 0 && (
              <p className="text-xs text-slate-400">Complete onboarding to identify your strengths.</p>
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-orange-200 transition-colors">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Current Focus Areas
          </h3>
          <div className="space-y-4">
            {(focusAreas || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-orange-50/50 border border-orange-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  <span className="text-sm font-bold text-slate-700">{item}</span>
                </div>
                <button onClick={() => navigate('/learning')} className="text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors shadow-sm">
                  Review
                </button>
              </div>
            ))}
            {(focusAreas || []).length === 0 && (
              <p className="text-xs text-slate-400">No skill gaps detected — you're strongly aligned with your target role!</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SkillAnalytics;
