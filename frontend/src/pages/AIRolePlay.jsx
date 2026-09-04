import React, { useState, useEffect } from 'react';
import ChatInterface from '../components/ai-roleplay/ChatInterface';
import { apiClient } from '../services/apiClient';

const AIRolePlay = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('technical_interviewer');
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await apiClient('/roleplay/roles');
        setRoles((res && res.roles) || []);
      } catch {
        setRoles([
          { id: 'technical_interviewer', label: 'Technical Interview', description: 'Practice technical questions' },
          { id: 'hr_interviewer', label: 'HR Interview', description: 'Behavioral & situational questions' },
          { id: 'career_mentor', label: 'Career Mentor', description: 'Personalized career guidance' },
          { id: 'skill_assessor', label: 'Skill Assessment', description: 'Verify your knowledge level' },
        ]);
      }
    };
    fetchRoles();
  }, []);

  const handleNewSession = () => {
    setSessionId(null);
  };

  const roleLabels = Object.fromEntries((roles.length ? roles : [
    { id: 'technical_interviewer', label: 'Technical Interview' },
    { id: 'hr_interviewer', label: 'HR Interview' },
    { id: 'career_mentor', label: 'Career Mentor' },
    { id: 'skill_assessor', label: 'Skill Assessment' },
  ]).map(r => [r.id, r.label]));

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto font-sans flex flex-col h-[calc(100vh-80px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-2">
             <img src="/ai-education-icon.png" alt="AI Roleplay" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">AI Role Play</h1>
            <p className="text-sm font-bold text-slate-500">Interview Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedRole}
            onChange={(e) => { setSelectedRole(e.target.value); handleNewSession(); }}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {(roles.length ? roles : [
              { id: 'technical_interviewer', label: 'Technical Interview' },
              { id: 'hr_interviewer', label: 'HR Interview' },
              { id: 'career_mentor', label: 'Career Mentor' },
              { id: 'skill_assessor', label: 'Skill Assessment' },
            ]).map(r => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <button onClick={handleNewSession} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
            New Session
          </button>
        </div>
      </div>
      <div className="flex-1">
        <ChatInterface
          role={selectedRole}
          roleLabel={roleLabels[selectedRole] || 'AI Interviewer'}
          sessionId={sessionId}
          onSessionCreated={setSessionId}
        />
      </div>
    </div>
  );
};

export default AIRolePlay;
