const COLOR = '#ffc100';

class BlocklyVariables {
    static get type() { return 'blockly'; }
    static get id() { return 'variables'; }
    static register(Blockly) {
        [
            'math_number',
            'text',
            'text_join',
            'variables_set',
            'variables_get',
        ].forEach((blockId) => {
            Blockly.Blocks[blockId].customColor = COLOR;
        });
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_VARIABLES,
            id: BlocklyVariables.id,
            colour: COLOR,
            blocks: [
                'math_number',
                'text',
                'text_join',
                'variables_set',
                'variables_get',
            ],
        };
    }
    static get defaults() {
        return {
            variables_set: {
                VAR: 'item',
            },
            variables_get: {
                VAR: 'item',
            },
        };
    }
}

export default BlocklyVariables;
