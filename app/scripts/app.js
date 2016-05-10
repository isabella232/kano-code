import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

import modules from './language/modules';
import blockly from './blockly';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';
import FileUtils from './util/file';
import ProgressService from './service/progress.js';
import config from './config';

(function (app) {
    app.config = config;

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    app.registerBlockly = (Blockly) => {
        blockly.register(Blockly);
    };
    modules.init(config);

    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;

    app.defaultCategories = blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.progress = ProgressService(app.sdk);
    app.sdk.registerForms();


    window.KanoModules = modules;

    app.file_utils = FileUtils;
})(window.app = {});
