/* globals Blockly */
let input;

export default input = {
    partType: 'ui',
    type: 'text-input',
    label: 'Text input',
    image: '/assets/part/text-input.svg',
    colour: '#3CAA36',
    customizable: {
        style: [],
        properties: [{
            key: 'value',
            type: 'text',
            label: 'Text'
        },{
            key: 'placeholder',
            type: 'text',
            label: 'Placeholder'
        }]
    },
    userProperties: {
        placeholder: 'Type in here...'
    },
    events: [{
        label: 'has changed',
        id: 'input-keyup'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'input_text_get_value',
                output: 'String',
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
                id: 'input_text_get_placeholder',
                output: 'String',
                message0: `${ui.name} placeholder`
            };
        },
        javascript: (ui) => {
            return function () {
                return [`devices.get('${ui.id}').getPlaceholder()`];
            };
        },
        pseudo: (ui) => {
            return function () {
                return [`${ui.id}.placeholder`];
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'input_text_set_value',
                message0: `set ${ui.name} value to %1`,
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
                return `${ui.id}.setValue(${value});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'input_text_set_placeholder',
                message0: `set ${ui.name} placeholder to %1`,
                args0: [{
                    type: "input_value",
                    name: "PLACEHOLDER"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let placeholder = Blockly.JavaScript.valueToCode(block, 'PLACEHOLDER');
                return `devices.get('${ui.id}').setPlaceholder(${placeholder});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let placeholder = Blockly.Pseudo.valueToCode(block, 'PLACEHOLDER') || `''`;
                return `${ui.id}.setPlaceholder(${placeholder});\n`;
            };
        }
    }]
};
