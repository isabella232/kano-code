import { IMetaDefinition } from '../../meta-api/module.js';
import { Block, FieldDropdown } from '@kano/kwc-blockly/blockly.js';
import { StampsField } from '../../blockly/fields/stamps-field.js';
import { resolve } from '../../util/image-stamp.js';
import { Editor } from '../../index.js';
import { _ } from '../../i18n/index.js';


const getImage : IMetaDefinition = {
    type: 'function',
    name: 'getImage',
    verbose: '',
    parameters: [{
        type: 'parameter',
        name: 'sticker',
        verbose: '',
        returnType: 'Sticker',
        blockly: {
            customField(blockly: Blockly, block: Block, editor : Editor) {
                // sources the current sticker set from the stamp module instance
                console.log(editor)
                const stampModule = editor.output.outputProfile.modules.find(module => module.name === 'StampModule')
                const { stickers, defaultSticker } = stampModule;
                const images = stickers.map((image : any) => {
                    return {
                        id: image.id,
                        label: image.label,
                        stickers: Object.keys(image.stickers).map(id => ({ id, src: resolve(image.stickers[id])})),
                    };
                });

                return new StampsField(defaultSticker, images);
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
};

export const random : IMetaDefinition = {
    type: 'function', 
    name: 'random',
    verbose: _('PART_STICKER_RANDOM', 'random'),
    returnType: 'Sticker'
};

export const randomFrom : IMetaDefinition = {
    type: 'function',
    name: 'randomFrom',
    verbose: _('PART_STICKER_RANDOM_FROM', 'random'),
    returnType: 'Sticker',
    parameters: [{
        type: 'parameter',
        name: 'set',
        verbose: '',
        returnType: 'Enum',
        blockly: {
            customField(blockly: Blockly, block: Block, editor : Editor) {
                // sources the current sticker set from the stamp module instance
                // const { stamps } = editor.output.runner.appModulesLoader.appModules.modules.stamp.methods;
                const stampModule = editor.output.outputProfile.modules.find(module => module.name === 'StampModule')
                const { stickers } = stampModule;
                const list = stickers.map(sticker => [sticker.label, sticker.id])
                return new FieldDropdown(list)
            }
        }
    }]
}

function hideBlock(block : IMetaDefinition) {
    const newBlock = Object.assign({}, block);
    newBlock.blockly = { toolbox: false };
    return newBlock;
}

export const StampAPI = {
    type: 'module',
    name: 'stamp',
    verbose: 'Stamp',
    color: '#00c7b6',
    symbols: [
        getImage,
        hideBlock(random),
        hideBlock(randomFrom)
    ]
}

export default StampAPI;
