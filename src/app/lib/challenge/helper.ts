/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { IStepData } from '../creator/creator.js';
import { Engine } from './engine.js';

export interface IStepHelper {
    test(challenge : Engine, step : IStepData) : boolean;
    enter(challenge : Engine, step : IStepData) : void;
    leave(challenge : Engine, step : IStepData) : void;
}
