let text;

export default text = {
    partType: 'ui',
    type: 'text',
    label: 'Text',
    image: '/assets/part/text.svg',
    colour: '#607d8b',
    customizable: {
        style: ['color', 'font-size', 'font-family'],
        properties: [{
            key: 'text',
            type: 'text',
            label: 'Text'
        }]
    },
    userStyle: {
        color: '#000000',
        'font-size': '1em',
        'font-family': 'Bariol'
    },
    userProperties: {
        text: 'My text'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_value',
                message0: `${ui.name}: set text to %1`,
                args0: [{
                    type: "input_value",
                    name: "INPUT"
                }],
                nextStatement: null,
                previousStatement: null
            }
        },
        javascript: (ui) => {
            return function (block) {
                let value = Blockly.JavaScript.valueToCode(block, 'INPUT');
                return `devices.get('${ui.id}').setValue(${value});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let value = Blockly.Pseudo.valueToCode(block, 'INPUT');
                return `${ui.id}.setText(${value});\n`;
            };
        }
    },
    {
        block: (ui) => {
            return {
                id: 'get_text',
                message0: `${ui.name}: text`,
                output: 'String'
            }
        },
        javascript: (ui) => {
            return function (block) {
                return [`devices.get('${ui.id}').getValue()`];
            };
        },
        pseudo: (ui) => {
            return function (block) {
                return [`${ui.id}.text`];
            };
        }
    }],
    events: [{
        label: 'is clicked',
        id: 'clicked'
    }]
};