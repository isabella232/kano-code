/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Editor } from '../editor/editor.js';
import { IChallengeData, Challenge } from './challenge.js';

export * from './challenge.js';

export function createChallenge(editor : Editor, data : IChallengeData) {
    return new Challenge(editor, data);
}
