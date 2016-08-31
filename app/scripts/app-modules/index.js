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
import proximitySensor from './proximity-sensor';
import motionSensor from './motion-sensor';
import gestureSensor from './gesture-sensor';
import gyroAccelerometer from './gyro-accelerometer';

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
        date,
        proximitySensor,
        motionSensor,
        gestureSensor,
        gyroAccelerometer
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
        if (AppModules.modules[name]) {
            return AppModules.modules[name].methods;
        }
    },
    start () {
        AppModules.executeLifecycleStep('start');
    },
    stop () {
        AppModules.executeLifecycleStep('stop');
    },
    executeLifecycleStep (name) {
        Object.keys(AppModules.modules).forEach((moduleName) => {
            if (AppModules.modules[moduleName].lifecycle && AppModules.modules[moduleName].lifecycle[name]) {
                AppModules.modules[moduleName].lifecycle[name]();
            }
        });
    },
    enablePreviousVersionsSupport () {
        window.Kano.MakeApps = window.Kano.MakeApps || {};
        window.Kano.MakeApps.Modules = AppModules.modules;
        window.KanoModules = AppModules.modules;
        window.KanoModules.init = { methods: {} };
    }
};
