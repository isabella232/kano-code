const COLOR = '#ccdd1e';

const CORE_BLOCKS = [
    'lists_create_empty',
    'lists_create_with',
    'lists_repeat',
    'lists_length',
    'lists_isEmpty',
    'lists_indexOf',
    'lists_getIndex',
    'lists_setIndex',
];

class BlocklyLists {
    static get type() { return 'blockly'; }
    static get id() { return 'lists'; }
    static register(Blockly) {
        CORE_BLOCKS.forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_LISTS,
            id: BlocklyLists.id,
            colour: COLOR,
            blocks: CORE_BLOCKS,
        };
    }
    static get defaults() {
        return {
            lists_getIndex: {
                MODE: 'GET',
            },
            lists_setIndex: {
                MODE: 'SET',
            },
        };
    }
}


export default BlocklyLists;
