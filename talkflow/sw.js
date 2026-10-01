/* Offline shell cache. Bump VERSION when files change. */
const VERSION = 'talkflow-v3';
const FILES = ['./', './index.html', './css/app.css', './js/icons.js', './js/data.js', './js/store.js', './js/speech.js', './js/ui.js', './js/views1.js', './js/views2.js', './js/app.js', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }

  e.respondWith(caches.match(e.request).then((cached) => cached || fetch(e.request).then((r) => {
    if (!r || r.status !== 200 || r.type === 'opaque') return r;
    const copy = r.clone();
    caches.open(VERSION).then((c) => c.put(e.request, copy));
    return r;
  })));
});
