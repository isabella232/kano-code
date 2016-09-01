import HardwareAPI from './service/hardware-api';

let camera;

export default camera = {
    methods: {
        connect (info) {
            return new Promise((resolve, reject) => {
                HardwareAPI.connectToSocket();
                HardwareAPI.socket.on('connect', () => {
                    HardwareAPI.socket.emit('camera:init', info);
                    return resolve();
                });
            });
        },
        flash (color, length) {
            return HardwareAPI.ledring.flash(color, length);
        },
        on () {
            HardwareAPI.socket.on.apply(HardwareAPI.socket, arguments);
        },
        onPictureTaken (cb) {
            this.on('camera:takepicture', cb);
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
