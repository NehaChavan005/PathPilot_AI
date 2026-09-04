import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { apiClient } from '../services/apiClient';

const CareerPath = () => {
  const { profile } = useLearnerProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flowchart, setFlowchart] = useState(null);
  const [careers, setCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState('');
  const containerRef = useRef(null);

  const deriveSkills = useCallback(() => {
    const caps = Object.values(profile.capabilities || {}).flat().filter(Boolean);
    const tools = (profile.tools || []).filter(Boolean);
    return [...new Set([...caps, ...tools])];
  }, [profile]);

  const fetchFlowchart = useCallback(async (careerGoal) => {
    if (!careerGoal) return;
    setFlowchart(null);
    setLoading(true);
    setError('');
    try {
      const res = await apiClient('/career/path', {
        method: 'POST',
        body: JSON.stringify({
          career_goal: careerGoal,
          current_skills: deriveSkills(),
        }),
      });
      setFlowchart(res);
    } catch (err) {
      setError(err.detail || err.message || 'Unable to generate career path.');
    } finally {
      setLoading(false);
    }
  }, [deriveSkills]);

  const loadCareers = useCallback(async () => {
    try {
      const res = await apiClient('/career/');
      setCareers((res && res.careers) || []);
    } catch {
      // Non-fatal
    }
  }, []);

  useEffect(() => {
    loadCareers();
  }, [loadCareers]);

  useEffect(() => {
    const goal = profile.careerGoal || profile.targetRole || '';
    if (goal) {
      setSelectedCareer(goal);
      fetchFlowchart(goal);
    } else {
      setLoading(false);
    }
  }, [profile.careerGoal, profile.targetRole, fetchFlowchart]);

  const handleCareerSelect = (career) => {
    setSelectedCareer(career);
    fetchFlowchart(career);
  };

  const statusColors = {
    completed: { bg: 'bg-green-500', border: 'border-green-400', ring: 'ring-green-200', text: 'text-green-700', card: 'bg-green-50 border-green-200' },
    in_progress: { bg: 'bg-indigo-600', border: 'border-indigo-400', ring: 'ring-indigo-200', text: 'text-indigo-700', card: 'bg-indigo-50 border-indigo-200' },
    locked: { bg: 'bg-slate-300', border: 'border-slate-200', ring: 'ring-slate-100', text: 'text-slate-500', card: 'bg-slate-50 border-slate-200 opacity-60' },
  };

  const renderFlowchart = () => {
    if (!flowchart || !flowchart.nodes || flowchart.nodes.length === 0) {
      return (
        <div className="bg-white rounded-[2rem] p-16 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-6">🗺️</div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Select a Career Goal</h2>
          <p className="text-slate-500 text-sm font-medium">Choose a career from the sidebar to see the skill prerequisite flowchart.</p>
        </div>
      );
    }

    const nodes = flowchart.nodes;
    const edges = flowchart.edges || [];

    // Build adjacency: which nodes point to which
    const incoming = {};
    const outgoing = {};
    nodes.forEach(n => { incoming[n.id] = []; outgoing[n.id] = []; });
    edges.forEach(e => {
      if (outgoing[e.from]) outgoing[e.from].push(e.to);
      if (incoming[e.to]) incoming[e.to].push(e.from);
    });

    // Layer assignment via BFS from roots (nodes with no incoming edges)
    const roots = nodes.filter(n => (incoming[n.id] || []).length === 0);
    const layers = {};
    const visited = new Set();
    const queue = roots.map(n => ({ id: n.id, layer: 0 }));
    while (queue.length > 0) {
      const { id, layer } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      layers[id] = layer;
      for (const next of outgoing[id]) {
        const nextLayer = Math.max(layers[next] || 0, layer + 1);
        layers[next] = nextLayer;
        queue.push({ id: next, layer: nextLayer });
      }
    }
    // Assign any unvisited nodes
    nodes.forEach(n => {
      if (!(n.id in layers)) layers[n.id] = 0;
    });

    const maxLayer = Math.max(...Object.values(layers), 0);
    const layerGroups = Array.from({ length: maxLayer + 1 }, () => []);
    nodes.forEach(n => {
      layerGroups[layers[n.id]].push(n);
    });

    return (
      <div ref={containerRef} className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-200 shadow-sm overflow-x-auto">
        <div className="min-w-[700px]">
          {layerGroups.map((group, layerIdx) => (
            <div key={layerIdx} className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-200">{layerIdx + 1}</div>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <div className="flex flex-wrap gap-3 ml-10">
                {group.map(node => {
                  const colors = statusColors[node.status] || statusColors.locked;
                  return (
                    <div key={node.id} className={`relative flex flex-col items-center min-w-[140px] max-w-[180px] rounded-2xl border-2 p-4 transition-all duration-300 ${colors.card} ${node.status === 'in_progress' ? 'shadow-md ring-2 ' + colors.ring : ''}`}>
                      <div className={`w-5 h-5 rounded-full ${colors.bg} border-2 ${colors.border} ring-2 ${colors.ring} mb-2 flex items-center justify-center`}>
                        {node.status === 'completed' && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        )}
                        {node.status === 'locked' && (
                          <svg className="w-2.5 h-2.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        )}
                      </div>
                      <p className={`text-xs font-bold text-center leading-tight ${node.status === 'locked' ? 'text-slate-400' : 'text-slate-800'}`}>{node.title}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{node.difficulty}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{node.hours}h</span>
                      </div>
                      {node.required && <span className="absolute -top-2 -right-2 text-[8px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full border border-indigo-200">Required</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-6 mt-6 ml-10 text-xs font-bold text-slate-500">
            {Object.entries(statusColors).map(([key, c]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${c.bg}`}></div>
                <span className="capitalize">{key.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">🎯</span> Career Path Flowchart
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Dynamic skill prerequisite graph — colored by your progress.
          </p>
        </div>
        {selectedCareer && (
          <button
            onClick={() => fetchFlowchart(selectedCareer)}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-2xl">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar: career list */}
        <div className="lg:col-span-3 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Choose Your Goal</p>
          {careers.map((c) => (
            <button
              key={c.title}
              onClick={() => handleCareerSelect(c.title)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                selectedCareer === c.title
                  ? 'bg-indigo-50 border-indigo-300 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-indigo-200'
              }`}
            >
              <p className={`text-sm font-bold ${selectedCareer === c.title ? 'text-indigo-900' : 'text-slate-800'}`}>{c.title}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{(c.required_skills || []).length} skills required</p>
            </button>
          ))}
        </div>

        {/* Main area: flowchart */}
        <div className="lg:col-span-9">
          {loading && !flowchart ? (
            <div className="bg-white rounded-[2rem] p-16 border border-slate-200 text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm font-bold text-slate-500">Building career flowchart...</p>
            </div>
          ) : (
            renderFlowchart()
          )}

          {/* Stats summary */}
          {flowchart && flowchart.nodes && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-black text-green-600">{flowchart.nodes.filter(n => n.status === 'completed').length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Completed</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-black text-indigo-600">{flowchart.nodes.filter(n => n.status === 'in_progress').length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">In Progress</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-200 text-center">
                <p className="text-2xl font-black text-slate-400">{flowchart.nodes.filter(n => n.status === 'locked').length}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Locked</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPath;
