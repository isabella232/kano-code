import Interact from 'interact.js';
import Devices from './service/devices';
import Codes from './service/codes';
import Elements from './service/elements';
import Projects from './service/projects';
import Hardware from './hardware';
import Blockly from './blockly/blockly';
import KanoWorldSdk from 'kano-world-sdk';

import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

let config = {
    API_URL     : 'https://api.kano.me',
    WORLD_URL   : 'http://world.kano.me'
};

(function (app) {

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

    app.devices = Devices;
    app.codes = Codes;
    app.hardware = Hardware;
    app.elements = Elements;
    app.projects = Projects;

    app.getHws = () => {
        return app.hardware.getAll();
    };

    app.defaultCategories = Blockly.categories;

    app.sdk = KanoWorldSdk(config);
    app.sdk.registerForms();

})(window.app = {});
