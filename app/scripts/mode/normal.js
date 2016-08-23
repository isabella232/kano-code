import general from '../parts/canvas/blocks/general';
import paths from '../parts/canvas/blocks/paths';
import setters from '../parts/canvas/blocks/setters';
import shapes from '../parts/canvas/blocks/shapes';
import space from '../parts/canvas/blocks/space';

let normal,
    blocks = [];

blocks = blocks.concat(general);

blocks.push({
    block: (ui) => {
        return {
            id: 'clear all',
            message0: `${ui.name}: clear drawing`,
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
});

blocks = blocks.concat(setters);
blocks = blocks.concat(space);
blocks = blocks.concat(paths);
blocks = blocks.concat(shapes);

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
    parts: ['clock', 'microphone', 'speaker', 'button', 'box',
                'image', 'map', 'scrolling-text', 'slider',
                'text-input', 'text', 'rss', 'sports', 'weather',
                'share', 'canvas']
};
