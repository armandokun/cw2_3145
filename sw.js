self.importScripts('img/data.js');

// Files to cache
var cacheName = 'armandokun-v1';
var appShellFiles = [
    '/cw2_3145/js/',
    '/cw2_3145/index.html',
    '/cw2_3145/css/styles.css'
];

var courseImages = [];
for (var i = 0; i < images.length; i++) {
    courseImages.push('data/img/' + images[i].name + '.png');
}
var contentToCache = appShellFiles.concat(courseImages);

// Installing Service Worker
self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});

// Fetching content using Service Worker
self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone()).then(res => {
                        return res
                    });
                });
            });
        })
    );
});
