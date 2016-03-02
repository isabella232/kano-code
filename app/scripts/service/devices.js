let Devices;

export default Devices = {
    devices: {},
    addDevice (id, device) {
        this.devices[id] = device;
    },
    remove (id) {
        delete this.devices[id];
    },
    setDevices (devices) {
        this.devices = devices;
    },
    get (id) {
        return this.devices[id];
    },
    startAll () {
        return this.callAll('start');
    },
    stopAll () {
        return this.callAll('stop');
    },
    callAll (func) {
        Object.keys(this.devices).forEach((id) => {
            if (this.devices[id][func] && typeof this.devices[id][func] == 'function') {
                this.devices[id][func]();
            }
        });
    }
};
