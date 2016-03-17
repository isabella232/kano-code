export default class Observable {
    constructor () {
        this.listeners = [];
    }
    subscribe (cb) {
        this.listeners.push(cb);
    }
    update (data) {
        this.listeners.forEach((cb) => {
            if (typeof cb === 'function') {
                cb.call({}, data);
            }
        });
    }
}
