/* globals Blockly */

let light;

export default light = {
    partType: 'hardware',
    type: 'light',
    label: 'Lights',
    image: '/assets/part/lights.svg',
    colour: '#FFB347',
    blocks: [{
        block: () => {
            return {
                id: 'turn_on',
                message0: 'Lights: set %1 color to %2',
                inputsInline: true,
                args0: [{
                    type: "input_value",
                    name: "TARGET",
                    check: 'Light'
                },
                {
                    type: "input_value",
                    name: "COLOR",
                    check: "Colour"
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let target = Blockly.JavaScript.valueToCode(block, 'TARGET') || '',
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '',
                    code = `devices.get('${part.id}').turnOn(${target}, ${color})`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let target = Blockly.Pseudo.valueToCode(block, 'TARGET') || '',
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '',
                    code = `devices.get('${part.id}').turnOn(${target}, ${color})`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'turn_off',
                message0: 'Lights: turn %1 off',
                inputsInline: true,
                args0: [{
                    type: "input_value",
                    name: "TARGET",
                    check: 'Light'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let target = Blockly.JavaScript.valueToCode(block, 'TARGET') || '',
                    code = `devices.get('${part.id}').turnOff(${target})`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let target = Blockly.Pseudo.valueToCode(block, 'TARGET') || '',
                    code = `devices.get('${part.id}').turnOff(${target})`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'lights_all',
                message0: 'all lights',
                output: 'Light'
            };
        },
        javascript: () => {
            return () => {
                return [{
                    type: 'all'
                }];
            };
        },
        pseudo: () => {
            return () => {
                return [{
                    type: 'all'
                }];
            };
        }
    },{
        block: () => {
            return {
                id: 'light_x_y',
                message0: 'light at %1 %2',
                inputsInline: true,
                output: 'Light',
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                },
                {
                    type: "input_value",
                    name: "Y",
                    check: "Number"
                }],
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: () => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    y = Blockly.JavaScript.valueToCode(block, 'Y') || 0;
                return [{
                    type: 'single',
                    x: x,
                    y: y
                }];
            };
        },
        pseudo: () => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    y = Blockly.Pseudo.valueToCode(block, 'Y') || 0;
                return [{
                    type: 'single',
                    x: x,
                    y: y
                }];
            };
        }
    }]
};
