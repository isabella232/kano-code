import modules from './language/modules';
import blockly from './blockly';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';
import FileUtils from './util/file';
import config from './config';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

(function (app) {
    app.config = config;

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    app.registerBlockly = (Blockly) => {
        let mod;
        // Register default blockly modules
        blockly.register(Blockly);
        // Loop through the modules and register every block
        Object.keys(modules).forEach((moduleName) => {
            mod = modules[moduleName];
            if (typeof mod.config === 'function') {
                mod.config(config);
            }
        });
    };

    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;

    app.defaultCategories = blockly.categories;
    app.defaultCategories.events = {
        name: 'Events',
        colour: '#33a7ff',
        blocks: []
    };

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

    window.KanoModules = modules;

    app.file_utils = FileUtils;
})(window.app = {});
