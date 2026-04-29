/**
 * Cycle Calculation Utilities
 * Centralized logic for period predictions, fertility windows, and ovulation.
 */

/**
 * Standardize date to ISO 8601 (YYYY-MM-DD)
 * @param {Date|string} date 
 * @returns {string} ISO Date string
 */
export const formatDateToISO = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Calculate all predictions based on the last period start date
 * @param {string} lastPeriodDate - ISO date string
 * @param {number} cycleLength - Days between cycles
 * @param {number} periodLength - Duration of period
 * @returns {object} Predictions for next period, ovulation, and fertile window
 */
export const calculatePredictions = (lastPeriodDate, cycleLength = 28, periodLength = 5) => {
  if (!lastPeriodDate) return { ovulation: [], fertile: [], nextPeriod: [] };

  const start = new Date(lastPeriodDate);
  
  // 1. Calculate Ovulation (Avg: Mid-point of cycle)
  const ovDate = new Date(start);
  ovDate.setDate(ovDate.getDate() + Math.floor(cycleLength / 2));
  const ovulation = [formatDateToISO(ovDate)];

  // 2. Calculate Fertile Window (Approx 5 days before ovulation + ovulation day)
  const fertile = [];
  for (let i = -5; i <= 0; i++) {
    const d = new Date(ovDate);
    d.setDate(d.getDate() + i);
    fertile.push(formatDateToISO(d));
  }

  // 3. Calculate Next Period
  const nextPeriod = [];
  const nextStart = new Date(start);
  nextStart.setDate(nextStart.getDate() + cycleLength);
  for (let i = 0; i < periodLength; i++) {
    const d = new Date(nextStart);
    d.setDate(d.getDate() + i);
    nextPeriod.push(formatDateToISO(d));
  }

  return { ovulation, fertile, nextPeriod };
};

/**
 * Get the current day of the cycle
 * @param {string} lastPeriodDate - ISO date string
 * @returns {number|null} Current cycle day (1-indexed)
 */
export const getCycleDay = (lastPeriodDate) => {
  if (!lastPeriodDate) return null;
  const start = new Date(lastPeriodDate);
  const today = new Date();
  
  // Calculate difference in days
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 is the start date
};

/**
 * Calculate days until an event
 * @param {string} targetDate - ISO date string
 * @returns {number} Days remaining
 */
export const daysUntil = (targetDate) => {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
