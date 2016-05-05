/*
 * DOM utility module
 *
 * A small module containing utilities to work with the DOM
 */
var VENDOR_PREFIXES = [ '', '-ms-', '-webkit-', '-moz-', '-o-' ];

/*
 * Set inline CSS property to element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function addVendorProperty(element, property, value) {
    var prefix;

    for (prefix in VENDOR_PREFIXES) {
        element.style[VENDOR_PREFIXES[prefix] + property] = value;
    }
}

/*
 * Unset inline CSS property of element with all vendor prefixes
 *
 * @param {HTMLElement} element
 * @param {String} property
 * @param {String} value
 */
function removeVendorProperty(element, property) {
    var prefix;

    for (prefix in VENDOR_PREFIXES) {
        element.style[VENDOR_PREFIXES[prefix] + property] = null;
    }
}

window.DOMUtil = window.DOMUtil || { addVendorProperty: addVendorProperty, removeVendorProperty: removeVendorProperty };
