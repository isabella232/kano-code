/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { AppModule } from '../../app-modules/app-module.js';
import { transformLegacyLogic } from './legacy.js';

export class LogicModule extends AppModule {
    static transformLegacy(app : any) {
        transformLegacyLogic(app);
    }
    static get id() { return 'logic'; }
}

export default LogicModule;
