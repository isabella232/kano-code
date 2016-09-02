/* globals Blockly */

let gestureSensor;

export default gestureSensor = {
    partType: 'hardware',
    type: 'gesture-sensor',
    label: 'Gesture Sensor',
    image: '/assets/part/box.svg',
    colour: '#FFB347',
    component: 'kano-part-gesture-sensor',
    customizable: {
        properties: [],
        style: []
    },
    userProperties: {},
    events: [{
        label: 'gesture up',
        id: 'gesture-up'
    },
    {
        label: 'gesture down',
        id: 'gesture-down'
    },
    {
        label: 'gesture left',
        id: 'gesture-left'
    },
    {
        label: 'gesture right',
        id: 'gesture-right'
    },
    {
        label: 'gesture near',
        id: 'gesture-near'
    },
    {
        label: 'gesture far',
        id: 'gesture-far'
    }],
    blocks: []
};
