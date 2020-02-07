self.importScripts('img/data.js');

// Files to cache
var cacheName = 'armandokun-v1';
var appShellFiles = [
    '/cw2_3145/js/',
    '/cw2_3145/js/vue.js',
    '/cw2_3145/js/userForm.js',
    '/cw2_3145/js/provider.js',
    '/cw2_3145/index.html',
    '/cw2_3145/css/styles.css'
];

var courseImages = [];
for (var i = 0; i < images.length; i++) {
    courseImages.push('img/' + images[i].name + '.png');
}

console.log(courseImages)

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

