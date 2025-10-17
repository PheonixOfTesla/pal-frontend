// src/components/jarvis/VoiceCommandRouter.jsx - Voice Command Interpreter
import { useEffect, useRef } from 'react';
import { workoutService, goalService, calendarService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function VoiceCommandRouter({ transcript, intelligenceData, onShowOverlay }) {
  const user = useAuthStore(state => state.user);
  const lastTranscriptRef = useRef('');

  useEffect(() => {
    if (!transcript || transcript === lastTranscriptRef.current) return;
    
    lastTranscriptRef.current = transcript;
    
    // Parse command from transcript
    const lowerTranscript = transcript.toLowerCase();
    
    // Recovery commands
    if (lowerTranscript.includes('recovery') || lowerTranscript.includes('how am i') || lowerTranscript.includes('readiness')) {
      handleRecoveryCommand();
    }
    
    // Sleep commands
    else if (lowerTranscript.includes('sleep') || lowerTranscript.includes('last night')) {
      handleSleepCommand();
    }
    
    // Workout commands
    else if (lowerTranscript.includes('workout') || lowerTranscript.includes('training') || lowerTranscript.includes('exercise')) {
      handleWorkoutCommand();
    }
    
    // Calendar commands
    else if (lowerTranscript.includes('calendar') || lowerTranscript.includes('schedule') || lowerTranscript.includes('meeting') || lowerTranscript.includes('today')) {
      handleCalendarCommand();
    }
    
    // Goals commands
    else if (lowerTranscript.includes('goal') || lowerTranscript.includes('progress') || lowerTranscript.includes('achievement')) {
      handleGoalsCommand();
    }
    
    // Stats/overview commands
    else if (lowerTranscript.includes('stats') || lowerTranscript.includes('overview') || lowerTranscript.includes('summary')) {
      handleStatsCommand();
    }
    
  }, [transcript]);

  const handleRecoveryCommand = () => {
    const metrics = intelligenceData?.metrics || {};
    const healthMetrics = intelligenceData?.healthMetrics || {};
    
    onShowOverlay('recovery', {
      recoveryScore: metrics.recoveryScore || 0,
      trend: metrics.recoveryScore > 70 ? 'up' : metrics.recoveryScore > 50 ? 'stable' : 'down',
      components: {
        hrv: { value: metrics.hrv || 0, weight: 35 },
        restingHR: { value: metrics.restingHR || 0, weight: 25 },
        sleep: { value: metrics.sleep || 0, weight: 25 },
        breathing: { value: healthMetrics?.recovery?.breathing || 0, weight: 15 }
      },
      recommendation: getRecoveryRecommendation(metrics.recoveryScore),
      hrvData: generateHRVData(metrics.hrv),
      hrvBaseline: 60
    });
  };

  const handleSleepCommand = () => {
    const healthMetrics = intelligenceData?.healthMetrics || {};
    const metrics = intelligenceData?.metrics || {};
    
    onShowOverlay('sleep', {
      total: metrics.sleep || 0,
      deep: healthMetrics?.sleep?.deep || 0,
      rem: healthMetrics?.sleep?.rem || 0,
      light: healthMetrics?.sleep?.light || 0,
      awake: healthMetrics?.sleep?.awake || 0,
      efficiency: healthMetrics?.sleep?.efficiency || 0,
      quality: healthMetrics?.sleep?.quality || 0
    });
  };

  const handleWorkoutCommand = async () => {
    if (!user?._id) return;
    
    try {
      const response = await workoutService.getWorkouts(user._id, { limit: 5, sort: '-date' });
      
      if (response.success) {
        onShowOverlay('workouts', {
          workouts: response.workouts || []
        });
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const handleCalendarCommand = async () => {
    if (!user?._id) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await calendarService.getEvents(user._id, {
        startDate: today,
        endDate: today
      });
      
      if (response.success) {
        onShowOverlay('calendar', {
          events: response.events || []
        });
      }
    } catch (error) {
      console.error('Error fetching calendar:', error);
    }
  };

  const handleGoalsCommand = async () => {
    if (!user?._id) return;
    
    try {
      const response = await goalService.getGoals(user._id);
      
      if (response.success) {
        const activeGoals = (response.goals || []).filter(g => g.status === 'active');
        onShowOverlay('goals', {
          goals: activeGoals
        });
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleStatsCommand = () => {
    const metrics = intelligenceData?.metrics || {};
    
    onShowOverlay('stats', {
      steps: metrics.steps || 0,
      restingHR: metrics.restingHR || 0,
      recoveryScore: metrics.recoveryScore || 0,
      workoutsThisWeek: metrics.workoutsThisWeek || 0
    });
  };

  return null; // This is a logic-only component
}

// Helper functions

function getRecoveryRecommendation(score) {
  if (score >= 70) {
    return "Your body is fully recovered. This is a great day for high-intensity training or pushing your limits.";
  } else if (score >= 50) {
    return "You're moderately recovered. Stick to moderate intensity workouts and avoid pushing to failure.";
  } else if (score >= 30) {
    return "Your recovery is low. Consider active recovery like walking or yoga. Avoid intense training today.";
  } else {
    return "Your recovery is critical. Your body needs rest. I recommend taking today as a complete rest day.";
  }
}

function generateHRVData(currentHRV) {
  // Generate 7 days of HRV data for visualization
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 15;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.max(20, Math.min(100, currentHRV + variation))
    });
  }
  return data;
}