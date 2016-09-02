import HardwareAPI from './service/hardware-api';

let proximitySensor;

export default proximitySensor = {
    methods: {
        connect (info) {
            HardwareAPI.connectToSocket();
        },
        on () {
            HardwareAPI.socket.on.apply(HardwareAPI.socket, arguments);
        },
        removeListener () {
            HardwareAPI.socket.removeListener.apply(HardwareAPI.socket, arguments);
        },
        getProximity () {
            return HardwareAPI.camera.getProximity();
        }
    },
    lifecycle: {
        stop () {
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        proximitySensor.api = HardwareAPI.config(opts);
    }
};
