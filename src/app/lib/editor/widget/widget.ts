/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import Editor from '../editor.js';

/**
 * A widget that can be added using the Content Widget API
 */
export interface IEditorWidget {
    [K : string] : any;
    getDomNode() : HTMLElement;
    getPosition() : string|null;
    layout?(editor : Editor) : void;
}
