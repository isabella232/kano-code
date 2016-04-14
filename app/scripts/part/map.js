/* globals Blockly */

let map;

export default map = {
    partType: 'ui',
    type: 'map',
    label: 'Map',
    image: '/assets/part/map-icon.svg',
    colour: '#E73544',
    customizable: {
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'show_marker',
                message0: `${ui.name} move marker to %1 %2`,
                args0: [{
                    type: "input_value",
                    name: "LATITUDE"
                },{
                    type: "input_value",
                    name: "LONGITUDE"
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let latitude = Blockly.JavaScript.valueToCode(block, 'LATITUDE'),
                    longitude = Blockly.JavaScript.valueToCode(block, 'LONGITUDE'),
                    code = `devices.get('${ui.id}').showMarker(${latitude}, ${longitude});\n`;
                return code;
            };
        },
        natural: (ui) => {
            return function (block) {
                let latitude = Blockly.Natural.valueToCode(block, 'LATITUDE'),
                    longitude = Blockly.Natural.valueToCode(block, 'LONGITUDE'),
                    code = `${ui.name} move marker to ${latitude}, ${longitude}`;
                return code;
            };
        }
    }]
};
