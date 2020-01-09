/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { property } from '../../decorators.js';
import { PartComponent } from '../../component.js';
import { Sticker } from './types.js';

export class StickerComponent extends PartComponent {
    @property({ type: Sticker, value: () => new Sticker('') })
    public image : Sticker = new Sticker('');
    render(ctx : CanvasRenderingContext2D, el : HTMLElement) {
        const img = el as HTMLImageElement;
        ctx.drawImage(img, 0, 0, 100, 100);
    }
}
