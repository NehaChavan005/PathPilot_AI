import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { apiClient } from '../services/apiClient';
import RoadmapTimeline from '../components/learning/RoadmapTimeline';

const statusLabel = { in_progress: 'In Progress', locked: 'Locked', completed: 'Completed', not_started: 'Not Started' };
const phaseTitle = {
  'Phase 1: Foundations & Core Prerequisites': 'Foundations',
  'Phase 2: Core Role Competencies': 'Core Skills',
  'Phase 3: Advanced Architecture & Production Systems': 'Specialization',
};

const LearningPath = () => {
  const navigate = useNavigate();
  const { profile } = useLearnerProfile();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [roadmap, setRoadmap] = useState(null);
  const [phaseStatuses, setPhaseStatuses] = useState({});
  const [certificate, setCertificate] = useState(null);
  const [certError, setCertError] = useState('');

  const generateRoadmap = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const targetRole = profile.careerGoal || profile.targetRole || profile.selectedStream || 'Software Engineer';
      const res = await apiClient('/roadmaps/generate', {
        method: 'POST',
        body: JSON.stringify({
          target_role: targetRole,
          weekly_study_hours: Math.max(2, Math.round((profile.dailyStudyMinutes * (profile.studyDays?.length || 3)) / 60) || 10),
        }),
      });
      setRoadmap(res);
      // Fetch persisted phases
      await fetchPhases();
    } catch (err) {
      setError(err.detail || err.message || 'Unable to generate your learning path.');
    } finally {
      setGenerating(false);
      setLoading(false);
    }
  }, [profile]);

  const fetchPhases = useCallback(async () => {
    try {
      const res = await apiClient('/roadmaps/me');
      if (res.phases) setPhaseStatuses(res.phases);
      if (res.roadmap && !roadmap) setRoadmap(res.roadmap);
    } catch {
      // Non-fatal
    }
  }, [roadmap]);

  const advancePhase = useCallback(async (phaseNum) => {
    try {
      if (!roadmap) return;
      const res = await apiClient(`/roadmaps/${roadmap.id}/phases/${phaseNum}/advance`, {
        method: 'POST',
      });
      // Refresh phases
      await fetchPhases();
      return res;
    } catch (err) {
      return { error: err.detail || err.message || 'Cannot advance phase.' };
    }
  }, [roadmap, fetchPhases]);

  const handleGenerateCertificate = useCallback(async () => {
    setCertError('');
    try {
      const res = await apiClient('/roadmaps/certificates/generate', { method: 'POST' });
      setCertificate(res);
    } catch (err) {
      setCertError(err.detail || err.message || 'Cannot generate certificate yet.');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    const init = async () => {
      await fetchPhases();
      if (!roadmap) {
        await generateRoadmap();
      } else {
        setLoading(false);
      }
    };
    init();
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdvance = useCallback(async (phase) => {
    const res = await advancePhase(phase.id);
    if (res && res.error) {
      setError(res.error);
      return;
    }
    // Check if all phases completed
    const totalPhases = roadmap?.milestones?.length || 0;
    const updated = { ...phaseStatuses, [phase.id]: { phase_number: phase.id, status: 'completed', progress_percentage: 100 } };
    const allDone = Array.from({ length: totalPhases }, (_, i) => i + 1).every(
      n => updated[n]?.status === 'completed' || n > totalPhases
    );
    if (allDone) {
      await handleGenerateCertificate();
    }
  }, [advancePhase, roadmap, phaseStatuses, handleGenerateCertificate]);

  const phases = React.useMemo(() => {
    if (!roadmap || !roadmap.milestones) return [];
    return roadmap.milestones.map((milestone) => {
      const phaseId = milestone.milestone_number;
      const persistedStatus = phaseStatuses[phaseId];
      const status = persistedStatus?.status || milestone.status || 'locked';
      const title = phaseTitle[milestone.title] || milestone.title || `Phase ${phaseId}`;
      return {
        id: phaseId,
        phase: `Phase ${phaseId}`,
        title,
        status: statusLabel[status] || 'In Progress',
        rawStatus: status,
        duration: `${milestone.estimated_weeks || 0} Weeks`,
        progress: status === 'completed' ? 100 : persistedStatus?.progress_percentage || (status === 'in_progress' ? 15 : 0),
        skills: milestone.target_skills || [],
        estimated_hours: milestone.estimated_hours,
        estimated_weeks: milestone.estimated_weeks,
        courses: milestone.recommended_courses || [],
        recommended_courses: milestone.recommended_courses || [],
        roadmap_id: roadmap.id,
      };
    });
  }, [roadmap, phaseStatuses]);

  if (!profile || (!loading && !roadmap && phases.length === 0 && !generating && !error)) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] p-12 shadow-sm border border-slate-200 text-center">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6 shadow-sm">🗺️</div>
          <h1 className="text-3xl font-black text-slate-900 mb-4">No Roadmap Yet</h1>
          <p className="text-slate-500 font-medium text-sm mb-8 max-w-md mx-auto">
            Complete your onboarding to generate a personalized learning roadmap tailored to your goals.
          </p>
          <button onClick={() => navigate('/onboarding')} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md">
            Start Onboarding
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-screen font-sans animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-white rounded-[2rem] p-8 mb-8 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-widest mb-4 inline-block">Personalized Roadmap</span>
          <div className="flex gap-2">
            <button onClick={handleGenerateCertificate} className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
              🎓 Get Certificate
            </button>
            <button onClick={generateRoadmap} disabled={generating} className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50">
              {generating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {roadmap?.target_role || roadmap?.title || profile.careerGoal || profile.selectedStream || 'Your Learning Path'}
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-2 max-w-2xl">
          A {roadmap?.estimated_total_weeks || 0}-week learning path. {Object.keys(phaseStatuses).length > 0 ? `${Object.values(phaseStatuses).filter(p => p.status === 'completed').length}/${Object.keys(phaseStatuses).length} phases completed.` : ''}
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">📚 {phases.length} phases</div>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">⏱️ ~{roadmap?.estimated_total_hours || 0} hours</div>
          <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">🎯 {roadmap?.readiness_score || 0}% readiness</div>
        </div>
      </div>

      {/* Certificate banner */}
      {certificate && (
        <div className="mb-6 p-6 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
          <p className="text-lg font-black text-green-800">🎉 Congratulations!</p>
          <p className="text-sm font-bold text-green-700 mt-1">{certificate.message || 'Your certificate has been generated!'}</p>
          <p className="text-xs text-green-600 mt-2">Code: <span className="font-mono">{certificate.certificate_code}</span></p>
          <button onClick={() => navigate('/certifications')} className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors">
            View Certificate
          </button>
        </div>
      )}

      {certError && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-semibold rounded-2xl">{certError}</div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">
          {error}
          <button onClick={generateRoadmap} className="ml-3 text-indigo-600 underline">Try again</button>
        </div>
      )}

      {loading || generating ? (
        <div className="bg-white rounded-[2rem] p-16 border border-slate-200 shadow-sm text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm font-bold text-slate-500">Loading your personalized roadmap...</p>
        </div>
      ) : (
        <RoadmapTimeline phases={phases} onAdvance={handleAdvance} />
      )}
    </div>
  );
};

export default LearningPath;
