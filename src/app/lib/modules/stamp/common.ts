import { IMetaDefinition } from '../../meta-api/module.js';
import { Editor } from '../../editor/editor.js';
import { StampsField } from '../../blockly/fields/stamps-field.js';
import { _ } from '../../i18n/index.js';

export function random(editor : Editor) : IMetaDefinition {
    const stickers = editor.output.resources.get('stickers');
    let stickerEnum : [string, string][] = [];
    if (stickers) {
        stickerEnum = stickers.categoryEnum;
    }
    stickerEnum.unshift([_('ALL', 'All'), 'all']);
    return {
        type: 'function',
        name: 'random',
        verbose: _('PART_STICKER_RANDOM_FROM', 'random from'),
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

export function stampChoice(editor : Editor) : IMetaDefinition {
    return {
        type: 'function',
        name: 'stampChoice',
        verbose: '',
        returnType: 'Sticker',
        parameters: [{
            type: 'parameter',
            name: 'name',
            verbose: '',
            returnType: 'Sticker',
            blockly: {customField() {
                const stickers = editor.output.resources.get('stickers');
                if (!stickers) {
                    throw new Error('Could not create StampsField: stickers resource is not defined');
                }
                const defaultSticker = stickers.default ? stickers.default : ''
                return new StampsField(defaultSticker, stickers.categorisedResource, () => {}, stickers.legacyIdMap);
            },}
        }]
    }
}