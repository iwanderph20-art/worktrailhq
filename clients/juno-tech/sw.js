/* Juno Tech Time Clock — service worker.
 * Its whole job is to receive Web Push messages and raise a lock-screen
 * notification, so a break reminder reaches an employee's phone even when the
 * screen is off and the browser is closed. The scheduled Netlify function
 * (netlify/functions/break-push.js) sends the pushes. */

var KIOSK_URL = '/clients/juno-tech/kiosk.html';

self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) { data = {}; }
  var title = data.title || '⏰ Break reminder';
  var body  = data.body  || 'It is time for your required break.';
  var opts = {
    body: body,
    icon: '/clients/juno-tech/icon-192.png',
    badge: '/clients/juno-tech/icon-192.png',
    tag: data.tag || 'jtl-break',      // same break replaces, never stacks
    renotify: true,                     // but still buzz again on repeat
    requireInteraction: true,           // stay on screen until acknowledged
    vibrate: [500, 200, 500, 200, 500],
    data: { url: KIOSK_URL }
  };
  event.waitUntil(self.registration.showNotification(title, opts));
});

self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || KIOSK_URL;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list){
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.indexOf('/clients/juno-tech/') !== -1 && 'focus' in list[i]) {
          return list[i].focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
