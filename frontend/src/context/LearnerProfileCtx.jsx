import React, { createContext, useContext, useState } from 'react';

const LearnerProfileContext = createContext();

export const LearnerProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    stream: '',
    targetCareer: 'AI/ML Engineer',
    skills: { Python: 50, MachineLearning: 30 },
  });

  const updateProfile = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  return (
    <LearnerProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </LearnerProfileContext.Provider>
  );
};

export const useLearnerProfile = () => useContext(LearnerProfileContext);
