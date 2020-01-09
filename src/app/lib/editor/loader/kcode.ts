/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Editor } from '../editor.js';
import { FileLoaders } from './loader.js';

const Loader = {
    load(editor : Editor, content : string) {
        const parsed = JSON.parse(content);
        editor.load(parsed);
    }
}

FileLoaders.register('kcode', Loader);
