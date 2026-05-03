/**
 * Cycle Calculation Utilities
 * Centralized logic for period predictions, fertility windows, and ovulation.
 */

/**
 * Robustly converts any date input into a local YYYY-MM-DD string.
 * This ensures that a UTC timestamp from the database like "2026-04-06T18:30:00.000Z"
 * is correctly shifted to the user's local day (e.g., "2026-04-07").
 * @param {Date|string} dateInput 
 * @returns {string} Local YYYY-MM-DD date string
 */
export const getLocalDateString = (dateInput) => {
  if (!dateInput) return null;
  
  // If it's already a strict YYYY-MM-DD string, return it as-is
  if (typeof dateInput === 'string' && dateInput.length === 10 && dateInput.includes('-')) {
     return dateInput;
  }
  
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDateToISO = getLocalDateString; // Keep for backwards compatibility

/**
 * Calculate all predictions based on the last period start date
 * @param {string} lastPeriodDate - Date string or timestamp
 * @param {number} cycleLength - Days between cycles
 * @param {number} periodLength - Duration of period
 * @returns {object} Predictions for next period, ovulation, and fertile window
 */
export const calculatePredictions = (lastPeriodDate, cycleLength = 28, periodLength = 5) => {
  if (!lastPeriodDate) return { ovulation: [], fertile: [], nextPeriod: [] };

  const localDateStr = getLocalDateString(lastPeriodDate);
  if (!localDateStr) return { ovulation: [], fertile: [], nextPeriod: [] };

  const [year, month, day] = localDateStr.split('-').map(Number);
  // Create a local midnight Date object
  const start = new Date(year, month - 1, day);
  
  // 1. Calculate Ovulation (Avg: Mid-point of cycle)
  const ovDate = new Date(start);
  ovDate.setDate(ovDate.getDate() + Math.floor(cycleLength / 2));
  const ovulation = [getLocalDateString(ovDate)];

  // 2. Calculate Fertile Window (Approx 5 days before ovulation + ovulation day)
  const fertile = [];
  for (let i = -5; i <= 0; i++) {
    const d = new Date(ovDate);
    d.setDate(d.getDate() + i);
    fertile.push(getLocalDateString(d));
  }

  // 3. Calculate Next Period
  const nextPeriod = [];
  const nextStart = new Date(start);
  nextStart.setDate(nextStart.getDate() + cycleLength);
  for (let i = 0; i < periodLength; i++) {
    const d = new Date(nextStart);
    d.setDate(d.getDate() + i);
    nextPeriod.push(getLocalDateString(d));
  }

  return { ovulation, fertile, nextPeriod };
};

/**
 * Get the current day of the cycle
 * @param {string} lastPeriodDate - Date string or timestamp
 * @returns {number|null} Current cycle day (1-indexed)
 */
export const getCycleDay = (lastPeriodDate) => {
  if (!lastPeriodDate) return null;
  
  const localDateStr = getLocalDateString(lastPeriodDate);
  if (!localDateStr) return null;
  
  const [year, month, day] = localDateStr.split('-').map(Number);
  const start = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = today - start;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 is the start date
};

/**
 * Calculate days until an event
 * @param {string} targetDate - Date string or timestamp
 * @returns {number} Days remaining
 */
export const daysUntil = (targetDate) => {
  if (!targetDate) return 0;
  
  const localDateStr = getLocalDateString(targetDate);
  if (!localDateStr) return 0;
  
  const [year, month, day] = localDateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
