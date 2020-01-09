/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import 'prismjs/prism.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

export function highlight(src : string, language : string) {
    const html = window.Prism.highlight(src, window.Prism.languages[language]);
    return unsafeHTML(html);
}
