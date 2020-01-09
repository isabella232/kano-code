/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { StoragePlugin } from './storage.js';

export class LocalStoragePlugin extends StoragePlugin {
    read(key : string) {
        const value = localStorage.getItem(key);
        if (!value) {
            return Promise.resolve();
        }
        const app = JSON.parse(value);
        return Promise.resolve(app);
    }
    write(key : string, value : any) {
        localStorage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    }
}

export default LocalStoragePlugin;
