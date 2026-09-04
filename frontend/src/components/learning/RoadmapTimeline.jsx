import React, { useState, useCallback } from 'react';
import YouTubePlayer from './YouTubePlayer';
import { extractYouTubeId, getResourcesForTopic } from '../../utils/ytResources';

const RoadmapTimeline = ({ phases, onAdvance }) => {
  const [playerUrl, setPlayerUrl] = useState(null);
  const [playerTitle, setPlayerTitle] = useState('');
  const [reviewPhase, setReviewPhase] = useState(null);
  const [advancing, setAdvancing] = useState(null);

  const openVideo = (res) => {
    if (res && extractYouTubeId(res.url)) {
      setPlayerTitle(res.title || 'Learning Video');
      setPlayerUrl(res.url);
    } else if (res && res.url) {
      window.open(res.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleAdvance = useCallback(async (phase) => {
    setAdvancing(phase.id);
    try {
      await onAdvance(phase);
    } finally {
      setAdvancing(null);
    }
  }, [onAdvance]);

  const getPhaseResources = (phase) => {
    const resources = [];
    (phase.skills || []).forEach(skill => {
      getResourcesForTopic(skill).forEach(r => {
        if (!resources.find(x => x.url === r.url)) resources.push(r);
      });
    });
    (phase.courses || []).forEach(c => {
      if (c.url && !resources.find(x => x.url === c.url)) {
        resources.push({ title: c.title, channel: c.provider, url: c.url, duration: c.duration || 'Course' });
      }
    });
    return resources;
  };

  return (
    <>
      <div className="relative pl-6 md:pl-8 py-4">
        {/* Main Vertical Track Line */}
        <div className="absolute left-[39px] md:left-[47px] top-4 bottom-12 w-1 rounded-full bg-slate-100">
          <div className="w-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ height: `${Math.min(100, (phases.filter(p => p.status === 'Completed').length / Math.max(1, phases.length)) * 100)}%` }}></div>
        </div>

        <div className="space-y-8 relative">
          {phases.map((phase) => {
            const resources = getPhaseResources(phase);
            return (
              <div key={phase.id} className="relative flex items-start group animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Timeline Node */}
                <div className="flex-shrink-0 w-8 flex justify-center z-10 mt-6 mr-6 md:mr-8">
                  <div className={`w-4 h-4 rounded-full border-4 ${
                    phase.status === 'Completed' ? 'bg-green-500 border-white ring-2 ring-green-200' :
                    phase.status === 'In Progress' ? 'bg-indigo-600 border-white ring-2 ring-indigo-200 animate-pulse' :
                    'bg-slate-200 border-white ring-2 ring-slate-100'
                  }`}></div>
                </div>

                {/* Phase Card */}
                <div className={`flex-1 rounded-3xl p-6 md:p-8 transition-all duration-300 border ${
                  phase.status === 'Locked' ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md'
                }`}>
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      {phase.phase} <span className="mx-1">•</span> {phase.duration || `${phase.estimated_weeks || 0} weeks`}
                    </p>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      phase.status === 'Completed' ? 'bg-green-50 text-green-700 border border-green-100' :
                      phase.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {phase.status}
                    </span>
                  </div>

                  <h3 className={`text-xl md:text-2xl font-black mb-4 ${phase.status === 'Locked' ? 'text-slate-500' : 'text-slate-900'}`}>
                    {phase.title}
                  </h3>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {(phase.skills || []).map((skill, idx) => (
                      <span key={idx} className={`text-sm font-bold px-4 py-2 rounded-full border transition-colors ${
                        phase.status === 'Locked'
                          ? 'bg-white text-slate-400 border-slate-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-sm'
                      }`}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Resources (In Progress + Completed phases) */}
                  {phase.status !== 'Locked' && resources.length > 0 && (
                    <div className="mb-6 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        Curated Playlist
                      </h4>
                      <div className="space-y-2">
                        {resources.slice(0, 3).map((res, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => openVideo(res)}
                            className="w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                          >
                            <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm">
                                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>
                              </div>
                              <div className="truncate">
                                <p className="text-sm font-bold truncate text-slate-800">{res.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5 truncate">{res.channel || ''}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md flex-shrink-0 ml-3">{res.duration || 'Watch'}</span>
                          </button>
                        ))}
                        {resources.length > 3 && (
                          <button onClick={() => setReviewPhase(phase)} className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-800 py-2 transition-colors">
                            View all {resources.length} resources →
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* In Progress → Continue + Advance */}
                  {phase.status === 'In Progress' && (
                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6">
                      <div className="flex-1 w-full">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                          <span>Phase Progress</span>
                          <span className="text-indigo-600">{phase.progress || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${phase.progress || 0}%` }}></div>
                        </div>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button
                          onClick={() => setReviewPhase(phase)}
                          className="flex-1 md:flex-none px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-sm"
                        >
                          Review Materials
                        </button>
                        <button
                          onClick={() => handleAdvance(phase)}
                          disabled={advancing === phase.id}
                          className="flex-1 md:flex-none px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md text-sm disabled:opacity-50"
                        >
                          {advancing === phase.id ? 'Completing...' : 'Complete Phase'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completed → Review Materials */}
                  {phase.status === 'Completed' && (
                    <div className="mt-4 pt-4 border-t border-slate-50 flex justify-end">
                      <button onClick={() => setReviewPhase(phase)} className="text-sm font-bold text-slate-400 hover:text-green-600 transition-colors flex items-center gap-1">
                        Review Materials <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Materials Modal */}
      {reviewPhase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setReviewPhase(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reviewPhase.phase}</p>
                <h2 className="text-lg font-black text-slate-900">{reviewPhase.title} — Materials</h2>
              </div>
              <button onClick={() => setReviewPhase(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">✕</button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
              {getPhaseResources(reviewPhase).map((res, idx) => (
                <button
                  key={idx}
                  onClick={() => { openVideo(res); setReviewPhase(null); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-white transition-all text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 22v-20l18 10-18 10z"/></svg>
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-800 truncate">{res.title}</p>
                    <p className="text-[10px] font-bold text-slate-400">{res.channel || ''} • {res.duration || ''}</p>
                  </div>
                </button>
              ))}
              {getPhaseResources(reviewPhase).length === 0 && (
                <p className="text-sm text-slate-500 font-medium text-center py-8">No resources available for this phase yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {playerUrl && <YouTubePlayer url={playerUrl} title={playerTitle} onClose={() => setPlayerUrl(null)} />}
    </>
  );
};

export default RoadmapTimeline;
