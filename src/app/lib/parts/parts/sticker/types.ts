/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { registerTypeSerializer, defaultSerializer } from '../../component.js';

export class Sticker {
    private _value : string|null;
    constructor(value : string|null) {
        this._value = value;
    }
    set(v : string) {
        this._value = v;
    }
    get() {
        return this._value;
    }
};

registerTypeSerializer(Sticker, defaultSerializer);
