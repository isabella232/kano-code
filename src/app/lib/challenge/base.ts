/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { EventEmitter } from '@kano/common/index.js';
import { Editor } from '../editor/editor.js';

export abstract class ChallengeBase {
    protected editor : Editor;
    public data? : any;

    protected _onDidEnd = new EventEmitter();
    get onDidEnd() { return this._onDidEnd.event; }

    protected _onDidRequestShare = new EventEmitter();
    get onDidRequestShare() { return this._onDidRequestShare.event; }

    constructor(editor : Editor) {
        this.editor = editor;
    }
    setData(data : any) {
        this.data = data;
    }
    abstract start() : void;
}
