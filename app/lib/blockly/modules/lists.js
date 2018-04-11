const COLOR = '#ccdd1e';

class BlocklyLists {
    static get id() { return 'lists'; }
    static register(Blockly, registry) {
        registry.upgradeCategoryColours(BlocklyLists.id, COLOR);
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_LISTS,
            id: BlocklyLists.id,
            colour: COLOR,
            blocks: [
                'lists_create_empty',
                'lists_create_with',
                'lists_repeat',
                'lists_length',
                'lists_isEmpty',
                'lists_indexOf',
                'lists_getIndex',
                'lists_setIndex',
            ],
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
