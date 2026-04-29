import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';

/**
 * Custom hook to handle automatic logout after a period of inactivity.
 * Driven by dynamic admin settings (sessionTimeout and sessionDuration).
 */
export function useAutoLogout() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = useCallback(() => {
    // Clear tokens and info
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('onboardingCompleted');
    
    // Redirect to login
    navigate('/login', { state: { message: 'You have been logged out due to inactivity.' } });
  }, [navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    if (settings.sessionTimeout) {
      // sessionDuration is in minutes, convert to ms
      const durationMs = (settings.sessionDuration || 20) * 60 * 1000;
      timerRef.current = setTimeout(logout, durationMs);
    }
  }, [settings.sessionTimeout, settings.sessionDuration, logout]);

  useEffect(() => {
    const isLoggedIn = !!localStorage.getItem('authToken');
    
    if (isLoggedIn && settings.sessionTimeout) {
      // List of events to listen for to detect activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      
      // Initial timer start
      resetTimer();

      // Add listeners
      events.forEach(event => document.addEventListener(event, resetTimer));

      // Cleanup
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        events.forEach(event => document.removeEventListener(event, resetTimer));
      };
    }
  }, [settings.sessionTimeout, resetTimer]);

  return { resetTimer };
}
