/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { KanoCodeChallenge } from './kano-code.js';
import { registerChallengeEngine } from '../../../challenge/index.js';
// This imports all the UI elements the creator might register
export * from '../creator/helpers.js';

registerChallengeEngine('blockly', KanoCodeChallenge);
