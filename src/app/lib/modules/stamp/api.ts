import { IMetaDefinition } from '../../meta-api/module.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { StampsField } from '../../blockly/fields/stamps-field.js';
import { _ } from '../../i18n/index.js';
import { Editor } from '../../editor/editor.js';


function getImage(editor : Editor) : IMetaDefinition {
    return {
        type: 'function',
        name: 'getImage',
        verbose: '',
        parameters: [{
            type: 'parameter',
            name: 'sticker',
            verbose: '',
            returnType: 'Sticker',
            blockly: {
                customField() {
                    const stickers = editor.output.resources.get('stickers')
                    return new StampsField(stickers.default, stickers.categorisedStickers);
                },
            },
        }],
        returnType: 'Sticker',
        blockly: {
            toolbox: false,
            javascript(Blockly : Blockly, block: Block) {
                const value = block.getFieldValue('STICKER');
                return [`'${value || ""}'`, Blockly.JavaScript.ORDER_ATOMIC];
            },
        }
    }
};

export const random : IMetaDefinition = {
    type: 'function', 
    name: 'random',
    verbose: _('PART_STICKER_RANDOM', 'random'),
    returnType: 'Sticker'
};

export function randomFrom(editor : Editor) : IMetaDefinition {
    const stickerEnum = editor.output.resources.get('stickers').categoryEnum
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

function hideBlock(block : IMetaDefinition) {
    const newBlock = Object.assign({}, block);
    newBlock.blockly = { toolbox: false };
    return newBlock;
}

export function StampAPI (editor: Editor) {
    return {
        type: 'module',
        name: 'stamp',
        verbose: 'Stamp',
        color: '#00c7b6',
        symbols: [
            getImage(editor),
            hideBlock(random),
            hideBlock(randomFrom(editor))
        ]
    }
}

export default StampAPI;
