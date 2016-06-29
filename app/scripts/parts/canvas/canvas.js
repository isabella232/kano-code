import general from './blocks/general';
import paths from './blocks/paths';
import setters from './blocks/setters';
import shapes from './blocks/shapes';
import space from './blocks/space';
import text from './blocks/text';

let canvas,
    blocks = [{
        block: (ui) => {
            return {
                id: 'clear',
                message0: `${ui.name}: clear`,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                return `devices.get('${ui.id}').resetSession();`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                return `devices.get('${ui.id}').resetSession();`;
            };
        }
    }];

blocks = blocks.concat(general);
blocks = blocks.concat(paths);
blocks = blocks.concat(setters);
blocks = blocks.concat(shapes);
blocks = blocks.concat(space);
blocks = blocks.concat(text);

export default canvas = {
    partType: 'ui',
    type: 'canvas',
    label: 'Canvas',
    image: '/assets/part/box.svg',
    component: 'kano-part-canvas',
    colour: '#E73544',
    customizable: {
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    blocks: blocks
};
