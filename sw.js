const CACHE_NAME = "b9pakistanapp.com-assets-v1";
const ASSET_URLS = [
  "/styles.css",
  "/script.js",
  "/assets/b9-logo.gif",
  "/assets/b9-logo-192.png",
  "/assets/b9-logo-512.png",
  "/site.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSET_URLS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!ASSET_URLS.includes(url.pathname)) return;
  event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
});