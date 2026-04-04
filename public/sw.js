// Service Worker for offline support
const CACHE_NAME = 'suomi-ai-tutor-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/_next/static/css/main.css',
  '/_next/static/js/main.js',
  '/_next/static/media/*',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).catch((err) => {
      console.error('[Service Worker] Failed to cache assets:', err);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API calls - let them go to network
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Return cached version if available
      if (cached) {
        // Fetch fresh version in background for next time
        fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
        }).catch(() => {
          // Network failed, cached version is already being served
        });
        return cached;
      }
      
      // Not in cache, fetch from network
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        
        // Cache successful responses
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        
        return response;
      }).catch((err) => {
        console.error('[Service Worker] Fetch failed:', err);
        // Return offline fallback if available
        return caches.match('/offline.html');
      });
    })
  );
});

// Background sync for offline form submissions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // Sync user progress data when connection returns
  console.log('[Service Worker] Syncing progress data');
}

// Push notifications support
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'Time to practice Finnish!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'suomi-reminder',
    requireInteraction: true,
  };
  
  event.waitUntil(
    self.registration.showNotification('SuomiAI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
