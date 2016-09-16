/* globals Blockly */

let scrollingText;

export default scrollingText = {
    partType: 'ui',
    type: 'scrolling-text',
    label: 'Scroller',
    image: '/assets/part/scrolling-text.svg',
    colour: '#E73544',
    customizable: {
        properties: [{
            key: 'text',
            type: 'text',
            label: 'Text'
        }],
        style: ['font-family', 'color', 'width', 'height']
    },
    userStyle: {
        'font-family': 'Bariol',
        width: '200px',
        height: '50px',
        color: '#000000'
    },
    userProperties: {
        text: 'My scrolling text'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'scroll',
                message0: `${ui.name}: scroll %1`,
                args0: [{
                    type: "input_value",
                    name: "TEXT"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT'),
                    code = `devices.get('${ui.id}').scroll(${text});\n`;
                return code;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let text = Blockly.Pseudo.valueToCode(block, 'TEXT'),
                    code = `${ui.id}.scroll(${text});\n`;
                return code;
            };
        }
    }]
};
