/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Plugin } from '../editor/plugin.js';
import Editor from '../editor/editor.js';
import Output from '../output/output.js';

export abstract class CreationCustomPreviewProvider extends Plugin {
    protected editor? : Editor;
    onInstall(editor : Editor) {
        this.editor = editor;
    }
    abstract createFile(output : Output) : Promise<Blob>|Blob;
    abstract display(blob : Blob) : void;
}

