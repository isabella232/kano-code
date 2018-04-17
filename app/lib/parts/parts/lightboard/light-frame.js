const lightFrame = {
    partType: 'ui',
    type: 'light-frame',
    label: Kano.MakeApps.Msg.PART_LIGHT_FRAME_NAME,
    image: '/assets/part/pixels-draw.svg',
    colour: '#FFB347',
    component: 'kano-part-light-frame',
    restrict: 'workspace',
    rotationDisabled: true,
    scaleDisabled: true,
    blocks: [],
    configPanel: 'kano-light-frame-part-editor',
    fullscreenEdit: true,
    customizable: {
        properties: [{
            key: 'width',
            type: 'range',
            label: Kano.MakeApps.Msg.WIDTH,
        },{
            key: 'height',
            type: 'range',
            label: Kano.MakeApps.Msg.HEIGHT,
        },{
            key: 'bitmap',
            type: 'bitmap',
            label: Kano.MakeApps.Msg.BITMAP,
        }],
        style: []
    },
    userProperties: {
        width: 16,
        height: 8,
        bitmap: Array.apply(null, Array(128)).map(String.prototype.valueOf, "#000000"),
    },
};

export default lightFrame;
