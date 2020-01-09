/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { collectPrototype } from './util.js';

suite('PartsUtils', () => {
    test('collectPrototype()', () => {
        class Root {
            static get test() : any {
                return {
                    a: 1,
                };
            }
        }
        class Branch extends Root {
            static get test() : any {
                return {
                    b: 2,
                };
            }
        }
        class Leaf extends Branch {
            static get test() : any {
                return {
                    c: 3,
                };
            }
        }

        const collection = collectPrototype<{ [K : string] : number }>('test', Leaf, Root);

        assert(collection.has('c'));
        assert(collection.has('b'));
        assert(!collection.has('a'));
    });
});