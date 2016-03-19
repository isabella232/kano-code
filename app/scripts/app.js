import modules from './language/modules';
import blockly from './blockly';
import Stories from './service/stories';
import Components from './service/components';
import Part from './part';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';
import DragAndDrop from './drag-and-drop';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

(function (app) {
    app.config = window.config;

    DragAndDrop.init({ workspaceFullSize: app.config.WORKSPACE_FULL_SIZE });

    app.defaultCategories = [];
    app.registerBlockly = (Blockly) => {
        let mod,
            category;
        // Register default blockly modules
        blockly.register(Blockly);
        // Loop through the modules and register every block
        Object.keys(modules).forEach((moduleName) => {
            mod = modules[moduleName];
            if (!mod.blocks) {
                return;
            }
            category = {
                name: mod.name,
                colour: mod.colour,
                blocks: []
            };
            mod.blocks.forEach((definition) => {
                definition.block.id = `${moduleName}#${definition.block.id}`;
                definition.block.colour = mod.colour;
                Blockly.Blocks[definition.block.id] = {
                    init: function () {
                        this.jsonInit(definition.block);
                    }
                };
                Blockly.JavaScript[definition.block.id] = definition.javascript;
                Blockly.Natural[definition.block.id] = definition.natural;
                category.blocks.push({ id: definition.block.id });
            });
            app.defaultCategories.push(category);
        });
    };

    app.part = Part;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;
    app.dragAndDrop = DragAndDrop;

    app.defaultCategories = app.defaultCategories.concat(blockly.categories);

    app.sdk = KanoWorldSdk(app.config);
    app.sdk.registerForms();

})(window.app = {});
