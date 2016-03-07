const COLOUR = 41;

let register = (Blockly) => {
    Blockly.Blocks['log'] = {
        init: function () {
            let json = {
                id: 'log',
                colour: COLOUR,
                message0: 'Log this message %1',
                args0: [{
                    type: "input_value",
                    name: "MESSAGE"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['log'] = (block) => {
        let message = Blockly.JavaScript.valueToCode(block, 'MESSAGE'),
            code = `console.log(${message})`;
        return code;
    };

    Blockly.Natural['log'] = (block) => {
        let message = Blockly.Natural.valueToCode(block, 'MESSAGE'),
            code = `log this message: ${message}`;
        return code;
    };
};
let category = {
    name: 'Console',
    colour: COLOUR,
    blocks: [{
        id: 'log'
    }]
};

export default {
    register,
    category
};
