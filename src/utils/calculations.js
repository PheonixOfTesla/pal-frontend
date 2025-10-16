/**
 * Calculate recovery score from various health metrics
 */
export function calculateRecoveryScore(metrics) {
  const {
    hrv = 0,
    restingHR = 0,
    sleep = 0,
    sleepQuality = 0,
    activityLevel = 0
  } = metrics;

  // Normalized scores (0-100)
  const hrvScore = normalizeHRV(hrv);
  const hrScore = normalizeRestingHR(restingHR);
  const sleepScore = normalizeSleep(sleep, sleepQuality);
  const activityScore = normalizeActivity(activityLevel);

  // Weighted average
  const weights = {
    hrv: 0.30,
    hr: 0.25,
    sleep: 0.25,
    activity: 0.20
  };

  const score = (
    hrvScore * weights.hrv +
    hrScore * weights.hr +
    sleepScore * weights.sleep +
    activityScore * weights.activity
  );

  return Math.round(Math.max(0, Math.min(100, score)));
}

function normalizeHRV(hrv) {
  // HRV typically ranges from 20-100ms
  // Higher is better
  if (hrv >= 70) return 100;
  if (hrv >= 50) return 80;
  if (hrv >= 30) return 60;
  if (hrv >= 20) return 40;
  return 20;
}

function normalizeRestingHR(hr) {
  // Resting HR typically 40-100 bpm
  // Lower is better (for athletes)
  if (hr <= 50) return 100;
  if (hr <= 60) return 90;
  if (hr <= 70) return 70;
  if (hr <= 80) return 50;
  return 30;
}

function normalizeSleep(duration, quality) {
  // Duration in minutes, quality 0-100
  const durationScore = Math.min(100, (duration / 480) * 100); // 8 hours optimal
  return (durationScore * 0.6) + (quality * 0.4);
}

function normalizeActivity(level) {
  // Moderate activity is optimal during recovery
  if (level >= 20 && level <= 40) return 100;
  if (level > 40) return Math.max(50, 100 - (level - 40));
  return level * 2.5;
}

/**
 * Calculate training load (acute/chronic ratio)
 */
export function calculateTrainingLoad(recentWorkouts, historicalWorkouts) {
  const acuteLoad = calculateLoad(recentWorkouts.slice(0, 7)); // Last 7 days
  const chronicLoad = calculateLoad(historicalWorkouts.slice(0, 28)); // Last 28 days
  
  if (chronicLoad === 0) return 1;
  
  const ratio = acuteLoad / chronicLoad;
  return Math.round(ratio * 100) / 100;
}

function calculateLoad(workouts) {
  return workouts.reduce((total, workout) => {
    return total + (workout.duration * workout.intensity);
  }, 0);
}

/**
 * Predict next day recovery
 */
export function predictRecovery(currentRecovery, trend, upcomingStress) {
  let prediction = currentRecovery;
  
  // Apply trend
  if (trend === 'improving') prediction += 5;
  if (trend === 'declining') prediction -= 5;
  
  // Apply stress factors
  prediction -= upcomingStress * 10;
  
  return Math.max(0, Math.min(100, Math.round(prediction)));
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Calculate percentage change
 */
export function percentageChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Get trend direction
 */
export function getTrend(current, previous, threshold = 5) {
  const change = percentageChange(current, previous);
  if (change > threshold) return 'up';
  if (change < -threshold) return 'down';
  return 'stable';
}

/**
 * Calculate sleep efficiency
 */
export function calculateSleepEfficiency(totalSleep, timeInBed) {
  if (!timeInBed || timeInBed === 0) return 0;
  return Math.round((totalSleep / timeInBed) * 100);
}

/**
 * Estimate calories burned
 */
export function estimateCalories(activity, duration, weight) {
  // MET values for common activities
  const metValues = {
    walking: 3.5,
    running: 8.0,
    cycling: 6.8,
    swimming: 7.0,
    strength: 3.0,
    yoga: 2.5
  };
  
  const met = metValues[activity] || 4.0;
  return Math.round((met * weight * (duration / 60)) * 1.05);
}