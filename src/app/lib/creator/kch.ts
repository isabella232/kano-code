/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Editor } from '../editor/editor.js';
import { FileLoaders } from '../editor/loader/loader.js';

const Loader = {
    load(editor : Editor, content : string) {
        throw new Error('Not implemented');
    }
}

FileLoaders.register('kch', Loader);
