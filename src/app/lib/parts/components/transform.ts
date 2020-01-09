/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { PartComponent } from '../component.js';
import { property } from '../decorators.js';
import { EventEmitter } from '@kano/common/index.js';

export class Transform extends PartComponent {
    @property({ type: Number, value: 400 })
    x : number = 400;
    @property({ type: Number, value: 300 })
    y : number = 300;
    @property({ type: Number, value: 1 })
    scale : number = 1;
    @property({ type: Number, value: 0 })
    rotation : number = 0;
    @property({ type: Number, value: 1 })
    opacity : number = 1;
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public click : EventEmitter = new EventEmitter();
}
