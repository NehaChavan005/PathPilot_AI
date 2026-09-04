// Utility functions used across the application

/**
 * Calculates a percentage and ensures it stays between 0 and 100
 */
export const calculatePercentage = (current, total) => {
  if (total === 0) return 0;
  const rawPercentage = Math.round((current / total) * 100);
  return Math.min(Math.max(rawPercentage, 0), 100);
};

/**
 * Formats a date string to a readable format (e.g., "Sep 02, 2026")
 */
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Delays execution (Useful for mocking API loading states)
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Merges class names cleanly (lightweight alternative to clsx)
 */
export const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
