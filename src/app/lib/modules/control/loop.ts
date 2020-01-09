/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { AppModule } from '../../app-modules/app-module.js';

export class LoopModule extends AppModule {
    private intervals : number[];
    constructor(output : any) {
        super(output);
        this.intervals = [];

        this.addMethod('forever', '_forever');

        this.addLifecycleStep('stop', '_stop');
    }

    static get id() { return 'loop'; }

    _forever(callback : Function) {
        // push the next tick to the end of the events queue
        const id = setInterval(callback, 10);
        this.intervals.push(id);
    }
    _stop() {
        this.intervals.forEach(id => clearInterval(id));
    }
}

export default LoopModule;
