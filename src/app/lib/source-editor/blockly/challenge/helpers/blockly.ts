/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { IStepHelper } from '../../../../challenge/helper.js';
import { IStepData } from '../../../../creator/creator.js';
import { KanoCodeChallenge } from '../kano-code.js';

export class BlocklyStepHelper implements IStepHelper {
    enter(challenge : KanoCodeChallenge, step : IStepData): void {
        throw new Error('Method not implemented.');
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) : void {
        throw new Error('Method not implemented.');
    }
    test(challenge : KanoCodeChallenge, step : IStepData) {
        return step.validation && step.validation.blockly;
    }
}
