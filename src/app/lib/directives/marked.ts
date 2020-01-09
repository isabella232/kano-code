/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import 'marked/lib/marked.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export function marked(src : string) {
    return unsafeHTML(window.marked(src));
}
