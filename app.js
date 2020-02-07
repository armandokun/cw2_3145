// Service Worker init
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            console.log('[Service Worker: Registered] ', reg);
        })
        .catch((err) => console.log('[Service Worker: Not Registered] ', err))
}

// Notifications
const button = document.getElementById("notifications");
button.addEventListener('click', function (e) {
    Notification.requestPermission().then(function (result) {
        if (result === 'granted') {
            navigator.serviceWorker.getRegistration()
                .then(reg => reg.showNotification('Notifications Are Turned On'));
            // since it's not needed anymore
            button.remove();
        }
    });
});

function displayNotification(title) {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
            reg.showNotification(title);
        });
    }
}

// displayNotification('Test1');
