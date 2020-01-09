/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { PartInlineDisplay } from '../../inline-display.js';
import { TextInputPart } from './text-input.js';
import { Flash } from '../../../plugins/flash/flash.js';

export class TextInputInlineDisplay extends PartInlineDisplay<HTMLDivElement> {
    public domNode: HTMLDivElement;
    private flash : Flash = new Flash();
    constructor(part : TextInputPart) {
        super(part);
        this.domNode = this.flash.domNode;
        this.domNode.style.marginRight = '8px';
        part.core.change.event(() => {
            this.flash.trigger();
        });
    }
    onInject() {}
    onDispose() {}
}
