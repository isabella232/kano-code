/* globals Blockly */

let box;

export default box = {
    partType: 'ui',
    type: 'box',
    label: 'Box',
    image: '/assets/part/box.svg',
    colour: '#E73544',
    customizable: {
        properties: [{
            key: 'strokeSize',
            type: 'size',
            label: 'Stroke Size',
            symbol: 'pixels'
        },{
            key: 'strokeColor',
            type: 'color',
            label: 'Stroke Color'
        }],
        style: ['width', 'height', 'background-color']
    },
    userStyle: {
        width: '200px',
        height: '200px',
        'background-color': '#F5F5F5'
    },
    userProperties: {
        strokeSize: '2',
        strokeColor: 'black'
    },
    events: [{
        label: 'is clicked',
        id: 'clicked'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_stroke_size',
                message0: `${ui.name}: set stroke size to %1`,
                args0: [{
                    type: "input_value",
                    name: "SIZE",
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let size = Blockly.JavaScript.valueToCode(block, 'SIZE');
                return `devices.get('${ui.id}').setStrokeSize(${size});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let size = Blockly.Pseudo.valueToCode(block, 'SIZE') || `''`;
                return `${ui.id}.setStrokeSize(${size});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_stroke_colour',
                message0: `${ui.name}: set stroke color to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: 'Colour'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setStrokeColor(${colour});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let colour = Blockly.Pseudo.valueToCode(block, 'COLOUR') || `''`;
                return `${ui.id}.setStrokeColor(${colour});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_background_colour',
                message0: `${ui.name}: set background color to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOUR",
                    check: 'Colour'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let colour = Blockly.JavaScript.valueToCode(block, 'COLOUR');
                return `devices.get('${ui.id}').setBackgroundColor(${colour});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let colour = Blockly.Pseudo.valueToCode(block, 'COLOUR') || `''`;
                return `${ui.id}.setBackgroundColor(${colour});\n`;
            };
        }
    }]
};
