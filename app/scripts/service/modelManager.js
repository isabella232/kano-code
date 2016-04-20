// Private data - the state.
let data = {};

// Model Manager for keeping the state of the app. Accessible through the following api.
const ModelManager = {

    // Get a piece of data.
    get (name) {
        return data[name];
    },

    // Set a piece of data providing the name and the info.
    set (name, info) {
        data[name] = info;
    },

    // Unset (remove) a piece of data.
    unset (name) {
        data[name] = '';
    }
};

// Expose the above api.
export default ModelManager;
