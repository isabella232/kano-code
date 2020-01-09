/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import Editor from './editor';
import Output from '../output/output';

export type PluginLifecycleStep = 'onInstall'|'onInject'|'onDispose'|'onImport'|'onCreationImport'|'onExport'|'onCreationExport';

export abstract class Plugin {
    onInstall(editorOrOutput : Editor|Output) {}
    onInject() {}
    onDispose() {}
    onImport() {}
    onCreationImport() {}
    onExport(data : any) {
        return data;
    }
    onCreationExport(data : any) {
        return data;
    }
}

export default Plugin;
