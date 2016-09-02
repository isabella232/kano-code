import HardwareAPI from './service/hardware-api';

let gestureSensor;

export default gestureSensor = {
    methods: {
        connect (info) {
            HardwareAPI.connectToSocket();
        },
        on () {
            HardwareAPI.socket.on.apply(HardwareAPI.socket, arguments);
        },
        removeListener () {
            HardwareAPI.socket.removeListener.apply(HardwareAPI.socket, arguments);
        }
    },
    lifecycle: {
        stop () {
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        gestureSensor.api = HardwareAPI.config(opts);
    }
};
