const COLOUR = 41;

let register = (Blockly) => {
    Blockly.Blocks['every_x_seconds'] = {
        init: function () {
            let json = {
                id: 'every_x_seconds',
                colour: COLOUR,
                message0: 'Every %1 seconds',
                args0: [{
                    type: "input_value",
                    name: "INTERVAL"
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

    Blockly.JavaScript['every_x_seconds'] = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            interval = Blockly.JavaScript.valueToCode(block, 'INTERVAL'),
            code = `window.interval = setInterval(function () {
                        ${statement}
                    }, ${interval});`;
        return code;
    };

    Blockly.Natural['every_x_seconds'] = (block) => {
        let statement = Blockly.Natural.statementToCode(block, 'DO'),
            interval = Blockly.Natural.valueToCode(block, 'INTERVAL'),
            code = `Every ${interval} seconds, ${statement}`;
        return code;
    };
};
let category = {
    name: 'Time',
    colour: COLOUR,
    blocks: [{
        id: 'every_x_seconds'
    }]
};

export default {
    register,
    category
};
