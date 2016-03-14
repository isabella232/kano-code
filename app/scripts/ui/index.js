import Speaker from './speaker';
import TextInput from './text-input';
import UiImage from './image';
import Button from './button';
import GifCreator from './gif-creator';
import Video from './video';

let ui;

// Group models by type
let models = {
    'speaker': Speaker,
    'text-input': TextInput,
    'image': UiImage,
    'button': Button,
    'gif-creator': GifCreator,
    'video': Video
};

// Get an array of each instance
let flattened = Object.keys(models).map((type) => {
    return new models[type]();
});

export default ui = {
    /**
     * Create a new model based on the type
     */
    create (type) {
        let m = new models[type]();
        return m;
    },
    fromSaved (plain) {
        let newUi = ui.create(plain.type);
        newUi.load(plain);
        return newUi;
    },
    getAll () {
        return flattened;
    }
};
