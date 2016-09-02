import HardwareAPI from './service/hardware-api';

let gyroAccelerometer;

export default gyroAccelerometer = {
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
        getGyroData (axis) {
            return HardwareAPI.camera.getGyroData()[axis];
        },
        getAccelerometerData (axis) {
            return HardwareAPI.camera.getAccelerometerData()[axis];
        }
    },
    lifecycle: {
        stop () {
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        gyroAccelerometer.api = HardwareAPI.config(opts);
    }
};
