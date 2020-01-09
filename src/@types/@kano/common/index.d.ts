/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

declare module '@kano/common/index.js' {
    import { IDisposable } from '@kano/common/lifecycle/disposables.js';
    export * from '@kano/common/lifecycle/disposables.js';
    export * from '@kano/common/events/emitter.js';

    export function subscribeTimeout(callback : () => void, timeout? : number) : IDisposable;
    export function subscribeInterval(callback : () => void, timeout? : number) : IDisposable;
}
