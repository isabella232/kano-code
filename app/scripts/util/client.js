/*
 * Returns true iff client is a Pi. Please be aware that it is not a foolproof
 * method at the moment
 */
function isPi() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('armv6l') !== -1 ||
           userAgent.indexOf('armv7l') !== -1;
}

/*
 * True when the Kano Code IDE runs embedded inside the Kano Electron App.
 */
function runningInKanoApp() {
    return window.navigator.userAgent.indexOf("Electron") > -1;
}

window.ClientUtil = window.ClientUtil || { isPi, runningInKanoApp };
