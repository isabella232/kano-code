/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { ICopyGenerator, CopyGenerators } from './creator.js';
import { ContributionManager } from '../contribution.js';

export function registerCopyGenerator(sourceType : string, type : string, generator : ICopyGenerator) {
    const copyGenerators = CopyGenerators.get(sourceType) || new ContributionManager<ICopyGenerator>();

    copyGenerators.register(type, generator);

    CopyGenerators.register(sourceType, copyGenerators);
}
