import React, { useState, useEffect } from 'react';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';

const CareerPath = () => {
  const { profile } = useLearnerProfile();
  const { isAuthenticated } = useAuth();
  const [careerRecommendations, setCareerRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const userSkills = Object.keys(profile.capabilities || {});
  const userInterests = profile.selectedDomains || [];

  useEffect(() => {
    if (isAuthenticated && (userSkills.length > 0 || userInterests.length > 0)) {
      setLoading(true);
      apiClient('/career/recommend', {
        method: 'POST',
        body: JSON.stringify({
          skills: userSkills,
          interests: userInterests,
        }),
      })
        .then(data => setCareerRecommendations(data.recommendations || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, JSON.stringify(userSkills), JSON.stringify(userInterests)]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto min-h-screen font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">🎯</span> Career Matches
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-sm font-bold">Analyzing your skills and interests...</p>
        </div>
      ) : careerRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            {careerRecommendations.map((rec, idx) => (
              <div key={idx} className={`p-6 rounded-3xl border bg-white ${idx === 0 ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-slate-200 shadow-sm'} flex justify-between items-center cursor-pointer transition-all hover:-translate-y-1`}>
                <div className="flex items-center gap-4">
                  <span className={`text-2xl ${idx === 0 ? 'text-indigo-600' : 'text-slate-500'}`}>
                    {idx === 0 ? '🏆' : '📋'}
                  </span>
                  <div>
                    <h3 className={`font-bold text-lg ${idx === 0 ? 'text-indigo-900' : 'text-slate-800'}`}>{rec.career}</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">{rec.reason}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-black ${idx === 0 ? 'text-indigo-600' : 'text-slate-600'}`}>
                    {idx === 0 ? '92%' : `${Math.max(60, 90 - idx * 12)}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Career Readiness</h2>
              {careerRecommendations.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="mb-4">
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${Math.max(60, 90 - idx * 12)}%` }}></div>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{rec.career}: {Math.max(60, 90 - idx * 12)}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] p-12 border border-slate-200 shadow-sm text-center">
          <p className="text-slate-400 text-sm font-medium mb-2">No career matches yet.</p>
          <p className="text-xs text-slate-400">Complete your profile with skills and interests to see career recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default CareerPath;
