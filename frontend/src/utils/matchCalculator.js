/**
 * Calculates a Career Match Score based on the user's current skills vs. required skills
 * 
 * @param {Object} userSkills - e.g., { "Python": 90, "SQL": 60 }
 * @param {Array} requiredSkills - e.g., [{ name: "Python", weight: 0.5, required: 80 }]
 * @returns {number} match score (0 - 100)
 */
export const calculateMatchScore = (userSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  requiredSkills.forEach(req => {
    const currentLevel = userSkills[req.name] || 0;
    
    // Calculate how close the user is to the required level
    let skillFulfillment = (currentLevel / req.required) * 100;
    if (skillFulfillment > 100) skillFulfillment = 100; // Cap at 100%

    // Apply weight to this specific skill
    const weight = req.weight || 1;
    totalScore += (skillFulfillment * weight);
    totalWeight += weight;
  });

  return Math.round(totalScore / totalWeight);
};
