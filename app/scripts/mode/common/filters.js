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
},{
    block: () => {
        return {
                id: 'filter_threshold',
                message0: 'frame: black and white',
                message1: 'threshold %1',
                args1: [{
                    type: 'input_value',
                    name: 'THRESHOLD',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            let threshold = Blockly.JavaScript.valueToCode(block, 'THRESHOLD') || 50;
            threshold = Math.max(0, Math.min(255, threshold * 2.55));
            return `devices.get('${part.id}').addFilter('threshold', ${threshold});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let threshold = Blockly.Pseudo.valueToCode(block, 'THRESHOLD') || 50;
            threshold = Math.max(0, Math.min(255, threshold * 2.55));
            return `devices.get('${part.id}').addFilter('threshold', ${threshold});\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_pixelate',
                message0: 'frame: pixelate',
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
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 20;
            size = Math.max(1, Math.min(100, size));
            return `devices.get('${part.id}').addFilter('pixelate', ${size});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let size = Blockly.Pseudo.valueToCode(block, 'SIZE') || 20;
            size = Math.max(1, Math.min(100, size));
            return `devices.get('${part.id}').addFilter('pixelate', ${size});\n`;
        };
    }
},{
    block: () => {
        return {
                id: 'filter_contrast',
                message0: 'frame: contrast %1',
                args0: [{
                    type: 'input_value',
                    name: 'CONTRAST',
                    check: 'Number',
                    align: 'RIGHT'
                }],
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            let contrast = Blockly.JavaScript.valueToCode(block, 'CONTRAST') || 50;
            contrast = Math.max(-150, Math.min(150, (contrast * 3) - 150));
            return `devices.get('${part.id}').addFilter('contrast', ${contrast});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let contrast = Blockly.Pseudo.valueToCode(block, 'CONTRAST') || 50;
            contrast = Math.max(-100, Math.min(100, (contrast * 2) - 100));
            return `devices.get('${part.id}').addFilter('contrast', ${contrast});\n`;
        };
    }
}];
