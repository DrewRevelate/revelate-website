// Service Worker for Revelate Operations Website
const CACHE_NAME = 'revelate-website-v2';

// Assets to cache on install - UPDATED for directory-based URLs
const CORE_ASSETS = [
  '/',
  '/services',
  '/approach',
  '/about',
  '/contact',
  '/case-studies',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/assets/images/logo.png',
  '/assets/images/revelate-spiral-logo.png',
  '/offline'
];

// Install event - cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching core assets');
        return cache.addAll(CORE_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - cache-first strategy with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests and browser extension requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise try to fetch from network
        return fetch(event.request)
          .then(networkResponse => {
            // Don't cache non-successful responses or browser sync
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response - one to return, one to cache
            const responseToCache = networkResponse.clone();
            
            // Cache the new resource if it's a relevant asset
            if (shouldCache(event.request.url)) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            
            return networkResponse;
          })
          .catch(error => {
            // If both cache and network fail, return a basic offline page
            if (event.request.headers.get('Accept').includes('text/html')) {
              return caches.match('/offline');
            }
            
            return new Response('Network error occurred', {
              status: 408,
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Helper function to determine if we should cache a specific URL
function shouldCache(url) {
  // Don't cache Google Analytics, other third-party requests
  if (url.includes('analytics') || url.includes('googletagmanager')) {
    return false;
  }
  
  // Only cache our own origin and CDN assets
  if (url.includes(self.location.origin) || 
      url.includes('cdnjs.cloudflare.com') || 
      url.includes('fonts.googleapis.com') || 
      url.includes('fonts.gstatic.com')) {
    return true;
  }
  
  return false;
}
