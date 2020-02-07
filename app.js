// Service Worker init
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
}

var button = document.getElementById("notifications");
button.addEventListener('click', function (e) {
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            randomNotification();
        }
    });
});

function randomNotification() {
    var randomItem = Math.floor(Math.random() * images.length);
    var notifTitle = images[randomItem].name;
    var notifBody = 'Created by Armando';
    var notifImg = 'img/' + images[randomItem].name + '.png';
    var options = {
        body: notifBody,
        icon: notifImg
    }
    var notif = new Notification(notifTitle, options);
    setTimeout(randomNotification, 30000);
}
