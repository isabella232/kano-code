/* globals Blockly */

let image;

export default image = {
    partType: 'ui',
    type: 'image',
    label: 'Image',
    image: '/assets/part/picture-icon.png',
    colour: '#E73544',
    customizable: {
        properties: [{
            key: 'src',
            type: 'image',
            label: 'Image'
        }],
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    events: [{
        label: 'is clicked',
        id: 'clicked'
    }],
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_image_to',
                message0: `set ${ui.name} to %1`,
                args0: [{
                    type: "input_value",
                    name: "PICTURE"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                    code = `devices.get('${ui.id}').setImage(${pic});\n`;
                return code;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let pic = Blockly.Pseudo.valueToCode(block, 'PICTURE'),
                    code = `${ui.id}.setImageTo(${pic});\n`;
                return code;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'source',
                message0: `${ui.name} source`,
                output: true
            };
        },
        javascript: (ui) => {
            return function () {
                let code = `devices.get('${ui.id}').getSource()`;
                return [code];
            };
        },
        pseudo: (ui) => {
            return function () {
                let code = `${ui.id}.source`;
                return [code];
            };
        }
    }]
};
