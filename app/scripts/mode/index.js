import Normal from './normal';
import Light from './light';
import Camera from './camera';

let Mode;

export default Mode = {
    modes: {
        normal: Normal
    },
    experiments: {
        lightboard: Light,
        camera: Camera
    },
    init (config) {
        let flags = config.getFlags();
        flags.experiments.forEach(exp => {
            if (Mode.experiments[exp]) {
                Mode.modes[exp] = Mode.experiments[exp];
            }
        });
        config.addExperiments('modes', Object.keys(Mode.experiments));
    }
};
