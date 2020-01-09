/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module 'js-beautify/js/lib/beautify.js' {
    interface IJsBeautifyOptions {
        indent_size : number;
    }
    global {
        interface Window {
            js_beautify(src : string, opts : IJsBeautifyOptions) : string;
        }
    }
}