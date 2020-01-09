/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

export function debounce(func : Function, wait : number) : Function {
    let timeout : number|null;
    return (...args : any[]) => {
        const later = () => {
            timeout = null;
            func(...args);
        };
        clearTimeout(timeout || undefined);
        timeout = window.setTimeout(later, wait);
    };
}

export default debounce;
