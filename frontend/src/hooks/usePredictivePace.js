import { useState, useEffect } from 'react';

export const usePredictivePace = (currentProgress, targetDate) => {
  const [pace, setPace] = useState('On Track');

  useEffect(() => {
    // Mock predictive logic
    if (currentProgress > 75) setPace('Ahead of Schedule');
    else if (currentProgress < 30) setPace('Needs Attention');
    else setPace('On Track');
  }, [currentProgress, targetDate]);

  return pace;
};
