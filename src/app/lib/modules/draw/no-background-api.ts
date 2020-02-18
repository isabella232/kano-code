/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */
import DrawAPI from './api.js';
import Editor from '../../editor/editor.js';

export function NoBackgroundDrawAPI(editor: Editor) {
    const api = DrawAPI(editor, true);
    return api;
}

export default NoBackgroundDrawAPI