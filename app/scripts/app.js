import Blockly from './blockly/blockly';
import Interact from 'interact.js';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';
import TextToSpeech from './service/text-to-speech';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

(function (app) {
    app.config = window.config;

    DragAndDrop.init({ workspaceFullSize: app.config.WORKSPACE_FULL_SIZE });

    if ('DEPLOY' in process.env) {
        config.DEPLOY = process.env.DEPLOY;
    }

    if ('VOICE_API_KEY' in process.env) {
        config.VOICE_API_KEY = process.env.VOICE_API_KEY;
    }

    app.registerBlockly = Blockly.register;

    app.Interact = Interact;

    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;
    app.tts = TextToSpeech(app.config);

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(app.config);
    app.sdk.registerForms();

})(window.app = {});
