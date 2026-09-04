import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DEFAULT_PROFILE, STREAMS } from '../config/streamConfig';
import { apiClient, getToken } from '../services/apiClient';

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
  const [hydrated, setHydrated] = useState(false);
  const syncTimer = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  // Load the persisted profile from the backend once authenticated.
  const hydrateFromBackend = useCallback(async () => {
    if (!getToken()) {
      setHydrated(true);
      return;
    }
    try {
      const res = await apiClient('/profile/me');
      if (res && res.preferences) {
        try {
          const stored = JSON.parse(res.preferences);
          if (stored && typeof stored === 'object') {
            setProfile((prev) => ({ ...DEFAULT_PROFILE, ...prev, ...stored }));
          }
        } catch {
          // preferences was not a stored profile; fall through
        }
      }
    } catch {
      // Ignore load errors; keep local profile
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    hydrateFromBackend();
  }, [hydrateFromBackend]);

  // Persist the profile to the backend (debounced) when it changes.
  useEffect(() => {
    if (!getToken() || !hydrated) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      const encoded = JSON.stringify(profile);
      const skills = []
        .concat(Object.values(profile.capabilities || {}))
        .flat()
        .filter(Boolean);
      const interests = [profile.careerGoal, profile.selectedStream, profile.targetRole]
        .filter(Boolean)
        .concat(profile.selectedDomains || [])
        .concat(profile.specializationTags || [])
        .filter(Boolean)
        .join(', ');
      try {
        await apiClient('/profile/me', {
          method: 'POST',
          body: JSON.stringify({
            target_role: profile.careerGoal || profile.targetRole || profile.selectedStream || null,
            experience_level:
              profile.experienceLevel ||
              (profile.progress?.currentPhase ? 'intermediate' : 'beginner'),
            education: profile.education || null,
            interests: interests || null,
            preferences: encoded,
            weekly_hours: Math.max(
              1,
              Math.round((profile.dailyStudyMinutes * (profile.studyDays?.length || 3)) / 60) || 5
            ),
          }),
        });
      } catch {
        // Non-fatal: profile stays in local state
      }
    }, 600);

    return () => {
      if (syncTimer.current) clearTimeout(syncTimer.current);
    };
  }, [profile, hydrated]);

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
      hydrated,
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
