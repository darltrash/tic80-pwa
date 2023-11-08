const cacheName = "tic80";
const appShellFiles = [
  "icons/16.png",
  "index.html",
  "manifest.json",
  "tic80.js",
  "tic80.wasm"
];

self.addEventListener("install", (e) => {
    console.log("[Service Worker] Install");

    e.waitUntil(
        (async () => {
          const cache = await caches.open(cacheName);
          console.log("[Service Worker] Caching all: app shell and content");
          await cache.addAll(appShellFiles);
        })(),
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
      (async () => {
        const r = await caches.match(e.request);
        console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
        if (r) {
          return r;
        }
        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      })(),
    );
});