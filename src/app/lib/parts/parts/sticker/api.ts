import { sticker } from '@kano/icons/parts.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { IPartAPI } from '../../api.js';
import { StickerPart } from './sticker.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { random, randomFrom } from '../../../modules/stamp/api.js';
import { Editor } from '../../../editor/editor.js';
import { _ } from '../../../i18n/index.js';

export const StickerAPI : IPartAPI = {
    type: StickerPart.type,
    label: _('PART_STICKER_LABEL', 'Sticker'),
    icon: sticker,
    color: '#00c7b6',
    symbols: [{
        type: 'variable',
        name: 'image',
        verbose: _('PART_STICKER_IMAGE', 'image'),
        setter: true,
        getter: false,
        returnType: 'Sticker',
        // default: StickerPart.defaultSticker,
        blockly: {
            shadow() {
                return `<shadow type="stamp_getImage"><field name="STICKER">${StickerPart.defaultSticker}</field></shadow>`;
            },
        },
        // blockly: {
        //     customField(blockly: Blockly, block: Block, editor : Editor) {
        //         // sources the current sticker set from the stamp module instance
        //         const { defaultStamp } = editor.output.runner.appModulesLoader.appModules.modules.stamp.methods;

        //         return `<shadow type="stamp_getImage"><field name="STICKER">${defaultStamp}</field></shadow>`;
        //         // const images = stamps().map((image : any) => {
        //         //     return {
        //         //         id: image.id,
        //         //         label: image.label,
        //         //         stickers: Object.keys(image.stickers).map(id => ({ id, src: resolve(image.stickers[id])})),
        //         //     };
        //         // });

        //         // return new StampsField(defaultStamp(), images);
        //     },
        // },

    }, random, randomFrom, ...TransformAPI],
    onInstall(editor : Editor, part : StickerPart) {
        onTransformInstall(editor, part);
    },
};
