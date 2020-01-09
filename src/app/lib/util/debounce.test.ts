/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { debounce } from './debounce.js';

suite('debounce', () => {
    test('debounce', (done) => {
        let called = 0;
        function target() {
            called++;
        }
        const debounced = debounce(target, 10);

        // First call should be queued
        debounced();

        // No call so far
        assert.equal(called, 0);
        
        // Second call replaces first
        debounced();
        
        setTimeout(() => {
            // After timeout, only one went through
            assert.equal(called, 1);
            done();
        }, 11);
    });
});
