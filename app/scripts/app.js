import Interact from 'interact.js';
import Stories from './service/stories';
import Components from './service/components';
import UI from './ui';
import Blockly from './blockly/blockly';
import KanoWorldSdk from 'kano-world-sdk';
import ModelManager from './service/modelManager';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

let config = {
    API_URL     : 'http://api-apps.kano.me',
    WORLD_URL   : 'http://world.kano.me'
};

let workspaceFullSize = { width: 1024, height: 768 };

(function (app) {

    app.scaleToWorkspace = (point) => {
        return {
            x: point.x / app.workspaceRect.width * workspaceFullSize.width,
            y: point.y / app.workspaceRect.height * workspaceFullSize.height
        };
    };

    app.registerBlockly = Blockly.register;

    app.Interact = Interact;

    app.dragMoveListener = (event) => {
        let target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };

    app.dragMoveListenerScaled = (event) => {
        let target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy,
            pos = app.scaleToWorkspace({x,y});

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
        'translate(' + pos.x + 'px, ' + pos.y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    };

    app.ui = UI;
    app.stories = Stories;
    app.components = Components;
    app.modelManager = ModelManager;

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

})(window.app = {});
