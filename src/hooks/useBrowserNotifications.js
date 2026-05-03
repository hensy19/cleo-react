import { useCallback } from 'react';

/**
 * Hook to manage native browser notifications
 */
export const useBrowserNotifications = () => {
  /**
   * Request permission for browser notifications
   * @returns {Promise<string>} Permission status
   */
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notifications');
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, []);

  /**
   * Send a browser notification
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {Object} options - Notification options (icon, etc.)
   */
  const sendNotification = useCallback(async (title, body, options = {}) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return null;
    }

    const defaultOptions = {
      body,
      icon: '/logo.png',
      badge: '/logo.png', // Small icon for mobile
      ...options
    };

    try {
      // Use Service Worker if available for advanced features like 'actions'
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        if (registration) {
          return registration.showNotification(title, defaultOptions);
        }
      }

      // Fallback to basic notification if SW not ready/available
      const n = new Notification(title, defaultOptions);
      n.onclick = () => {
        window.focus();
        if (options.onClick) options.onClick();
        n.close();
      };
      return n;
    } catch (error) {
      console.error('Error sending browser notification:', error);
      return null;
    }
  }, []);

  /**
   * Check current permission status
   * @returns {string} current permission
   */
  const getPermissionStatus = useCallback(() => {
    return 'Notification' in window ? Notification.permission : 'unsupported';
  }, []);

  return {
    requestPermission,
    sendNotification,
    getPermissionStatus
  };
};
