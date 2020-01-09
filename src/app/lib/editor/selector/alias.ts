/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { ISelector, QueryEngine } from './selector.js';

export function aliasTagHandlerFactory(queryEngine : QueryEngine, map : Map<string, string>) {
    return (selector : ISelector) => {
        if (!selector.id) {
            throw new Error('Could not find alias: No id provided');
        }
        const s = map.get(selector.id);
        if (!s) {
            throw new Error(`Could not find alias: '${selector.id}' was not registered before`);
        }
        return queryEngine.query(s);
    };
}
