import { useEffect, useRef } from 'react';
import { api } from '../../utils/api';
import { useNotifications } from '../../context/NotificationContext';

/**
 * Headless component that manages daily goal reminders, check-in notifications,
 * and cycle event alerts (Period/Ovulation)
 * (Background only - no UI impact)
 */
export default function GoalReminderManager() {
  const { sendBrowserNotification } = useNotifications();
  const lastCheckTime = useRef(null);
  const notifiedGoals = useRef(new Set());
  
  const getNotifiedToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(`cleo_notifs_${today}`);
    return stored ? JSON.parse(stored) : {
      checkin: false,
      checkinFollowup: false,
      periodAlert: false,
      ovulationAlert: false
    };
  };

  const markNotified = (key) => {
    const today = new Date().toISOString().split('T')[0];
    const state = getNotifiedToday();
    state[key] = true;
    localStorage.setItem(`cleo_notifs_${today}`, JSON.stringify(state));
  };

  useEffect(() => {
    // No need for a midnight reset interval anymore since localStorage uses the date as the key

    const checkCycleEvents = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      try {
        const [profile, periods, settings] = await Promise.all([
          api.getProfile(),
          api.getPeriods(),
          api.getReminders()
        ]);

        if (!periods || periods.length === 0) return;

        // Sort periods by start_date descending
        const lastPeriod = periods.sort((a, b) => new Date(b.start_date) - new Date(a.start_date))[0];
        const lastPeriodDate = new Date(lastPeriod.start_date);
        const cycleLength = profile.cycle_length || 28;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate next period date
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(lastPeriodDate.getDate() + cycleLength);

        // 1. Period Approaching Alert
        if (settings.period_approaching && !getNotifiedToday().periodAlert) {
          const reminderDate = new Date(nextPeriodDate);
          reminderDate.setDate(nextPeriodDate.getDate() - (settings.days_before_period || 2));
          reminderDate.setHours(0, 0, 0, 0);

          if (reminderDate.getTime() === today.getTime()) {
            sendBrowserNotification(
              "Period Approaching 🩸",
              `Your period is expected to start in ${settings.days_before_period || 2} days. Be prepared!`,
              { url: '/calendar' }
            );
            markNotified('periodAlert');
          }
        }

        // 2. Ovulation Window Alert
        if (settings.ovulation_approaching && !getNotifiedToday().ovulationAlert) {
          const ovulationDate = new Date(nextPeriodDate);
          ovulationDate.setDate(nextPeriodDate.getDate() - 14);
          ovulationDate.setHours(0, 0, 0, 0);

          if (ovulationDate.getTime() === today.getTime()) {
            sendBrowserNotification(
              "Ovulation Window ✨",
              "Your fertile window is starting today. Track your symptoms!",
              { url: '/calendar' }
            );
            markNotified('ovulationAlert');
          }
        }
      } catch (err) {
        console.error("Cycle event check failed:", err);
      }
    };

    const checkGoalAchievements = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      try {
        const goals = await api.getGoals();
        if (!goals || goals.length === 0) return;

        goals.forEach(goal => {
          const isDone = parseFloat(goal.current_value) >= parseFloat(goal.target_value);
          if (isDone && !goal.notified && !notifiedGoals.current.has(goal.goal_name)) {
            sendBrowserNotification(
              `Goal Achieved! 🌟`,
              `You've reached your daily ${goal.goal_name} goal. Amazing work!`
            );
            api.updateGoalProgress(goal.goal_name, { 
              current_value: goal.current_value, 
              notified: true 
            }).catch(console.error);
            notifiedGoals.current.add(goal.goal_name);
          }
        });
      } catch (err) {
        console.error("Goal achievement check failed:", err);
      }
    };

    const checkDailyReminders = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return;

      const now = new Date();
      const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      if (lastCheckTime.current !== currentHourMin) {
        lastCheckTime.current = currentHourMin;
        
        try {
          const settings = await api.getReminders();
          const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

          const parseMinutes = (t) => {
            if (!t) return -1;
            const parts = t.split(':');
            return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
          };

          if (settings.daily_log) {
            const checkinMinutes = parseMinutes(settings.reminder_time);
            if (checkinMinutes === currentTotalMinutes && !getNotifiedToday().checkin) {
              const goals = await api.getGoals();
              const incompleteGoals = goals.filter(g => parseFloat(g.current_value) < parseFloat(g.target_value));
              
              let body = "Log your symptoms, mood, and notes for today";
              if (incompleteGoals.length > 0) {
                const goalNames = incompleteGoals.map(g => g.goal_name).join(', ');
                body = `Don't forget to log your health status and complete your goals: ${goalNames}`;
              }

              sendBrowserNotification("Daily Check-in 📝", body, { url: '/dashboard' });
              markNotified('checkin');
              
              setTimeout(() => {
                if (!getNotifiedToday().checkinFollowup) {
                  sendBrowserNotification(
                    "Daily Reminder 🌸",
                    "A quick nudge to finish your goals and log your day!",
                    { url: '/dashboard' }
                  );
                  markNotified('checkinFollowup');
                }
              }, 15 * 60 * 1000);
            }
          }
        } catch (err) {
          console.error("Daily reminder check failed:", err);
        }
      }
    };

    const achievementInterval = setInterval(checkGoalAchievements, 30000);
    const reminderInterval = setInterval(checkDailyReminders, 30000);
    const cycleInterval = setInterval(checkCycleEvents, 3600000); // Check cycle events once per hour
    
    checkGoalAchievements();
    checkDailyReminders();
    checkCycleEvents();

    return () => {
      clearInterval(achievementInterval);
      clearInterval(reminderInterval);
      clearInterval(cycleInterval);
    };
  }, [sendBrowserNotification]);

  return null;
}
