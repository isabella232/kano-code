/* globals Blockly */

let lightCircle;

export default lightCircle = {
    partType: 'hardware',
    type: 'light-circle',
    label: 'Light circle',
    image: '/assets/part/lights.svg',
    colour: '#FFB347',
    component: 'kano-part-light-circle',
    blocks: [{
        block: (part) => {
            return {
                id: 'draw',
                message0: `${part.name} draw: x %1 y %2 radius %3 color %4`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: "input_value",
                    name: "Y",
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: "input_value",
                    name: "RADIUS",
                    check: 'Number',
                    align: 'RIGHT'
                },{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour',
                    align: 'RIGHT'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'RADIUS': '<shadow type="math_number"><field name="NUM">1</field></shadow>',
                    'COLOR': '<shadow type="colour_picker"><field name="COLOUR">#ff0000</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 0,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').draw(${x}, ${y}, ${radius}, ${color});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    y = Blockly.Pseudo.valueToCode(block, 'Y') || 0,
                    radius = Blockly.Pseudo.valueToCode(block, 'RADIUS') || 0,
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').draw(${x}, ${y}, ${radius}, ${color});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_x',
                message0: `${part.name} set X to %1`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').set('shape.x', ${x});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    code = `devices.get('${part.id}').set('shape.x', ${x});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_y',
                message0: `${part.name} set Y to %1`,
                args0: [{
                    type: "input_value",
                    name: "Y",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').set('shape.y', ${y});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let y = Blockly.Pseudo.valueToCode(block, 'Y') || 0,
                    code = `devices.get('${part.id}').set('shape.y', ${y});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_size',
                message0: `${part.name} set radius to %1`,
                args0: [{
                    type: "input_value",
                    name: "RADIUS",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'RADIUS': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 1,
                    code = `devices.get('${part.id}').set('shape.radius', ${radius});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let radius = Blockly.Pseudo.valueToCode(block, 'RADIUS') || 1,
                    code = `devices.get('${part.id}').set('shape.radius', ${radius});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_color',
                message0: `${part.name} set color to %1`,
                args0: [{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: (part) => {
            return (block) => {
                let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || 1,
                    code = `devices.get('${part.id}').set('shape.color', ${color});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let color = Blockly.Pseudo.valueToCode(block, 'COLOR') || 1,
                    code = `devices.get('${part.id}').set('shape.color', ${color});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_x',
                message0: `${part.name} X`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.x')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.x')`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_y',
                message0: `${part.name} Y`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.y')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.y')`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_radius',
                message0: `${part.name} radius`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.radius')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.radius')`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_color',
                message0: `${part.name} color`,
                output: 'Colour'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.color')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.color')`;
                return [code];
            };
        }
    }]
};
