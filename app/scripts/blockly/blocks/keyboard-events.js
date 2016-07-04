export default {
    register (Blockly) {
        Blockly.Blocks.key_down = {
            init: function () {
                let json = {
                    id: 'key_down',
                    message0: 'When key %1 is %2',
                    args0: [{
                        type: "input_value",
                        name: "KEY"
                    }, {
                        type: 'field_dropdown',
                        name: 'STATE',
                        options: [['pushed', 'pushed'], ['released', 'released']]
                    }],
                    message1: '%1',
                    args1: [{
                        type: "input_statement",
                        name: "DO"
                    }]
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.key_down = (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                key = Blockly.JavaScript.valueToCode(block, 'KEY'),
                state = block.getFieldValue('STATE'),
                method = state === 'pushed' ? 'onDown' : 'onUp',
                code = `keyboard.${method}(${key}, function () {\n${statement}\n});\n`;
            return code;
        };

        Blockly.Pseudo.key_down = (block) => {
            let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
                key = Blockly.Pseudo.valueToCode(block, 'KEY'),
                state = block.getFieldValue('STATE'),
                method = state === 'pushed' ? 'onDown' : 'onUp',
                code = `keyboard.${method}(${key}, function () {\n${statement}\n});\n`;
            return code;
        };
    },
    blocks: [{
        id: 'key_down'
    }]
};
