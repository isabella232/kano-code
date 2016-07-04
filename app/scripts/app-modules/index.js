import time from './time';
import loop from './loops';
import data from './data';
import global from './global';
import speaker from './speaker';
import math from './math';
import colour from './colour';
import mouse from './mouse';
import keyboard from './keyboard';
import lightboard from './lightboard';
import camera from './camera';
import cat from './cat';
import HardwareAPI from './service/hardware-api';
import date from './date';

let AppModules;

// otherwise browserify will add the key 'default' in the module
module.exports = AppModules = {
    modules: {
        time,
        loop,
        global,
        speaker,
        data,
        math,
        colour,
        mouse,
        date
    },
    experiments: {
        fun: {
            cat
        },
        lightboard: {
            lightboard
        },
        camera: {
            camera
        },
        keyboard_events: {
            keyboard
        }
    },
    HardwareAPI,
    init (config) {
        let flags = config.getFlags(),
            mod;
        flags.experiments.forEach(exp => {
            if (AppModules.experiments[exp]) {
                Object.assign(AppModules.modules, AppModules.experiments[exp]);
            }
        });
        config.addExperiments('modules', Object.keys(AppModules.experiments));
        // Loop through the modules and call their config method
        Object.keys(AppModules.modules).forEach((moduleName) => {
            mod = AppModules.modules[moduleName];
            if (typeof mod.config === 'function') {
                mod.config(config);
            }
        });
    },
    getModule (name) {
        return AppModules.modules[name].methods;
    },
    enablePreviousVersionsSupport () {
        window.Kano.MakeApps = window.Kano.MakeApps || {};
        window.Kano.MakeApps.Modules = AppModules.modules;
        window.KanoModules = AppModules.modules;
        window.KanoModules.init = { methods: {} };
    }
};
