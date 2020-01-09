/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { PartInlineDisplay } from '../../inline-display.js';
import './kc-oscillator-display.js';
import { Part } from '../../part.js';

export class OscillatorInlineDisplay extends PartInlineDisplay {
    public domNode: HTMLElement = document.createElement('kc-oscillator-display');
    constructor(part : Part) {
        super(part);
        (this.domNode as any).part = part;
    }
    onInject() {}
    onDispose() {}
}