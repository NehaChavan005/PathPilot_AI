import { useState, useEffect } from 'react';

export const useSkillGap = (userSkills, requiredSkills) => {
  const [gaps, setGaps] = useState([]);

  useEffect(() => {
    // Mock comparison logic
    const calculatedGaps = requiredSkills.map(req => {
      const current = userSkills[req.name] || 0;
      return {
        ...req,
        current,
        isMet: current >= req.required
      };
    });
    setGaps(calculatedGaps);
  }, [userSkills, requiredSkills]);

  return gaps;
};
