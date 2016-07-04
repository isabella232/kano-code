let mouse;

export default mouse = {
    listeners: [],
    pos: { x: 0, y: 0 },
    storeMousePosition (cb, e) {
        mouse.pos.x = e.clientX;
        mouse.pos.y = e.clientY;
        cb();
    },
    methods: {
        whenMove (callback) {
            let cb = mouse.storeMousePosition.bind(mouse, callback);
            document.addEventListener('mousemove', cb);
            this.listeners.push({
                id: 'mousemove',
                cb
            });
        },
        getX () {
            return mouse.x;
        },
        getY () {
            return mouse.y;
        }
    },

    lifecycle: {
        stop () {
            mouse.listeners.forEach((listener) => document.removeEventListener(listener.id, listener.cb));
        }
    }

};
