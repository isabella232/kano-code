/*
 * Simulate click events on element with given x and y coordinates
/*
 * Returns true iff client is a Pi. Please be aware that it is not a foolproof
 * method at the moment
 */
function isPi() {
    let userAgent = window.navigator.userAgent;

    return userAgent.indexOf('armv6l') !== -1 || userAgent.indexOf('armv7l') !== -1;
}

export { isPi };
