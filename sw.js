self.importScripts('img/data.js');

// Files to cache
const cacheName = 'armandokun-v1';
const appShellFiles = [
    '/cw2_3145/js/vue.js',
    '/cw2_3145/js/userForm.js',
    '/cw2_3145/js/provider.js',
    '/cw2_3145/index.html',
    '/cw2_3145/css/styles.css'
];

const courseImages = [];
for (let i = 0; i < images.length; i++) {
    courseImages.push('img/' + images[i].name + '.png');
}

const contentToCache = appShellFiles.concat(courseImages);

console.log(contentToCache);

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
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
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        })
    );
});
