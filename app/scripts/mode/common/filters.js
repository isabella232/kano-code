export default [{
    block: () => {
        return {
                id: 'filter_threshold',
                message0: 'frame: black and white threshold %1',
                args0: [{
                    type: "input_value",
                    name: "THRESHOLD",
                    check: "Number"
                }],
                previousStatement: null,
                nextStatement: null
            };
    },
    javascript: (part) => {
        return (block) => {
            let threshold = Blockly.JavaScript.valueToCode(block, 'THRESHOLD') || 50;
            return `devices.get('${part.id}').addFilter('invert', ${threshold});\n`;
        };
    },
    pseudo: (part) => {
        return (block) => {
            let threshold = Blockly.Pseudo.valueToCode(block, 'THRESHOLD') || 50;
            return `devices.get('${part.id}').addFilter('threshold', ${threshold});\n`;
        };
    }
}];
