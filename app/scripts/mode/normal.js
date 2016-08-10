import general from '../parts/canvas/blocks/general';
import paths from '../parts/canvas/blocks/paths';
import setters from '../parts/canvas/blocks/setters';
import shapes from '../parts/canvas/blocks/shapes';
import space from '../parts/canvas/blocks/space';

let normal,
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
                return `devices.get('${ui.id}').reset();`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                return `devices.get('${ui.id}').reset();`;
            };
        }
    }];

blocks = blocks.concat(general);
blocks = blocks.concat(paths);
blocks = blocks.concat(setters);
blocks = blocks.concat(shapes);
blocks = blocks.concat(space);

export default normal = {
    id: 'normal',
    name: 'Draw',
    colour: '#82C23D',
    blocks,
    allowBackground: true,
    workspace: {
        viewport: {
            width: 512,
            height: 384
        },
        component: 'kano-workspace-normal'
    },
    excludeParts: ['light-rectangle', 'light-circle', 'picture-list']
};
