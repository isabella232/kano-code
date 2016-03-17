let glob;

export default glob = {
    listeners: {},
    methods: {
        addEventListener (name, callback) {
            glob.listeners[name] = glob.listeners[name] || [];
            glob.listeners[name].push(callback);
        },
        emit (name, data) {
            let listeners = glob.listeners[name];
            if (!listeners || !Array.isArray(listeners)) {
                return;
            }
            listeners.forEach(function (cb) {
                if (typeof cb === 'function') {
                    cb.call({}, data);
                }
            });
        }
    },
    lifecycle: {
        stop () {
            glob.listeners = {};
        }
    }
};
