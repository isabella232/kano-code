import HardwareAPI from './service/hardware-api';

let motionSensor;

export default motionSensor = {
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
        motionSensor.api = HardwareAPI.config(opts);
    }
};
