self.importScripts('img/data.js');

// Files to cache
var cacheName = 'armandokun-v1';
var appShellFiles = [
    '/js/',
    '/js/vue.js',
    '/js/userForm.js',
    '/js/provider.js',
    '/index.html',
    '/css/styles.css'
];

var courseImages = [];
for (var i = 0; i < images.length; i++) {
    courseImages.push('img/' + images[i].name + '.png');
    console.log(images[i])
    console.log(images[i].name)
}

var contentToCache = appShellFiles.concat(courseImages);

// Installing Service Worker
self.addEventListener('install', function (e) {
    console.log('[Service Worker: ' + cacheName + '] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[Service Worker: ' + cacheName + '] Caching all: app shell and content');
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
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
