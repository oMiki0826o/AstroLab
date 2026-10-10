/*
 * File: sw.js
 * Modification: 2026-10-11 - Scope-safe offline cache with old-cache cleanup.
 */
const CACHE = "astrolab-v0.2.0";
const scope = self.registration.scope;
const shell = ["", "astro/", "astro/tools/", "astro/tonight/", "astro/moon/"].map(path => new URL(path, scope).href);
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(shell)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("astrolab-") && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim(),
  ]));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !request.url.startsWith(scope)) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
      }
      return response;
    }).catch(async () => (await caches.match(request)) ?? new Response("Offline: this page has not been opened before.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } })));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
    }
    return response;
  })));
});
