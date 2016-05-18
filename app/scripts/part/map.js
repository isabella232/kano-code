/* globals Blockly */

let map;

export default map = {
    partType: 'ui',
    type: 'map',
    label: 'Map',
    image: '/assets/part/map.svg',
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
                message0: `${ui.name}: move marker to %1 %2`,
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
        pseudo: (ui) => {
            return function (block) {
                let latitude = Blockly.Pseudo.valueToCode(block, 'LATITUDE'),
                    longitude = Blockly.Pseudo.valueToCode(block, 'LONGITUDE'),
                    code = `${ui.id}.moveMarkerTo(${latitude}, ${longitude});\n`;
                return code;
            };
        }
    }]
};
