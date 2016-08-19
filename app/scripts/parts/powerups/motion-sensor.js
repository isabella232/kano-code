/* globals Blockly */

let motionSensor;

export default motionSensor = {
    partType: 'hardware',
    type: 'motion-sensor',
    label: 'Tripwire',
    image: '/assets/part/proximity.svg',
    colour: '#FFB347',
    component: 'kano-part-motion-sensor',
    customizable: {
        properties: [],
        style: []
    },
    userProperties: {},
    events: [{
        label: 'movement starts',
        id: 'movement-start'
    },
    {
        label: 'movement ends',
        id: 'movement-end'
    }],
    blocks: []
};
