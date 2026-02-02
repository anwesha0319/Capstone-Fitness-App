/**
 * Health calculation utilities
 */

/**
 * Calculate stress level from blood pressure readings
 * @param {number} systolic - Systolic BP in mmHg
 * @param {number} diastolic - Diastolic BP in mmHg
 * @returns {number} Stress level percentage (0-100)
 */
export const calculateStressFromBP = (systolic, diastolic) => {
  // Validate BP values are in realistic range
  if (!systolic || !diastolic || 
      systolic < 70 || systolic > 200 || 
      diastolic < 40 || diastolic > 130) {
    return 0;
  }

  // Formula: stress = ((systolic - 120) + (diastolic - 80)) / 2
  // Optimal BP is 120/80, deviations increase stress
  const stress = ((systolic - 120) + (diastolic - 80)) / 2;
  
  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, stress));
};

/**
 * Get color for stress level based on thresholds
 * @param {number} stressLevel - Stress percentage (0-100)
 * @param {object} colors - Theme colors object
 * @returns {string} Color code
 */
export const getStressColor = (stressLevel, colors) => {
  if (stressLevel < 30) return colors.success;
  if (stressLevel < 60) return colors.warning;
  return colors.error;
};

/**
 * Get stress level description
 * @param {number} stressLevel - Stress percentage (0-100)
 * @returns {string} Description text
 */
export const getStressDescription = (stressLevel) => {
  if (stressLevel < 30) return 'Low - Healthy range';
  if (stressLevel < 60) return 'Moderate - Monitor closely';
  return 'High - Consult healthcare provider';
};
