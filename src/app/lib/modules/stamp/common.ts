import { IMetaDefinition } from '../../meta-api/module.js';
import { Editor } from '../../editor/editor.js';
import { _ } from '../../i18n/index.js';

export const random : IMetaDefinition = {
        type: 'function', 
        name: 'random',
        verbose: _('PART_STICKER_RANDOM', 'random'),
        returnType: 'Sticker'
    };

export function randomFrom(editor : Editor) : IMetaDefinition {
    const stickers = editor.output.resources.get('stickers');
    let stickerEnum : [string, string][] = [];
    if (stickers) {
        stickerEnum = stickers.categoryEnum;
    }
    return {
        type: 'function',
        name: 'randomFrom',
        verbose: _('PART_STICKER_RANDOM_FROM', 'random'),
        returnType: 'Sticker',
        parameters: [{
            type: 'parameter',
            name: 'set',
            verbose: '',
            returnType: 'Enum',
            enum: stickerEnum,
        }]
    }
}
