import HardwareAPI from './service/hardware-api';

let camera;

export default camera = {
    methods: {
        connect (info) {
            HardwareAPI.connectToSocket();
            HardwareAPI.socket.on('connect', () => {
                HardwareAPI.socket.emit('camera:init', info);
            });
        },
        on () {
            HardwareAPI.socket.on.apply(HardwareAPI.socket, arguments);
        },
        removeListener () {
            HardwareAPI.socket.removeListener.apply(HardwareAPI.socket, arguments);
        },
        takePicture () {
            return HardwareAPI.camera.takePicture();
        },
        lastPicture () {
            return HardwareAPI.camera.lastPicture();
        },
        getPicture (filename) {
            return HardwareAPI.camera.getPicture(filename);
        }
    },
    lifecycle: {
        stop () {
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        camera.api = HardwareAPI.config(opts);
    }
};
