const CACHE_NAME = "version-1"; // Name of the cache to store assets
const urlsToCache = ["index.html", "offline.html"]; // List of files to cache

const self = this; // `self` refers to the service worker itself

// Install event - triggered when the service worker is installed
self.addEventListener("install", (event) => {
  // waitUntil ensures the service worker does not install until the caching is complete
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Open cache");
      // Add specified files to the cache
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - triggered when the app makes a network request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Check if the request matches any cached files
    caches.match(event.request).then(() => {
      // Try to fetch the request from the network
      return fetch(event.request).catch(() =>
        // If the network request fails (e.g., no internet), fallback to offline.html
        caches.match("offline.html")
      );
    })
  );
  // The fetch event handles dynamic responses:
  // If the resource is available online, it fetches and updates the cache.
  // If offline, it serves the cached offline page.
});

// Activate event - triggered when the service worker is activated
self.addEventListener("activate", (event) => {
  const cacheWhitelist = []; // Array to hold cache names that should not be deleted
  cacheWhitelist.push(CACHE_NAME); // Add the current cache version to the whitelist

  // waitUntil ensures the service worker does not activate until cleanup is complete
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        // Loop through all cache names
        cacheNames.map((cacheName) => {
          // Delete caches not in the whitelist (outdated versions)
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return Promise.resolve(); // Return a resolved promise for other cases
        })
      )
    )
  );
  // The activate event ensures that only the most recent cache version is retained,
  // and older versions are deleted to free up space.
});
