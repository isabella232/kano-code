/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

export function findInSet<T>(set : Set<T>, predicate : (value : T) => boolean) {
    for (const e of set) {
        if (predicate(e)) {
            return e;
        }
    }
    return null;
}
