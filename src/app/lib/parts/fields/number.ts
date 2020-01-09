/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { StringPartEditorField } from './string.js';
import { IFieldComponent } from '../field.js';

export class NumberPartEditorField extends StringPartEditorField<number> {
    static get propertyType() : any {
        return Number;
    }
    constructor(component : IFieldComponent, key : string) {
        super(component, key);
        this._input.type = 'number';
    }
    _getInputValue() : number {
        return parseInt(this._input.value, 10);
    }
}