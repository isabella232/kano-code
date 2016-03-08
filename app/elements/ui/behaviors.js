window.KanoBehaviors = window.KanoBehaviors || {};

/**
 * Behavior common to all UI components
 * Adds the style object that can be used to give the user
 * customization features
 * @type {Object}
 */
window.KanoBehaviors.UIBehavior = {
    properties: {
        // Called userStyle to avoid conflict with DOM `style` attribute
        userStyle: {
            type: Object,
            value: () => {
                return {};
            }
        }
    },
    getPartialStyle (attrs) {
        attrs = attrs || Object.keys(this.userStyle);
        return attrs.reduce((acc, key) => {
            acc += this.userStyle[key] ? `${key}:${this.userStyle[key]};` : '';
            return acc;
        }, '');
    }
};

/**
 * Consumer behavior
 * @type {Object}
 */
window.KanoBehaviors.AsyncConsumer = {
    /**
     * Helps having sync like apis while processing async tasks
     * @param  {Promise|any}   data     Any kind of data you need or a Promise
     *                                  that will resolve this data
     * @param  {Function}      callback The function to call if and when the
     *                                  promise resolves
     * @return {Boolean}                Are we in an async case?
     */
    consume (data, callback) {
        if (data instanceof Promise) {
            data.then(callback.bind(this));
            return true;
        }
        return false;
    }
};
