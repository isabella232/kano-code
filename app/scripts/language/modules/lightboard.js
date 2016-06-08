import HardwareAPI from '../../service/hardware-api';

let lightboard;

export default lightboard = {
    backgroundColor: '#000000',
    lights: Array(128),
    debounceId: null,
    getIndex (x, y) {
        return 16 * parseInt(y) + parseInt(x);
    },
    drawLights () {
        // Generate a bitmap combining background color and lights
        let bitmap = lightboard.lights.map((color) => {
            return color || lightboard.backgroundColor;
        });
        return HardwareAPI.light.on(bitmap);
    },
    /**
     * Call the drawLight methods on the next event loop. Allows to do a set of actions but call the api only once
     */
    syncApi () {
        clearTimeout(lightboard.debounceId);
        lightboard.debounceId = setTimeout(lightboard.drawLights, 1);
    },
    methods: {
        turnOn (light, color) {
            if (light.type === 'all') {
                // Set all the saved lights to the color
                lightboard.lights = lightboard.lights.map(_ => color);
                return lightboard.syncApi();
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Set the saved light to the color
                lightboard.lights[index] = color;
                return lightboard.syncApi();
            }
        },
        turnOff (light) {
            if (light.type === 'all') {
                // Resets the saved lights
                lightboard.lights = Array(128);
                return lightboard.syncApi();
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Reset the saved light
                lightboard.lights[index] = null;
                // Turn the lightboard light to the background color
                return lightboard.syncApi();
            }
        },
        setBackgroundColor (color) {
            // Save the backgroundColor
            lightboard.backgroundColor = color;
            return lightboard.syncApi();
        }
    },
    lifecycle: {
        stop () {
            lightboard.lights = new Array(128);
            HardwareAPI.clearAllCalls();
        }
    },
    config (opts) {
        lightboard.api = HardwareAPI.config(opts);
    }
};
