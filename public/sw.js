/*
 * CLEO Service Worker for Adaptive Notifications
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification click events
self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  const notification = event.notification;
  const data = notification.data || {};

  notification.close();

  if (action === 'taken') {
    // Log the pill as taken
    event.waitUntil(logPillAction(data.schedule_id, 'taken'));
  } else if (action === 'skip') {
    // Log as skipped
    event.waitUntil(logPillAction(data.schedule_id, 'skipped'));
  } else if (action === 'snooze') {
    // Handle snooze (this would usually be handled by re-scheduling in the app)
    // For now, we open the app
    event.waitUntil(openApp());
  } else {
    event.waitUntil(openApp());
  }
});

async function logPillAction(scheduleId, status) {
  // Note: Service worker can't directly use the 'api' utility because it doesn't have access to localStorage 
  // in the same way (though it can use indexedDB or wait for a message).
  // For simplicity, we'll send a message to the client if one is open, or use a fetch directly.
  
  const clients = await self.clients.matchAll({ type: 'window' });
  if (clients.length > 0) {
    clients[0].postMessage({
      type: 'PILL_ACTION',
      schedule_id: scheduleId,
      status: status
    });
  }
}

async function openApp() {
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const client of clients) {
    if (client.url.includes('/') && 'focus' in client) {
      return client.focus();
    }
  }
  if (self.clients.openWindow) {
    return self.clients.openWindow('/');
  }
}
