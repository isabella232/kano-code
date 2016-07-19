/* globals Blockly */

let kaleidoscope;

export default kaleidoscope = {
    partType: 'ui',
    type: 'kaleidoscope',
    label: 'Kaleidoscope',
    component: 'kano-part-kaleidoscope',
    image: '/assets/part/box.svg',
    customizable: {
        properties: [{
            key: 'image',
            type: 'image',
            label: 'Image'
        }],
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_image',
                message0: `${ui.name}: set image to %1`,
                args0: [{
                    type: "input_value",
                    name: "SOURCE",
                    check: 'String'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let source = Blockly.JavaScript.valueToCode(block, 'SOURCE');
                return `devices.get('${ui.id}').setSource(${source});`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let source = Blockly.JavaScript.valueToCode(block, 'SOURCE');
                return `devices.get('${ui.id}').setSource(${source});`;
            };
        }
    }]
};
