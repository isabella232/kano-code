let box;

export default box = {
    partType: 'ui',
    type: 'box',
    label: 'Box',
    image: '/assets/part/box.svg',
    colour: '#E73544',
    customizable: {
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'draw_picture',
                message0: ui.name,
                message1: 'draw picture of %1',
                args1: [{
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
                    code = `devices.get('${ui.id}').drawPicture(${pic});\n`;
                return code;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let pic = Blockly.Pseudo.valueToCode(block, 'PICTURE'),
                    code = `${ui.id}.drawPicture(${pic});\n`;
                return code;
            };
        }
    }]
};
