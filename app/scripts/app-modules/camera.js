import HardwareAPI from './service/hardware-api';

let camera;

export default camera = {
    methods: {
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
