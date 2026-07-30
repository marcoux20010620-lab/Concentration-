/* Défis d'août — service worker : l'app s'ouvre instantanément, même hors-ligne. */
const CACHE = "defis-aout-v1";
const ASSETS = [
  "./",
  "index.html",
  "assets/app.js",
  "assets/app.css",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "icon-180.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

/** Réponse immédiate depuis le cache, rafraîchie en arrière-plan. */
function staleWhileRevalidate(request) {
  return caches.open(CACHE).then((cache) =>
    cache.match(request, { ignoreSearch: true }).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type !== "opaque") {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("index.html", { ignoreSearch: true }).then((r) => r || caches.match("./")),
      ),
    );
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});
