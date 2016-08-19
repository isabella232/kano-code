/* globals Blockly */

let proximitySensor;

export default proximitySensor = {
    partType: 'hardware',
    type: 'proximity-sensor',
    label: 'Proximity Sensor',
    image: '/assets/part/box.svg',
    colour: '#FFB347',
    component: 'kano-part-proximity-sensor',
    customizable: {
        properties: [],
        style: []
    },
    userProperties: {},
    events: [{
        label: 'reads data',
        id: 'proximity-update'
    }],
    blocks: [{
        block: (part) => {
            return {
                id: 'proximity_sensor_value',
                message0: `${part.name} value`,
                inputsInline: false,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').getValue()`;
                return [code];
            };
        }
    }]
};
