/* globals Blockly */

let gyroAccelerometer;

export default gyroAccelerometer = {
    partType: 'hardware',
    type: 'gyro-accelerometer',
    label: 'Gyroscope/Accelerometer',
    image: '/assets/part/proximity.svg',
    colour: '#FFB347',
    component: 'kano-part-gyro-accelerometer',
    customizable: {
        properties: [],
        style: []
    },
    userProperties: {},
    events: [{
        label: 'reads data',
        id: 'gyro-accel-update'
    }],
    blocks: [{
        block: (part) => {
            return {
                id: 'gyroscope_value',
                message0: `Gyroscope %1 axis`,
                inputsInline: true,
                args0: [{
                    type: 'field_dropdown',
                    name: 'AXIS',
                    options: [
                        ['x', 'x'],
                        ['y', 'y'],
                        ['z', 'z']
                    ]
                }],
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let axis = block.getFieldValue('AXIS') || 'x',
                    code = `devices.get('${part.id}').getGyroData('${axis}')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let axis = block.getFieldValue('AXIS') || 'x',
                    code = `devices.get('${part.id}').getGyroData('${axis}')`;
                return [code];
            };
        }
    }, {
        block: (part) => {
            return {
                id: 'accelerometer_value',
                message0: `Accelerometer %1 axis`,
                inputsInline: true,
                args0: [{
                    type: 'field_dropdown',
                    name: 'AXIS',
                    options: [
                        ['x', 'x'],
                        ['y', 'y'],
                        ['z', 'z']
                    ]
                }],
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let axis = block.getFieldValue('AXIS') || 'x',
                    code = `devices.get('${part.id}').getAccelerometerData('${axis}')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let axis = block.getFieldValue('AXIS') || 'x',
                    code = `devices.get('${part.id}').getAccelerometerData('${axis}')`;
                return [code];
            };
        }
    }]
};
