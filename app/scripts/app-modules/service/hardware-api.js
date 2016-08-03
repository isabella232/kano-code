/* globals Headers */
let HardwareAPI;

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

export default HardwareAPI = {
    callStack: [],
    timeoutId: null,
    connectToSocket () {
        this.socket = io.connect(this.endpoint);
    },
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
    },
    getPath (module, action) {
        return `${this.endpoint}/${MODULES[module]}/${ACTIONS[action]}`;
    },
    /**
     * Throttling method wrapper for fetch
     */
    request () {
        this.callStack.push(arguments);
        return HardwareAPI.nextCall();
    },
    /**
     * Make the next call in the stack to the API
     */
    nextCall () {
        // Currently throttling, do nothing
        if (HardwareAPI.timeoutId) {
            return Promise.resolve();
        }
        // The stack is not empty
        if (HardwareAPI.callStack.length) {
            // Make the stacked call
            return fetch.apply(window, HardwareAPI.callStack.pop())
            // Defer the next call
            .then(HardwareAPI.deferNextCall, HardwareAPI.deferNextCall);
        }
        return Promise.resolve();
    },
    deferNextCall (res) {
        // Defer the next call to the API
        HardwareAPI.timeoutId = setTimeout(() => {
            // Reset the timeout id when done
            HardwareAPI.timeoutId = null;
            // Trigger the next call
            return HardwareAPI.nextCall();
        }, 1000 / MAX_CALL_PER_SEC);
        return res;
    },
    clearAllCalls () {
        clearTimeout(HardwareAPI.timeoutId);
        HardwareAPI.timeoutId = null;
        HardwareAPI.callStack = [];
    },
    light: {
        getPath (action) {
            return HardwareAPI.getPath('lightboard', action);
        },
        allOn (color) {
            HardwareAPI.socket.emit('lightboard:allon', { colour: color });
        },
        allOff () {
            HardwareAPI.socket.emit('lightboard:alloff');
        },
        singleOn (index, color) {
            HardwareAPI.socket.emit('lightboard:one-on', { colour: color, led_id: index });
        },
        on (bitmap) {
            HardwareAPI.socket.emit('lightboard:on', { pixels: bitmap });
        },
        text (data) {
            // Change key names to UK spelling for the Kano 2 server
            HardwareAPI.socket.emit('lightboard:text', {
                text: data.text,
                colour: data.color,
                backgroundColour: data.backgroundColor
            });
        },
        scroll (data) {
            // Change key names to UK spelling for the Kano 2 server
            HardwareAPI.socket.emit('lightboard:scroll-text', {
                text: data.text,
                colour: data.color,
                backgroundColour: data.backgroundColor,
                framePeriod: data.framePeriod
            });
        }
    },
    camera: {
        getPath (action) {
            return HardwareAPI.getPath('camera', action);
        },
        takePicture () {
            return new Promise((resolve, reject) => {
                HardwareAPI.socket.once('camera:takepicture', (data) => {
                    return resolve(data.filename);
                });
                HardwareAPI.socket.emit('camera:takepicture');
            });
        },
        getPicture (filename) {
            return `${HardwareAPI.endpoint}/takenpics/${filename}`;
        },
        lastPicture () {
            /*return fetch(HardwareAPI.camera.getPath('lastPicture'))
                .then((res) => {
                    if (!res.ok) {
                        console.log("Failed to reach camera kit");
                        return null;
                    }

                    return res.json();
                }).then((data) => {
                    console.log(data);
                    return data.filename;
                });*/
            // Just return path to the endpoint
            return HardwareAPI.camera.getPath('lastPictureData');
        }
    }
};
