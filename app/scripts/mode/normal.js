import backgroundBlocks from './common/background-blocks';

let normal;

export default normal = {
    id: 'normal',
    name: 'Background',
    colour: '#82C23D',
    blocks: backgroundBlocks,
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
