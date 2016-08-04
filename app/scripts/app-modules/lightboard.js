import HardwareAPI from './service/hardware-api';

let lightboard;

export default lightboard = {
    backgroundColor: '#000000',
    lights: new Array(128),
    shapes: {},
    debounceId: null,
    bitmap: new Array(128),
    getIndex (x, y) {
        return lightboard.coordToIndex(x, y, 16);
    },
    coordToIndex (x, y, width) {
        return width * parseInt(y) + parseInt(x);
    },
    indexToCoord (index, width) {
        return {
            x: index % width,
            y: Math.floor(index / width)
        };
    },
    updateBitmap () {
        // Debounce the call to hit a max of 30 calls per sec
        return lightboard.requestLightboardFrame(1000 / 30)
            .then(_ => {
                console.timeEnd('send to server');
                console.time('send to server');
                let shape,
                    shapesBitmap = new Array(128);
                // Generate a bitmap combining background color, shapes and lights
                Object.keys(lightboard.shapes).forEach((key) => {
                    shape = lightboard.shapes[key];
                    if (shape.type === 'rectangle') {
                        for (let x = shape.x; x < shape.x + shape.width; x++) {
                            for (let y = shape.y; y < shape.y + shape.height; y++) {
                                shapesBitmap[lightboard.getIndex(x, y)] = shape.color;
                            }
                        }
                    } else if (shape.type === 'circle') {
                        let distance,
                            index;
                        for (let x = -shape.radius; x <= shape.radius; x++) {
                            for (let y = -shape.radius; y <= shape.radius; y++) {
                                distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                                if (shape.radius >= distance &&
                                    shape.x + x <= 15 &&
                                    shape.x + x >= 0 &&
                                    shape.y + y >= 0 &&
                                    shape.y + y <= 7) {
                                    index = lightboard.getIndex(shape.x + x, shape.y + y);
                                    shapesBitmap[index] = shape.color;
                                }
                            }
                        }
                    } else if (shape.type === 'frame') {
                        shape.bitmap.forEach((color, index) => {
                            let coord = lightboard.indexToCoord(index, shape.width);
                            coord.x += shape.x;
                            coord.y += shape.y;
                            shapesBitmap[lightboard.getIndex(coord.x, coord.y)] = color;
                        });
                    }
                });
                for (let i = 0; i < 128; i++) {
                    lightboard.bitmap[i] = lightboard.lights[i] || shapesBitmap[i] || lightboard.backgroundColor;
                }
                return lightboard.bitmap;
            });
    },
    drawLights () {
        return HardwareAPI.light.on(lightboard.bitmap.slice(0));
    },
    requestLightboardFrame(wait) {
        return new Promise((resolve, reject) => {
            let currentTime = new Date();
            this.lastCall = this.lastCall || new Date();
            if (currentTime - this.lastCall >= wait) {
                this.lastCall = currentTime;
                resolve();
            } else {
                reject();
            }
        });
    },
    /**
     * Call the drawLight methods on the next event loop. Allows to do a set of actions but call the api only once
     */
    syncApi () {
        lightboard.drawLights();
    },
    updateAndSync () {
        return lightboard.updateBitmap().then(bitmap => {
            lightboard.syncApi();
            return bitmap;
        });
    },
    methods: {
        connect (info) {
            HardwareAPI.connectToSocket();
            HardwareAPI.socket.on('connect', () => {
                HardwareAPI.socket.emit('lightboard:init', info);
            });
        },
        on () {
            HardwareAPI.socket.on.apply(HardwareAPI.socket, arguments);
        },
        removeListener () {
            HardwareAPI.socket.removeListener.apply(HardwareAPI.socket, arguments);
        },
        /**
         * Add or update the shape with the corresponding id
         * @param  {String} id    Id of the shape to add/update
         * @param  {Object} shape Data defining the shape
         * @return {Promise}      Will resolve with the updated frame once
         * this once is sent to the real hardware
         */
        updateOrCreateShape (id, shape) {
            lightboard.shapes[id] = shape;
            return lightboard.updateAndSync();
        },
        turnOn (light, color) {
            if (light.type === 'all') {
                // Set all the saved lights to the color
                for (let i = 0; i < 128; i++) {
                    lightboard.lights[i] = color;
                }
                return lightboard.updateAndSync();
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Set the saved light to the color
                lightboard.lights[index] = color;
                return lightboard.updateAndSync();
            }
        },
        turnOff (light) {
            if (light.type === 'all') {
                // Resets the saved lights
                lightboard.lights = new Array(128);
                return lightboard.updateAndSync();
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Reset the saved light
                lightboard.lights[index] = null;
                // Turn the lightboard light to the background color
                return lightboard.updateAndSync();
            }
        },
        setBackgroundColor (color) {
            // Save the backgroundColor
            lightboard.backgroundColor = color;
            return lightboard.updateAndSync();
        },
        text (text, color, backgroundColor) {
            HardwareAPI.light.text({
                text,
                color,
                backgroundColor
            });
        },
        scroll (text, color, backgroundColor, speed) {
            // Transform speed 0 - 100 to 232 - 32
            let framePeriod = 232 - speed * 2;
            HardwareAPI.light.scroll({
                text,
                color,
                backgroundColor,
                framePeriod
            });
        }
    },
    lifecycle: {
        stop () {
            lightboard.lights = new Array(128);
            lightboard.shapes = {};
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        lightboard.api = HardwareAPI.config(opts);
    }
};
