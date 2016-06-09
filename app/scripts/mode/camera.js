let Camera;

export default Camera = {
    id: 'camera',
    name: 'Camera',
    allowBackground: true,
    component: 'kano-part-camera',
    colour: '#333333',
    excludeParts: ['light-rectangle'],
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
                args0: [],
                inputsInline: true,
                output: 'String'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').lastPicture()`;
                return [code];
            };
        }
    }]
};
