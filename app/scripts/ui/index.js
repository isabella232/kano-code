import Camera from './camera';
import Speaker from './speaker';
import TextInput from './text-input';
import Canvas from './canvas';
import Button from './button';
import GifCreator from './gif-creator';

// Group models by type
let models = {
    'speaker': Speaker,
    'text-input': TextInput,
    'camera': Camera,
    'canvas': Canvas,
    'button': Button,
    'gif-creator': GifCreator
};

// Get an array of each instance
let flattened = Object.keys(models).map((type) => {
    return new models[type]();
});

export default {
    /**
     * Create a new model based on the type
     */
    create (type) {
        let m = new models[type]();
        return m;
    },
    getAll () {
        return flattened;
    }
};
