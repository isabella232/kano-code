export default [{
    block: () => {
        return {
            id: 'filter_invert',
            message0: 'frame: invert',
            previousStatement: null,
            nextStatement: null
        };
    },
    javascript: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('invert');\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('invert');\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_grayscale',
                message0: 'frame: grayscale',
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('grayscale');\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            return `devices.get('${part.id}').addFilter('grayscale');\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_blur',
                message0: 'frame: blur',
                message1: 'size %1',
                args1: [{
                    type: 'input_value',
                    name: 'SIZE',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 50;
            return `devices.get('${part.id}').addFilter('gaussianBlur', ${size});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let size = Blockly.Pseudo.valueToCode(block, 'SIZE') || 50;
            return `devices.get('${part.id}').addFilter('gaussianBlur', ${size});\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_colorize',
                message0: 'frame: colorize',
                message1: 'color %1 value %2',
                args1: [{
                    type: 'input_value',
                    name: 'COLOR',
                    check: 'Colour',
                    align: 'RIGHT'
                },{
                    type: 'input_value',
                    name: 'VALUE',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            let color = Blockly.JavaScript.valueToCode(block, 'COLOR') || "'#ff0000'",
                value = Blockly.JavaScript.valueToCode(block, 'VALUE') || 50;
            value = Math.max(0, Math.min(1, value / 100));
            return `devices.get('${part.id}').addFilter('colorize', devices.get('${part.id}').hexToRgb(${color}), ${value});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let color = Blockly.Pseudo.valueToCode(block, 'COLOR') || "'#ff0000'",
                value = Blockly.Pseudo.valueToCode(block, 'VALUE') || 0.5;
            return `devices.get('${part.id}').addFilter('colorize', ${color}, ${value});\n`;
        };
    }
}];
