/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

export function join(a : string, b : string) {
    const safeA = a.replace(/\/$/, '');
    const safeB = b.replace(/^\//, '');
    return `${safeA}/${safeB}`;
}

export function extname(p : string) {
    return p.substring(p.lastIndexOf('.') + 1) || null;
}