// Service Worker init
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
}

// Notifications
const button = document.getElementById("notifications");
button.addEventListener('click', function (e) {
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            randomNotification();
        }
    });
});

function randomNotification() {
    const randomItem = Math.floor(Math.random() * images.length);
    const notifTitle = images[randomItem].name;
    const notifBody = 'Created by Armando';
    const notifImg = 'img/' + images[randomItem].name + '.png';
    const options = {
        body: notifBody,
        icon: notifImg
    };

    var notif = new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
}

// Progressive loading images
let imagesToLoad = document.querySelectorAll('img[data-src]');

let loadImages = function (image) {
    console.log(image);
    image.setAttribute('src', image.getAttribute('data-src'));
    image.onload = function () {
        image.removeAttribute('data-src');
    };
};

if ('IntersectionObserver' in window) {
    console.log('Observation is happening now...');
    const observer = new IntersectionObserver(function (items, observer) {
        items.forEach(function (item) {
            if (item.isIntersecting) {
                loadImages(item.target);
                observer.unobserve(item.target);
            }
        });
    });
    imagesToLoad.forEach(function (img) {
        observer.observe(img);
    });
} else {
    imagesToLoad.forEach(function (img) {
        loadImages(img);
    });
}
