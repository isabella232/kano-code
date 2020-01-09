/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import './export.js';
import 'omggif/omggif.js';

export const { GifWriter, GifReader } = window.exports;

export default { GifWriter, GifReader };

delete window.exports;
