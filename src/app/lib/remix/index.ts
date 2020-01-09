/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { ContributionManager } from '../contribution.js';
import { Remix } from './remix.js';
import { Editor } from '../editor/editor.js';

const registeredRemix = new ContributionManager<typeof Remix>();

export function registerRemix(id : string, remix : typeof Remix) {
    registeredRemix.register(id, remix);
}

export function createRemix(editor : Editor) {
    const RemixConstructor = registeredRemix.get(editor.sourceType);
    if (!RemixConstructor) {
        throw new Error(`Could not create remix: Remix for source type '${editor.sourceType}' was not imported`);
    }
    return new RemixConstructor(editor);
}

export * from './remix.js';
