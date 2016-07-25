import backgroundBlocks from './common/background-blocks';

let Camera;

export default Camera = {
    id: 'camera',
    name: 'Camera',
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-camera'
    },
    colour: '#9c39fe',
    excludeParts: ['light-rectangle', 'light-circle'],
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
                let code = `devices.get('${part.id}').getCamera().takePicture();\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().takePicture();\n`;
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
                let code = `devices.get('${part.id}').getCamera().lastPicture()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getCamera().lastPicture()`;
                return [code];
            };
        }
    }].concat(backgroundBlocks)
};
