/* globals Blockly */

let Camera;

export default Camera = {
    partType: 'hardware',
    type: 'camera',
    label: 'Camera',
    image: '/assets/part/camera.svg',
    component: 'kano-part-camera',
    colour: '#FFB347',
    events: [{
        label: 'takes picture',
        id: 'picture-taken'
    }],
    blocks: [{
        block: () => {
            return {
                id: 'take_picture',
                message0: 'Camera: take picture',
                args0: [],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').takePicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').takePicture();\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'last_picture',
                message0: 'Camera: last picture taken',
                inputsInline: false,
                args0: [],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture();\n`;
                return code;
            };
        }
    }]
};
