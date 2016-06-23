/* globals Blockly */

export default [{
    block: (ui) => {
        return {
            id: 'text',
            message0: `${ui.name}: text %1`,
            args0: [{
                type: "input_value",
                name: "MESSAGE",
                check: 'String'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'MESSAGE': '<shadow type="text"></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let message = Blockly.JavaScript.valueToCode(block, 'MESSAGE') || `''`;
            return `devices.get('${ui.id}').modules.text.text(${message});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let message = Blockly.Pseudo.valueToCode(block, 'MESSAGE') || `''`;
            return `devices.get('${ui.id}').modules.text.text(${message});\n`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'font',
            message0: `${ui.name}: font %1 %2`,
            args0: [{
                type: "input_value",
                name: "FONT",
                check: 'String'
            },{
                type: "input_value",
                name: "SIZE",
                check: 'Number'
            }],
            inlineInputs: true,
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'FONT': '<shadow type="text"></shadow>',
                'SIZE': '<shadow type="math_number"><field name="NUM">12</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let font = Blockly.JavaScript.valueToCode(block, 'FONT') || 'Bariol',
                size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 12;
            return `devices.get('${ui.id}').modules.text.font(${font}, ${size});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let font = Blockly.Pseudo.valueToCode(block, 'FONT') || 'Bariol',
                size = Blockly.Pseudo.valueToCode(block, 'SIZE') || 12;
            return `devices.get('${ui.id}').modules.text.font(${font}, ${size});\n`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'bold',
            message0: `${ui.name}: bold %1`,
            args0: [{
                type: "input_value",
                name: "STATE",
                check: 'Boolean'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'STATE': '<shadow type="logic_boolean"></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let state = Blockly.JavaScript.valueToCode(block, 'STATE') || false;
            return `devices.get('${ui.id}').modules.text.bold(${state});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let state = Blockly.Pseudo.valueToCode(block, 'STATE') || false;
            return `devices.get('${ui.id}').modules.text.bold(${state});\n`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'italic',
            message0: `${ui.name}: italic %1`,
            args0: [{
                type: "input_value",
                name: "STATE",
                check: 'Boolean'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'STATE': '<shadow type="logic_boolean"></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let state = Blockly.JavaScript.valueToCode(block, 'STATE') || false;
            return `devices.get('${ui.id}').modules.text.italic(${state});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let state = Blockly.Pseudo.valueToCode(block, 'STATE') || false;
            return `devices.get('${ui.id}').modules.text.italic(${state});\n`;
        };
    }
}];
