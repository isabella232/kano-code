/* globals Blockly */
let input;

export default input = {
    partType: 'ui',
    type: 'text-input',
    label: 'Text input',
    image: '/assets/part/text-field-icon.png',
    colour: '#3CAA36',
    customizable: {
        style: [],
        properties: []
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'input_text_get_value',
                output: true,
                message0: `${ui.name} value`
            };
        },
        javascript: (ui) => {
            return function () {
                return [`devices.get('${ui.id}').getValue()`];
            };
        },
        pseudo: (ui) => {
            return function () {
                return [`${ui.id}.value`];
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'input_text_set_value',
                message0: `set ${ui.name} to %1`,
                args0: [{
                    type: "input_value",
                    name: "INPUT"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'INPUT');
                return `devices.get('${ui.id}').setValue(${value});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let value = Blockly.Pseudo.valueToCode(block, 'INPUT') || `''`;
                return `${ui.id}.value = ${value};\n`;
            };
        }
    }],
    events: [{
        label: 'has changed',
        id: 'input-keyup'
    }]
};
