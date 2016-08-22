/* globals Blockly */

let kaleidoscope;

export default kaleidoscope = {
    partType: 'ui',
    type: 'kaleidoscope',
    label: 'Prism',
    component: 'kano-part-kaleidoscope',
    image: '/assets/part/prism.svg',
    customizable: {
        properties: [{
            key: 'offsetRotation',
            type: 'range',
            label: 'Offset Rotation',
            min: 0,
            max: 360
        },{
            key: 'slices',
            type: 'range',
            label: 'Slices',
            min: 1,
            max: 30
        },{
            key: 'zoom',
            type: 'range',
            label: 'Zoom',
            min: 1,
            max: 10
        },{
            key: 'speed',
            type: 'range',
            label: 'Speed',
            min: 0,
            max: 20
        }],
        style: ['width', 'height']
    },
    userStyle: {
        width: '200px',
        height: '200px'
    },
    userProperties: {
        speed: 1,
        offsetRotation: 0,
        zoom: 1,
        slices: 12
    },
    blocks: [{
        block: (ui) => {
            return {
                id: 'set_image',
                message0: `${ui.name}: set image to %1`,
                args0: [{
                    type: "input_value",
                    name: "SOURCE",
                    check: 'String'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let source = Blockly.JavaScript.valueToCode(block, 'SOURCE');
                return `devices.get('${ui.id}').setSource(${source});\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let source = Blockly.JavaScript.valueToCode(block, 'SOURCE');
                return `devices.get('${ui.id}').setSource(${source});\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_speed',
                message0: `${ui.name}: set speed to %1`,
                args0: [{
                    type: "input_value",
                    name: "SPEED",
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED');
                return `devices.get('${ui.id}').setSpeed(Math.max(0, Math.min(100, ${speed})));\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let speed = Blockly.JavaScript.valueToCode(block, 'SPEED');
                return `devices.get('${ui.id}').setSpeed(Math.max(0, Math.min(100, ${speed})));\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_offset_rotation',
                message0: `${ui.name}: set offset rotation to %1`,
                args0: [{
                    type: "input_value",
                    name: "ROTATION",
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let rotation = Blockly.JavaScript.valueToCode(block, 'ROTATION');
                return `devices.get('${ui.id}').setOffsetRotation(Math.max(0, Math.min(360, ${rotation})));\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let rotation = Blockly.JavaScript.valueToCode(block, 'ROTATION');
                return `devices.get('${ui.id}').setOffsetRotation(Math.max(0, Math.min(360, ${rotation})));\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_slices',
                message0: `${ui.name}: set slices to %1`,
                args0: [{
                    type: "input_value",
                    name: "SLICES",
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let slices = Blockly.JavaScript.valueToCode(block, 'SLICES');
                return `devices.get('${ui.id}').setSlices(Math.max(1, Math.min(30, ${slices})));\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let slices = Blockly.JavaScript.valueToCode(block, 'SLICES');
                return `devices.get('${ui.id}').setSlices(Math.max(1, Math.min(30, ${slices})));\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'set_zoom',
                message0: `${ui.name}: set zoom to %1`,
                args0: [{
                    type: "input_value",
                    name: "ZOOM",
                    check: 'Number'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (ui) => {
            return function (block) {
                let zoom = Blockly.JavaScript.valueToCode(block, 'ZOOM');
                return `devices.get('${ui.id}').setZoom(Math.max(1, Math.min(10, ${zoom})));\n`;
            };
        },
        pseudo: (ui) => {
            return function (block) {
                let zoom = Blockly.JavaScript.valueToCode(block, 'ZOOM');
                return `devices.get('${ui.id}').setZoom(Math.max(1, Math.min(10, ${zoom})));\n`;
            };
        }
    },{
        block: (ui) => {
            return {
                id: 'get_property',
                message0: `${ui.name}: %1`,
                args0: [{
                    type: "field_dropdown",
                    name: "PROPERTY",
                    options: [
                        ['speed', 'model.userProperties.speed'],
                        ['slices', 'model.userProperties.slices'],
                        ['rotation offset', 'model.userProperties.offsetRotation'],
                        ['zoom', 'model.userProperties.zoom'],
                    ]
                }],
                output: 'Number'
            };
        },
        javascript: (ui) => {
            return function (block) {
                var parent = block.getParent(),
                    property = block.getFieldValue('PROPERTY'),
                    method = `.getProperty('${property}')`,
                    parentType,
                    pieces,
                    blockType;
                if (parent) {
                    parentType = parent.type;
                    pieces = parentType.split('#');
                    blockType = pieces.length > 1 ? pieces[1] : pieces[0];
                    if (blockType === 'connect') {
                        method = `.getConnectable('${property}')`;
                    }
                }
                return [`devices.get('${ui.id}')${method}`];
            };
        },
        pseudo: (ui) => {
            return function (block) {
                var parent = block.getParent(),
                    property = block.getFieldValue('PROPERTY'),
                    method = `.getProperty('${property}')`,
                    parentType,
                    pieces,
                    blockType;
                if (parent) {
                    parentType = parent.type;
                    pieces = parentType.split('#');
                    blockType = pieces.length > 1 ? pieces[1] : pieces[0];
                    if (blockType === 'connect') {
                        method = `.getConnectable('${property}')`;
                    }
                }
                return [`devices.get('${ui.id}')${method}`];
            };
        }
    }]
};
