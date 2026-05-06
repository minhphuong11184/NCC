messaging.usePublicVapidKey('BKU_tfU4ieEycw997StXzS1qZ7_SYIa8xZf9Mry91P7hhnjCPbRZ1kQUBW56Z-LTYJyXHa4OKe8mLOotJJWNWZ0')
Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');
        // TODO(developer): Retrieve an Instance ID token for use with FCM.
        // ...
    } else {
        console.log('Unable to get permission to notify.');
    }
});
messaging.getToken().then((currentToken) => {
    if (currentToken) {
        console.log(currentToken)
            // sendTokenToServer(currentToken);
            // updateUIForPushEnabled(currentToken);
    } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        // updateUIForPushPermissionRequired();
        // setTokenSentToServer(false);
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // showToken('Error retrieving Instance ID token. ', err);
    // setTokenSentToServer(false);
});