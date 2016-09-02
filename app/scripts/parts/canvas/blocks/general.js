/* globals Blockly */
export default [{
    block: (ui) => {
        return {
            id: 'set_background_color',
            message0: `${ui.name}: background color %1`,
            args0: [{
                type: "input_value",
                name: "COLOR",
                check: 'Colour'
            }],
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (ui) => {
        return function (block) {
            let color = Blockly.JavaScript.valueToCode(block, 'COLOR');
            return `devices.get('${ui.id}').setBackgroundColor(${color});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let color = Blockly.Pseudo.valueToCode(block, 'COLOR');
            return `devices.get('${ui.id}').setBackgroundColor(${color});\n`;
        };
    }
}];
