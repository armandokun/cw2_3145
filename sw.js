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
}

var contentToCache = appShellFiles.concat(courseImages);

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});

