/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { throttle } from './throttle.js';

suite('throttle', () => {
    test('throttle', () => {
        let called = 0;
        function target() {
            called++;
        }
        const throttled = throttle(target, 10, true);

        throttled();
        throttled();
        throttled();

        assert.equal(called, 1);
    });
});
