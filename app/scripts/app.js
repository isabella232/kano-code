import Blockly from './blockly/blockly';
import Interact from 'interact.js';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
<<<<<<< ea83383a2e5f281d6e3d911195e79085b95ad7c9
import DragAndDrop from './drag-and-drop';
import config from './config';
import TextToSpeech from './service/text-to-speech'
=======
import TextToSpeech from './service/text-to-speech';
>>>>>>> Full implementation of the tts service

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

<<<<<<< ea83383a2e5f281d6e3d911195e79085b95ad7c9
=======
let config = {
    DEPLOY        : process.env.DEPLOY || 'web',

    API_URL       : 'http://api-apps.kano.me',
    WORLD_URL     : 'http://world.kano.me',

    VOICE_API_URL : 'http://api.voicerss.org',
    VOICE_API_KEY : process.env.VOICE_API_KEY
};

>>>>>>> Full implementation of the tts service
(function (app) {
    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    if ('DEPLOY' in process.env) {
        config.DEPLOY = process.env.DEPLOY;
    }

    if ('VOICE_API_KEY' in process.env) {
        config.VOICE_API_KEY = process.env.VOICE_API_KEY;
    }

    app.registerBlockly = Blockly.register;

    app.Interact = Interact;

    app.config = config;
    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;
    app.tts = TextToSpeech(config);

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

})(window.app = {});
