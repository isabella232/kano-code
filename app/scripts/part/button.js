/* globals Blockly */
let button;

export default button = {
    partType: 'ui',
    type: 'button',
    label: 'Button',
    image: '/assets/part/button.svg',
    description: 'A button that can trigger all sort of crazy stuff',
    colour: '#3f51b5',
    customizable: {
        properties: [{
            key: 'label',
            type: 'text',
            label: 'Label'
        }],
        style: ['background-color']
    },
    userProperties: {
        label: 'Click me'
    },
    events: [{
        label: 'is clicked',
        id: 'clicked'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'get_label',
                output: "String",
                message0: `${ui.name} label`
            };
        },
        javascript: (ui) => {
            return function () {
                return [`devices.get('${ui.id}').getLabel()`];
            };
        },
        pseudo: (ui) => {
            return function () {
                return [`${ui.id}.label`];
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_label',
                message0: `set ${ui.name} label to %1`,
                args0: [{
                    type: "input_value",
                    name: "LABEL"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let label = Blockly.JavaScript.valueToCode(block, 'LABEL');
                return `devices.get('${ui.id}').setLabel(${label});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let label = Blockly.Pseudo.valueToCode(block, 'LABEL') || `''`;
                return `${ui.id}.setLabel(${label});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_background_colour',
                message0: `set ${ui.name} background colour to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: "Colour"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setBackgroundColour(${colour});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let colour = Blockly.Pseudo.valueToCode(block, 'COLOUR') || `'orange'`;
                return `${ui.id}.setBackgroundColour(${colour});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_text_colour',
                message0: `set ${ui.name} text colour to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: "Colour"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setColour(${colour});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let colour = Blockly.Pseudo.valueToCode(block, 'COLOUR') || `'orange'`;
                return `${ui.id}.setColour(${colour});\n`;
            };
        }
    }]
};
