let keyboard;

export default keyboard = {
    listeners: [],
    key: null,
    methods: {
        onDown (key, callback) {
            var cb = function (e) {
                if (e.key === key) {
                    e.preventDefault();
                    callback();
                }
            };
            document.addEventListener('keydown', cb);
            keyboard.listeners.push({
                id: 'keydown',
                cb
            });
        },
        onUp (key, callback) {
            var cb = function (e) {
                if (e.key === key) {
                    e.preventDefault();
                    callback();
                }
            };
            document.addEventListener('keyup', cb);
            keyboard.listeners.push({
                id: 'keyup',
                cb
            });
        }
    },

    lifecycle: {
        stop () {
            keyboard.listeners.forEach((listener) => document.removeEventListener(listener.id, listener.cb));
        }
    }

};
