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
            return HardwareAPI.request(HardwareAPI.light.getPath('allon'), {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ colour: color })
            }).then(() => {});
        },
        allOff () {
            return HardwareAPI.request(HardwareAPI.light.getPath('alloff'), {
                method: 'POST'
            }).then(() => {});
        },
        singleOn (index, color) {
            let path = HardwareAPI.light.getPath('on');
            return HardwareAPI.request(`${path}/${index}`, {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ colour: color })
            }).then(() => {});
        },
        on (bitmap) {
            return HardwareAPI.request(HardwareAPI.light.getPath('on'), {
                method: 'POST',
                headers: new Headers({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({ pixels: bitmap })
            }).then(() => {});
        }
    },
    camera: {
        getPath (action) {
            return HardwareAPI.getPath('camera', action);
        },
        takePicture () {
            return fetch(HardwareAPI.camera.getPath('takePicture'))
                .then((res) => {
                    if (!res.ok) {
                        console.log("Failed to reach camera kit");
                        return null;
                    }

                    return res.json();
                }).then((data) => {
                    return data.filename;
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
