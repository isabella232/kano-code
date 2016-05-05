const COLOUR = '#C24242';

let register = (Blockly) => {
    Blockly.Blocks.set_background_color = {
        init: function () {
            let json = {
                id: 'set_background_color',
                colour: COLOUR,
                message0: 'Set background color to %1',
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: "Colour"
                }],
                previousStatement: null,
                nextStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.set_background_color = (block) => {
        let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
        return `devices.get('dropzone').style.backgroundColor = ${colour};\n`;
    };

    Blockly.Pseudo.set_background_color = (block) => {
        let colour = Blockly.Pseudo.valueToCode(block, 'COLOUR');
        return `setBackgroundColour(${colour});\n`;
    };
};

let category = {
    name: 'Background',
    id: 'background',
    colour: COLOUR,
    blocks: [{
        id: 'set_background_color'
    }]
};

export default {
    register,
    category
};
