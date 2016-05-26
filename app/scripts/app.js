import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

import modules from './language/modules';
import blockly from './blockly';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import DragAndDrop from './drag-and-drop';
import ProgressService from './service/progress';
import config from './config';

window.Kano = window.Kano || {};

(function (MakeApps) {
    MakeApps.config = config;

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    MakeApps.blockly = blockly;
    modules.init(config);

    MakeApps.part = Part;
    MakeApps.stories = Stories;
    MakeApps.components = Components;
    MakeApps.dragAndDrop = DragAndDrop;

    MakeApps.defaultCategories = blockly.categories;

    MakeApps.sdk = KanoWorldSdk(config);
    MakeApps.progress = ProgressService(MakeApps.sdk);
    MakeApps.sdk.registerForms();


    MakeApps.Modules = modules;
})(window.Kano.MakeApps = window.Kano.MakeApps || {});
