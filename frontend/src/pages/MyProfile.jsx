import React, { useMemo, useState } from 'react';
import { useLearnerProfile } from '../context/LearnerProfileCtx';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../services/apiClient';
import { STREAMS, DAILY_TIME_OPTIONS, DURATION_OPTIONS, DAY_OPTIONS } from '../config/streamConfig';
import Modal from '../components/common/Modal';

const MyProfile = () => {
  const { profile, updateProfile, updateProfileMulti, weeklyAvailableMinutes, addNotification } = useLearnerProfile();
  const { isAuthenticated } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});

  const openEdit = () => {
    setEditData({
      name: profile.name || '',
      selectedStream: profile.selectedStream || '',
      careerGoal: profile.careerGoal || '',
      dailyStudyMinutes: profile.dailyStudyMinutes || 60,
      studyDays: profile.studyDays || [],
      targetMonths: profile.targetMonths || 3,
      preferredStudyTime: profile.preferredStudyTime || 'Morning',
      selectedDomains: profile.selectedDomains || [],
      specializationTags: profile.specializationTags || [],
      notificationSettings: { ...(profile.notificationSettings || {}) }
    });
    setShowEditModal(true);
  };

  const saveEdit = () => {
    updateProfileMulti({
      name: editData.name,
      selectedStream: editData.selectedStream,
      careerGoal: editData.careerGoal,
      dailyStudyMinutes: editData.dailyStudyMinutes,
      studyDays: editData.studyDays,
      targetMonths: editData.targetMonths,
      preferredStudyTime: editData.preferredStudyTime,
      selectedDomains: editData.selectedDomains,
      specializationTags: editData.specializationTags,
      notificationSettings: editData.notificationSettings
    });
    if (isAuthenticated) {
      apiClient('/profile/me', {
        method: 'POST',
        body: JSON.stringify({
          target_role: editData.careerGoal,
          experience_level: profile.experience_level || 'beginner',
          interests: (editData.selectedDomains || []).join(', ')
        })
      }).catch(() => {});
    }
    addNotification({
      id: `profile-update-${Date.now()}`,
      message: 'Your profile has been updated. Recommendations and roadmap have been recalculated.',
      type: 'info'
    });
    setShowEditModal(false);
  };

  const streamConfig = STREAMS[profile.selectedStream];
  const overallProgress = useMemo(() => {
    const completed = profile.progress?.completedCourses?.length || 0;
    const total = streamConfig?.recommendedCourses?.length || 1;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [profile.progress, streamConfig]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen space-y-6 font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl font-black text-indigo-600 shadow-sm relative">
            {(profile.name || 'U').charAt(0).toUpperCase()}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100">
              <span className="w-5 h-5 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              {profile.name || 'User'} <span className="text-indigo-600 text-2xl">✓</span>
            </h1>
            <p className="text-slate-500 font-bold text-sm tracking-wide uppercase mt-1">
              {profile.careerGoal || 'Set your career goal'}
            </p>
            <div className="flex items-center gap-3 mt-4">
              {streamConfig && (
                <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg uppercase tracking-widest border border-indigo-100">
                  {streamConfig.icon} {profile.selectedStream}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button 
          onClick={openEdit}
          className="px-8 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors shadow-sm"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stream</p>
          <p className="text-sm font-black text-slate-900">{profile.selectedStream || 'Not set'}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Study</p>
          <p className="text-sm font-black text-slate-900">{profile.dailyStudyMinutes} min</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Capacity</p>
          <p className="text-sm font-black text-slate-900">{weeklyAvailableMinutes} min</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Duration</p>
          <p className="text-sm font-black text-slate-900">{profile.targetMonths} months</p>
        </div>
      </div>

      {/* Streak Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Learning Progress</h2>
              <p className="text-xl font-black text-slate-900">{overallProgress}% Complete</p>
            </div>
            <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {profile.progress?.completedCourses?.length || 0} courses completed
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div className="bg-indigo-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${overallProgress}%` }}></div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex-1 flex flex-col justify-center">
            <div className="absolute -right-4 -top-4 text-white/10 text-7xl transform group-hover:scale-110 transition-transform duration-500">🔥</div>
            <h3 className="text-[10px] font-bold text-orange-200 uppercase tracking-widest mb-1 relative z-10">Current Streak</h3>
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-5xl font-black tracking-tighter">{profile.progress?.streakDays || 0}</span>
              <span className="text-orange-200 font-bold">Days</span>
            </div>
          </div>
          
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow flex-1 flex flex-col justify-center">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Study Time</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">{Math.round((profile.progress?.totalMinutesStudied || 0) / 60)}</span>
              <span className="text-slate-500 font-bold text-sm">Hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Your Skills</h2>
          <div className="space-y-3">
            {Object.entries(profile.capabilities || {}).map(([skill, level]) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 w-32 truncate">{skill}</span>
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${level}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 w-10 text-right">{level}%</span>
              </div>
            ))}
            {Object.keys(profile.capabilities || {}).length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">Complete onboarding to see your skills</p>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Selected Domains</h2>
          <div className="flex flex-wrap gap-2.5 mb-6">
            {(profile.selectedDomains || []).map((domain, idx) => (
              <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors cursor-default">
                {domain}
              </span>
            ))}
            {(profile.selectedDomains || []).length === 0 && (
              <p className="text-xs text-slate-400">No domains selected</p>
            )}
          </div>

          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Specialization Tags</h2>
          <div className="flex flex-wrap gap-2.5">
            {(profile.specializationTags || []).map((tag, idx) => (
              <span key={idx} className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-bold text-indigo-700">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Preferences */}
      <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-shadow">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Learning Preferences</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Time</p>
            <p className="text-sm font-black text-slate-900">{profile.dailyStudyMinutes} min</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Study Days</p>
            <p className="text-sm font-black text-slate-900">{profile.studyDays?.length || 0}/week</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Time</p>
            <p className="text-sm font-black text-slate-900">{profile.preferredStudyTime || 'Not set'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target</p>
            <p className="text-sm font-black text-slate-900">{profile.targetMonths} months</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tools</p>
            <p className="text-sm font-black text-slate-900">{profile.tools?.length || 0} selected</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Profile">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Name</label>
            <input type="text" value={editData.name || ''} onChange={e => setEditData({...editData, name: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stream</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(STREAMS).map(stream => (
                <button key={stream} onClick={() => setEditData({...editData, selectedStream: stream})}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    editData.selectedStream === stream ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-200'
                  }`}>
                  {stream}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Career Goal</label>
            <input type="text" value={editData.careerGoal || ''} onChange={e => setEditData({...editData, careerGoal: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Study Time</label>
            <div className="grid grid-cols-4 gap-2">
              {DAILY_TIME_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setEditData({...editData, dailyStudyMinutes: opt.value})}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    editData.dailyStudyMinutes === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Study Days</label>
            <div className="grid grid-cols-7 gap-1">
              {DAY_OPTIONS.map(day => (
                <button key={day} onClick={() => {
                  const days = editData.studyDays?.includes(day)
                    ? editData.studyDays.filter(d => d !== day)
                    : [...(editData.studyDays || []), day];
                  setEditData({...editData, studyDays: days});
                }}
                  className={`p-2 rounded-lg text-[10px] font-bold border transition-all ${
                    editData.studyDays?.includes(day) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                  {day.slice(0, 2)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setEditData({...editData, targetMonths: opt.value})}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                    editData.targetMonths === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Notification Settings</label>
            <div className="space-y-2">
              {Object.entries(editData.notificationSettings || {}).filter(([k]) => k !== 'reminderTime').map(([key, val]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer">
                  <span className="text-xs font-bold text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${val ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    onClick={() => setEditData({
                      ...editData,
                      notificationSettings: { ...editData.notificationSettings, [key]: !val }
                    })}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${val ? 'translate-x-5' : 'translate-x-0.5'}`}></div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm">
              Cancel
            </button>
            <button onClick={saveEdit} className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-sm">
              Save Changes
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyProfile;
