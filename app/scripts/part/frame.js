let frame;

export default frame = {
    partType: 'ui',
    type: 'frame',
    label: 'Frame',
    image: 'assets/part/picture-icon.png',
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
        natural: (ui) => {
            return function (block) {
                let pic = Blockly.Natural.valueToCode(block, 'PICTURE'),
                    code = `show ${pic} on ${ui.name}\n`;
                return code;
            };
        }
    }]
};
