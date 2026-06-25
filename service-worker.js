const APP_VERSION = "2.0";
const CACHE_NAME = `ElectricalTools-Portal-v${APP_VERSION}`;
const ASSETS = ["./", "./index.html", "./manifest.json", "./service-worker.js", "./icon-180.svg", "./icon-192.svg", "./icon-512.svg"];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return res;
    }).catch(() => caches.match(event.request).then(r => r || caches.match("./index.html")))
  );
});
