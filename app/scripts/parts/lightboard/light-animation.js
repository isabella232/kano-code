let lightAnimation;

export default lightAnimation = {
    partType: 'ui',
    type: 'light-animation',
    label: 'Light animation',
    image: '/assets/part/lights.svg',
    colour: '#FFB347',
    component: 'kano-part-light-animation',
    blocks: [],
    configPanel: 'light-animation',
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: 'Width'
        },{
            key: 'height',
            type: 'range',
            label: 'Height'
        },{
            key: 'bitmaps',
            type: 'bitmap-animation',
            label: 'Bitmaps'
        }],
        style: []
    },
    userProperties: {
        width: 5,
        height: 5,
        bitmaps: [['#000000']]
    }
};
