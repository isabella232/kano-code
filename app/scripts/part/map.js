let map;

export default map = {
    type: 'map',
    label: 'Map',
    image: 'assets/part/map-icon.svg',
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
                message0: ui.name,
                message1: 'move marker to %1',
                args1: [{
                    type: "input_value",
                    name: "POSITION"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let pos = Blockly.JavaScript.valueToCode(block, 'POSITION'),
                    code = `devices.get('${ui.id}').showMarker(${pos});\n`;
                return code;
            };
        },
        natural: (ui) => {
            return function (block) {
                let pos = Blockly.Natural.valueToCode(block, 'POSITION'),
                    code = `${ui.name} move marker to ${pos}`;
                return code;
            };
        }
    }]
};
