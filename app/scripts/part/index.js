import TextInput from './text-input';
import UiImage from './image';
import Button from './button';
import Video from './video';

let part;

// Group models by type
let models = {
    'text-input': TextInput,
    'image': UiImage,
    'button': Button,
    'video': Video
};

// Get an array of each instance
let flattened = Object.keys(models).map((type) => {
    return new models[type]();
});

export default part = {
    /**
     * Create a new model based on the type
     */
    create (type) {
        let m = new models[type]();
        return m;
    },
    fromSaved (plain) {
        let newUi = part.create(plain.type);
        newUi.load(plain);
        return newUi;
    },
    getAll () {
        return flattened;
    }
};
