/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module 'prismjs/prism.js' {
    global {
        interface PrismLanguage {}
        interface Window {
            Prism : {
                languages : {
                    [K : string] : PrismLanguage;
                }
                highlight(cod : string, language : PrismLanguage) : string;
            }
        }
    }
}