self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) {}

  const title = data.title || 'Self — Yangi habar ✨';
  const options = {
    body: data.body || 'Mubinadan yangi habar keldi!',
    icon: data.icon || '/self-website/icon-192.png',
    badge: data.badge || '/self-website/icon-192.png',
    data: { url: data.url || '/self-website/dashboard.html' },
    vibrate: [200, 100, 200],
    requireInteraction: false,
    tag: 'chat-message'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url
    ? event.notification.data.url
    : '/self-website/dashboard.html';
  event.waitUntil(clients.openWindow(url));
});
