/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { StickerPart } from './sticker.js';
import { Sticker } from './types.js';
import { PartContextStub } from '../../../../../test/part-context-stub.js';

suite('StickerPart', () => {
    test('#render()', () => {
        const stub = new PartContextStub();
        const nonExistingImage = '$$unknown$$';
        const existingImage = 'camel';
        const sticker = new StickerPart();
        sticker.onInstall(stub);
        
        sticker.core.image = new Sticker(nonExistingImage);
        sticker.core.invalidated = true;

        sticker.render();

        assert.equal((sticker as any)._el.style.backgroundImage, 'url("/assets/part/stickers/animals/animal-crocodile.svg")');

        sticker.core.image = new Sticker(existingImage);
        sticker.core.invalidated = true;

        sticker.render();

        assert.equal((sticker as any)._el.style.backgroundImage, 'url("/assets/part/stickers/animals/animal-camel.svg")');
    });
    test('#image', () => {
        return new Promise((resolve) => {
            const sticker = new StickerPart();
            
            sticker.core.onDidInvalidate(() => {
                assert.equal((sticker.core.image as any)._value, 'camel');
                resolve();
            });
    
            sticker.image = 'camel';
        });
    });
});
