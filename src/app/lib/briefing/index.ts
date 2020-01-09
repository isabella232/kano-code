/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Editor } from '../editor/editor.js';
import { Briefing } from './briefing.js';
import { ContributionManager } from '../contribution.js';

const registeredBriefings = new ContributionManager<typeof Briefing>();

export function registerBriefing(id : string, briefing : typeof Briefing) {
    registeredBriefings.register(id, briefing);
}

export function createBriefing(editor : Editor) {
    const BriefingConstructor = registeredBriefings.get(editor.sourceType);
    if (!BriefingConstructor) {
        throw new Error(`Could not create briefing: Briefing for source type '${editor.sourceType}' was not imported.`);
    }
    return new BriefingConstructor(editor);
}
