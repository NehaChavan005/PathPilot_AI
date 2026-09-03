import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEFAULT_PROFILE, STREAMS } from '../config/streamConfig';

const LearnerProfileContext = createContext();

const STORAGE_KEY = 'pathpilot_profile';

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PROFILE, ...parsed };
    }
  } catch {}
  return { ...DEFAULT_PROFILE };
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export const LearnerProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const updateProfile = useCallback((key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateProfileMulti = useCallback((updates) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE });
  }, []);

  const completeOnboarding = useCallback((onboardingData) => {
    setProfile(prev => ({
      ...prev,
      ...onboardingData,
      onboardingComplete: true
    }));
  }, []);

  const updateProgress = useCallback((progressUpdates) => {
    setProfile(prev => ({
      ...prev,
      progress: { ...prev.progress, ...progressUpdates }
    }));
  }, []);

  const addNotification = useCallback((notification) => {
    setProfile(prev => {
      const exists = prev.notifications.some(n => n.id === notification.id);
      if (exists) return prev;
      return {
        ...prev,
        notifications: [
          { read: false, timestamp: new Date().toISOString(), ...notification },
          ...prev.notifications
        ]
      };
    });
  }, []);

  const setNotifications = useCallback((notifications) => {
    setProfile(prev => ({ ...prev, notifications }));
  }, []);

  const markNotificationRead = useCallback((notifId) => {
    setProfile(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notifId ? { ...n, read: true } : n
      )
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setProfile(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  }, []);

  const weeklyAvailableMinutes = profile.dailyStudyMinutes * profile.studyDays.length;
  const monthlyAvailableMinutes = weeklyAvailableMinutes * 4.33;
  const totalAvailableMinutes = monthlyAvailableMinutes * profile.targetMonths;

  const getStreamConfig = useCallback(() => {
    return STREAMS[profile.selectedStream] || null;
  }, [profile.selectedStream]);

  return (
    <LearnerProfileContext.Provider value={{
      profile,
      updateProfile,
      updateProfileMulti,
      resetProfile,
      completeOnboarding,
      updateProgress,
      addNotification,
      setNotifications,
      markNotificationRead,
      markAllNotificationsRead,
      weeklyAvailableMinutes,
      monthlyAvailableMinutes,
      totalAvailableMinutes,
      getStreamConfig
    }}>
      {children}
    </LearnerProfileContext.Provider>
  );
};

export const useLearnerProfile = () => {
  const ctx = useContext(LearnerProfileContext);
  if (!ctx) throw new Error('useLearnerProfile must be used within LearnerProfileProvider');
  return ctx;
};
