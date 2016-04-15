const COLOUR = 'linear-gradient(#C24242,#A52D2D)';

let register = (Blockly) => {
    Blockly.Blocks.loop_forever = {
        init: function () {
            let json = {
                id: 'loop_forever',
                colour: COLOUR,
                message0: 'Repeat %1 %2',
                args0: [
                {
                    type: "input_dummy"
                },
                {
                    type: "input_statement",
                    name: "DO"
                }],
                message1: 'forever',
                previousStatement: null,
                nextStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.loop_forever = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            code = `loop.forever(function () {\n${statement}});\n`;
        return code;
    };

    Blockly.Pseudo.loop_forever = (block) => {
        let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
            code = `repeat forever {\n${statement}}\n`;
        return code;
    };

    Blockly.Blocks.every_x_seconds = {
        init: function () {
            let json = {
                id: 'every_x_seconds',
                colour: COLOUR,
                message0: 'Every %1 seconds',
                args0: [{
                    type: "input_value",
                    name: "INTERVAL"
                }],
                message1: 'do %1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.every_x_seconds = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            interval = parseInt(Blockly.JavaScript.valueToCode(block, 'INTERVAL')) || 5,
            code = `time.every(${interval}, function () {\n${statement}});\n`;
        return code;
    };
    Blockly.Pseudo.every_x_seconds = (block) => {
        let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
            interval = parseInt(Blockly.Pseudo.valueToCode(block, 'INTERVAL')) || 5,
            code = `every ${interval} seconds, do {\n${statement}}\n`;
        return code;
    };

    Blockly.Blocks.repeat_x_times = {
        init: function () {
            let json = {
                id: 'repeat_x_times',
                colour: COLOUR,
                message0: 'Repeat %1 times',
                args0: [{
                    type: "input_value",
                    name: "N"
                }],
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.repeat_x_times = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            n = parseInt(Blockly.JavaScript.valueToCode(block, 'N')) || 2,
            code = `for (var i = 0; i < ${n}, i++) {\n${statement}}\n`;
        return code;
    };
    Blockly.Pseudo.repeat_x_times = (block) => {
        let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
            n = parseInt(Blockly.Pseudo.valueToCode(block, 'N')) || 2,
            code = `for (var i = 0; i < ${n}, i++) {\n${statement}}\n`;
        return code;
    };

    Blockly.Pseudo.controls_if = (block) => {
        // If/elseif/else condition.
        let n = 0,
            argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false',
            branch = Blockly.Pseudo.statementToCode(block, 'DO' + n),
            code = 'if (' + argument + ') {\n' + branch + '}';
        for (n = 1; n <= block.elseifCount_; n++) {
            argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false';
            branch = Blockly.Pseudo.statementToCode(block, 'DO' + n);
            code += ' else if (' + argument + ') {\n' + branch + '}';
        }
        if (block.elseCount_) {
            branch = Blockly.Pseudo.statementToCode(block, 'ELSE');
            code += ' else {\n' + branch + '}';
        }
        return code + '\n';
    };

    Blockly.Pseudo.logic_compare = (block) => {
        // Comparison operator.
        const OPERATORS = {
            'EQ': '==',
            'NEQ': '!=',
            'LT': '<',
            'LTE': '<=',
            'GT': '>',
            'GTE': '>='
        };
        let operator = OPERATORS[block.getFieldValue('OP')],
            order = (operator == '==' || operator == '!=') ? Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL,
            argument0 = Blockly.Pseudo.valueToCode(block, 'A', order) || '0',
            argument1 = Blockly.Pseudo.valueToCode(block, 'B', order) || '0',
            code = argument0 + ' ' + operator + ' ' + argument1;
        return [code, order];
    };
};

let category = {
    name: 'Control',
    colour: COLOUR,
    blocks: [{
        id: 'repeat_x_times'
    },{
        id: 'loop_forever'
    },{
        id: 'every_x_seconds'
    },{
        id: 'controls_if'
    },{
        id: 'logic_compare'
    },{
        id: 'logic_operation'
    },{
        id: 'logic_negate'
    },{
        id: 'logic_boolean'
    }]
};

export default {
    register,
    category
};
