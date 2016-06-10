import time from './time';
import loop from './loops';
import data from './data';
import global from './global';
import speaker from './speaker';
import math from './math';
import colour from './colour';
import mouse from './mouse';
import lightboard from './lightboard';
import camera from './camera';

let modules;

export default modules = {
    time,
    loop,
    global,
    speaker,
    data,
    math,
    colour,
    mouse,
    lightboard,
    camera,
    init (config) {
        let mod;
        // Loop through the modules and register every block
        Object.keys(modules).forEach((moduleName) => {
            mod = modules[moduleName];
            if (typeof mod.config === 'function') {
                mod.config(config);
            }
        });
    }
};
