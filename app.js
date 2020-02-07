// Service Worker init
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            console.log('[Service Worker: Registered] ', reg)
        })
        .catch((err) => console.log('[Service Worker: Not Registered] ', err))
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
