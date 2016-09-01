(function (Kano) {

    Kano.MakeApps = Kano.MakeApps || {};

    const MODULES = {
            lightboard: 'lightboard',
            camera: 'camera'
        },
        ACTIONS = {
            'allon': 'allon',
            'alloff': 'alloff',
            'on': 'on',
            'takePicture': 'imgs/takepicture',
            'lastPicture': 'imgs/last',
            'lastPictureData': 'imgs/last.jpg'
        },
        MAX_CALL_PER_SEC = 2;

    class HardwareAPI {
        constructor () {
            this.callStack = [];
            this.timeoutId = null;
            this.light = {};
            this.light.getPath = () => {
                return this.getPath('lightboard', action);
            };
            this.light.allOn = (color) => {
                this.socketEmit('lightboard:allon', { color });
            };
            this.light.allOff = () => {
                this.socketEmit('lightboard:alloff');
            };
            this.light.singleOn = (index, color) => {
                this.socketEmit('lightboard:one-on', { color, led_id: index });
            };
            this.light.on = (bitmap) => {
                this.socketEmit('lightboard:on', { pixels: bitmap });
            };
            this.light.text = (data) => {
                // Change key names to UK spelling for the Kano 2 server
                this.socketEmit('lightboard:text', data);
            };
            this.light.text = (data) => {
                // Change key names to UK spelling for the Kano 2 server
                this.socketEmit('lightboard:scroll-text', data);
            };
            this.camera = {};
            this.camera.getPath = (action) => {
                return this.getPath('camera', action);
            };
            this.camera.takePicture = () => {
                return new Promise((resolve, reject) => {
                    this.socket.once('camera:takepicture', (data) => {
                        return resolve(data.filename);
                    });
                    this.socketEmit('camera:takepicture');
                });
            };
            this.camera.getPicture = (filename) => {
                return `${this.endpoint}/takenpics/${filename}`;
            };
            this.camera.lastPicture = () => {
                // Just return path to the endpoint
                return this.camera.getPath('lastPictureData');
            };
            this.ledring = {};
            this.ledring.flash = (color, length) => {
                this.socketEmit('ledring:flash', { color, length });
            };
            this.ledring.flashSeries = (moves) => {
                this.socketEmit('ledring:flashseries', { moves });
            };
            this.proximitySensor = {};
            this.proximitySensor.getPath = () => {
                return this.getPath('powerup/proximity-sensor/0', action);
            };
            this.proximitySensor.getProximity = () => {
                return fetch(this.proximitySensor.getPath('proximity'))
                    .then((res) => {
                        if (!res.ok) {
                            console.error("Failed to reach the proximity sensor");
                            return {};
                        }
                        return res.json();
                    })
                    .then((data) => {
                        return data.proximity;
                    })
                    .catch((err) => {
                        console.error('Proximity sensor request failed: ', err);
                    });
            };
        }

        connect () {
            if (!this.socket) {
                this.socket = io.connect(this.endpoint);
            }
        }

        on () {
            this.socket.on.apply(this.socket, arguments);
        }

        removeListener () {
            this.socket.removeListener.apply(this.socket, arguments);
        }

        emit () {
            this.socket.emit.apply(this.socket, arguments);
        }

        config (c) {
            if (c.HOST) {
                let url = 'http://' + c.HOST;
                if (c.PORT) {
                    url += ':' + c.PORT;
                }
                this.endpoint = url;
            } else {
                this.endpoint = c.HARDWARE_API_URL;
            }
        }

        getPath (module, action) {
            return `${this.endpoint}/${MODULES[module]}/${ACTIONS[action]}`;
        }

        socketEmit (name, data) {
            if (this.socket.connected) {
                this.socket.emit(name, data);
            }
        }
    }

    Kano.MakeApps.HardwareAPI = HardwareAPI;

})(window.Kano = window.Kano || {});
