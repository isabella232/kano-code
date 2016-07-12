let glob;

export default glob = {
    listeners: {},
    methods: {
        when (name, callback) {
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
                    setTimeout(() => {
                        cb.call({}, data);
                    });
                }
            });
        }
    },
    lifecycle: {
        start () {
            document.addEventListener('update', glob.methods.emit('data-update'));
        },
        stop () {
            glob.listeners = {};
            document.removeEventListener('update', glob.methods.emit('data-update'));
        }
    }
};
