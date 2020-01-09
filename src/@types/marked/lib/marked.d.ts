/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module 'marked/lib/marked.js' {
    global {
        interface Window {
            marked(src : string) : string;
        }
    }
}

