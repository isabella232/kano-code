let lightFrame;

export default lightFrame = {
    partType: 'ui',
    type: 'lightframe',
    label: 'Light frame',
    image: '/assets/part/lights.svg',
    colour: '#FFB347',
    component: 'kano-part-light-frame',
    blocks: [],
    configPanel: 'light-frame',
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
            key: 'bitmap',
            type: 'bitmap',
            label: 'Bitmap'
        }],
        style: []
    },
    userProperties: {
        width: 5,
        height: 5
    }
};
