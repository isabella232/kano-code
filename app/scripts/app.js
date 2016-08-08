import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

import Stories from './service/stories';
import Components from './service/components';
import Mode from './mode';
import email from './service/email';
import KanoWorldSdk from 'kano-world-sdk';
import DragAndDrop from './drag-and-drop';
import ProgressService from './service/progress';
import config from './config';

window.Kano = window.Kano || {};

(function (MakeApps) {
    MakeApps.config = config;

    DragAndDrop.init({ workspaceFullSize: config.WORKSPACE_FULL_SIZE });

    MakeApps.stories = Stories;
    MakeApps.components = Components;
    MakeApps.dragAndDrop = DragAndDrop;

    MakeApps.sdk = KanoWorldSdk(config);
    // Add attach route until supported by the SDK
    MakeApps.sdk.api.add('share.attach', {
        method: 'post',
        route: '/share/attach/:id'
    });
    MakeApps.progress = ProgressService(MakeApps.sdk);
    MakeApps.sdk.registerForms();

    MakeApps.email = email;

    MakeApps.Mode = Mode;

})(window.Kano.MakeApps = window.Kano.MakeApps || {});
