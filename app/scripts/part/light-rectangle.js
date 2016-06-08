/* globals Blockly */

let lightRectangle;

export default lightRectangle = {
    partType: 'hardware',
    type: 'light-rectangle',
    label: 'Light rectangle',
    image: '/assets/part/lights.svg',
    colour: '#FFB347',
    component: 'kano-part-light-rectangle',
    blocks: [{
        block: (part) => {
            return {
                id: 'draw',
                message0: `${part.name} draw rectangle %1, %2, %3, %4, %5`,
                args0: [{
                    type: "input_value",
                    name: "X",
                    check: 'Number'
                },{
                    type: "input_value",
                    name: "Y",
                    check: 'Number'
                },{
                    type: "input_value",
                    name: "WIDTH",
                    check: 'Number'
                },{
                    type: "input_value",
                    name: "HEIGHT",
                    check: 'Number'
                },{
                    type: "input_value",
                    name: "COLOR",
                    check: 'Colour'
                }],
                inputsInline: true,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'X': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'Y': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                    'WIDTH': '<shadow type="math_number"><field name="NUM">1</field></shadow>',
                    'HEIGHT': '<shadow type="math_number"><field name="NUM">1</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let x = Blockly.JavaScript.valueToCode(block, 'X') || 0,
                    y = Blockly.JavaScript.valueToCode(block, 'Y') || 0,
                    width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 0,
                    height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 0,
                    color = Blockly.JavaScript.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').draw(${x}, ${y}, ${width}, ${height}, ${color});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let x = Blockly.Pseudo.valueToCode(block, 'X') || 0,
                    y = Blockly.Pseudo.valueToCode(block, 'Y') || 0,
                    width = Blockly.Pseudo.valueToCode(block, 'WIDTH') || 0,
                    height = Blockly.Pseudo.valueToCode(block, 'HEIGHT') || 0,
                    color = Blockly.Pseudo.valueToCode(block, 'COLOR') || '""',
                    code = `devices.get('${part.id}').draw(${x}, ${y}, ${width}, ${height}, ${color});\n`;
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
                id: 'set_width',
                message0: `${part.name} set width to %1`,
                args0: [{
                    type: "input_value",
                    name: "WIDTH",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'WIDTH': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 1,
                    code = `devices.get('${part.id}').set('shape.width', ${width});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let width = Blockly.Pseudo.valueToCode(block, 'WIDTH') || 1,
                    code = `devices.get('${part.id}').set('shape.width', ${width});\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            return {
                id: 'set_height',
                message0: `${part.name} set height to %1`,
                args0: [{
                    type: "input_value",
                    name: "HEIGHT",
                    check: 'Number'
                }],
                inputsInline: false,
                previousStatement: null,
                nextStatement: null,
                shadow: {
                    'HEIGHT': '<shadow type="math_number"><field name="NUM">0</field></shadow>'
                }
            };
        },
        javascript: (part) => {
            return (block) => {
                let height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 1,
                    code = `devices.get('${part.id}').set('shape.height', ${height});\n`;
                return code;
            };
        },
        pseudo: (part) => {
            return (block) => {
                let height = Blockly.Pseudo.valueToCode(block, 'HEIGHT') || 1,
                    code = `devices.get('${part.id}').set('shape.height', ${height});\n`;
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
                id: 'get_width',
                message0: `${part.name} width`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.width')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.width')`;
                return [code];
            };
        }
    },{
        block: (part) => {
            return {
                id: 'get_height',
                message0: `${part.name} height`,
                output: 'Number'
            };
        },
        javascript: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.height')`;
                return [code];
            };
        },
        pseudo: (part) => {
            return (block) => {
                let code = `devices.get('${part.id}').get('shape.height')`;
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
