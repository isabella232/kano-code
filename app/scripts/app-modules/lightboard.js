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
                let distance;
                for (let x = -shape.radius; x <= shape.radius; x++) {
                    for (let y = -shape.radius; y <= shape.radius; y++) {
                        distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                        if (shape.radius >= distance) {
                            shapesBitmap[lightboard.getIndex(shape.x + x, shape.y + y)] = shape.color;
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
    },
    drawLights () {
        return HardwareAPI.light.on(lightboard.bitmap.slice(0));
    },
    /**
     * Call the drawLight methods on the next event loop. Allows to do a set of actions but call the api only once
     */
    syncApi () {
        clearTimeout(lightboard.debounceId);
        lightboard.debounceId = setTimeout(lightboard.drawLights, 1);
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
        updateOrCreateShape (id, shape) {
            lightboard.shapes[id] = shape;
            lightboard.updateBitmap();
            lightboard.syncApi();
            return lightboard.bitmap;
        },
        turnOn (light, color) {
            if (light.type === 'all') {
                // Set all the saved lights to the color
                for (let i = 0; i < 128; i++) {
                    lightboard.lights[i] = color;
                }
                lightboard.updateBitmap();
                lightboard.syncApi();
                return lightboard.bitmap;
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Set the saved light to the color
                lightboard.lights[index] = color;
                lightboard.updateBitmap();
                lightboard.syncApi();
                return lightboard.bitmap;
            }
        },
        turnOff (light) {
            if (light.type === 'all') {
                // Resets the saved lights
                lightboard.lights = new Array(128);
                lightboard.updateBitmap();
                lightboard.syncApi();
                return lightboard.bitmap;
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Reset the saved light
                lightboard.lights[index] = null;
                // Turn the lightboard light to the background color
                lightboard.updateBitmap();
                lightboard.syncApi();
                return lightboard.bitmap;
            }
        },
        setBackgroundColor (color) {
            // Save the backgroundColor
            lightboard.backgroundColor = color;
            lightboard.updateBitmap();
            lightboard.syncApi();
            return lightboard.bitmap;
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
