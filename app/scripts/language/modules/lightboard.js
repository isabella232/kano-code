import HardwareAPI from '../../service/hardware-api';

let lightboard;

export default lightboard = {
    backgroundColor: '#000000',
    lights: Array(128),
    getIndex (x, y) {
        return 16 * parseInt(y) + parseInt(x);
    },
    drawLights () {
        return HardwareAPI.light.on(lightboard.lights);
    },
    methods: {
        turnOn (light, color) {
            if (light.type === 'all') {
                // Set all the saved lights to the color
                lightboard.lights = lightboard.lights.map(_ => {
                    return color;
                });
                return HardwareAPI.light.allOn(color);
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Set the saved light to the color
                lightboard.lights[index] = color;
                return HardwareAPI.light.singleOn(index, color);
            }
        },
        turnOff (light) {
            if (light.type === 'all') {
                // Resets the saved lights
                lightboard.lights = Array(128);
                return HardwareAPI.light.allOff();
            } else if (light.type === 'single') {
                let index = lightboard.getIndex(light.x, light.y);
                // Reset the saved light
                lightboard.lights[index] = null;
                // Turn the lightboard light to the background color
                return HardwareAPI.light.singleOn(index, lightboard.backgroundColor);
            }
        },
        setBackgroundColor (color) {
            // Save the backgroundColor
            lightboard.backgroundColor = color;
            // Set all the lightboards lights to the background color
            return HardwareAPI.light.allOn(color)
                // Draw the saved lights on top
                .then(_ => lightboard.drawLights());
        }
    },
    lifecycle: {

    },
    config (opts) {
        lightboard.api = HardwareAPI.config(opts);
    }
};
