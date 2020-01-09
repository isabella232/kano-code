/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { registerTypeSerializer, defaultSerializer } from '../component.js';

export const Color = Symbol();

registerTypeSerializer(Color, defaultSerializer);
