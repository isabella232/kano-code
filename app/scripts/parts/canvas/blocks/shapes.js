/* globals Blockly */

export default [{
    block: (ui) => {
        return {
            id: 'circle',
            message0: `${ui.name}: circle %1`,
            args0: [{
                type: "input_value",
                name: "RADIUS",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUS': '<shadow type="math_number"><field name="NUM">5</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 'null';
            return `devices.get('${ui.id}').modules.shapes.circle(${radius});\n`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let radius = Blockly.Pseudo.valueToCode(block, 'RADIUS') || 'null';
            return `devices.get('${ui.id}').modules.shapes.circle(${radius});\n`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'ellipse',
            message0: `${ui.name}: ellipse %1 %2`,
            args0: [{
                type: "input_value",
                name: "RADIUSX",
                check: 'Number'
            },{
                type: "input_value",
                name: "RADIUSY",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUSX': '<shadow type="math_number"><field name="NUM">5</field></shadow>',
                'RADIUSY': '<shadow type="math_number"><field name="NUM">5</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let radiusx = Blockly.JavaScript.valueToCode(block, 'RADIUSX') || 'null',
                radiusy = Blockly.JavaScript.valueToCode(block, 'RADIUSY') || 'null';
            return `devices.get('${ui.id}').modules.shapes.ellipse(${radiusx}, ${radiusy});`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let radiusx = Blockly.Pseudo.valueToCode(block, 'RADIUSX') || 'null',
                radiusy = Blockly.Pseudo.valueToCode(block, 'RADIUSY') || 'null';
            return `devices.get('${ui.id}').modules.shapes.ellipse(${radiusx}, ${radiusy});`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'square',
            message0: `${ui.name}: square %1`,
            args0: [{
                type: "input_value",
                name: "SIZE",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'SIZE': '<shadow type="math_number"><field name="NUM">5</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let size = Blockly.JavaScript.valueToCode(block, 'SIZE') || 'null';
            return `devices.get('${ui.id}').modules.shapes.square(${size});`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let size = Blockly.Pseudo.valueToCode(block, 'SIZE') || 'null';
            return `devices.get('${ui.id}').modules.shapes.square(${size});`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'rectangle',
            message0: `${ui.name}: rectangle %1 %2`,
            args0: [{
                type: "input_value",
                name: "WIDTH",
                check: 'Number'
            },{
                type: "input_value",
                name: "HEIGHT",
                check: 'Number'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'WIDTH': '<shadow type="math_number"><field name="NUM">5</field></shadow>',
                'HEIGHT': '<shadow type="math_number"><field name="NUM">5</field></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let width = Blockly.JavaScript.valueToCode(block, 'WIDTH') || 'null',
                height = Blockly.JavaScript.valueToCode(block, 'HEIGHT') || 'null';
            return `devices.get('${ui.id}').modules.shapes.rectangle(${width}, ${height});`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let width = Blockly.Pseudo.valueToCode(block, 'WIDTH') || 'null',
                height = Blockly.Pseudo.valueToCode(block, 'HEIGHT') || 'null';
            return `devices.get('${ui.id}').modules.shapes.rectangle(${width}, ${height});`;
        };
    }
},{
    block: (ui) => {
        return {
            id: 'arc',
            message0: `${ui.name}: arc %1 %2 %3 %4`,
            args0: [{
                type: "input_value",
                name: "RADIUS",
                check: 'Number'
            },{
                type: "input_value",
                name: "START",
                check: 'Number'
            },{
                type: "input_value",
                name: "END",
                check: 'Number'
            },{
                type: "input_value",
                name: "CLOSE",
                check: 'Boolean'
            }],
            previousStatement: null,
            nextStatement: null,
            shadow: {
                'RADIUS': '<shadow type="math_number"><field name="NUM">5</field></shadow>',
                'START': '<shadow type="math_number"><field name="NUM">0</field></shadow>',
                'END': '<shadow type="math_number"><field name="NUM">1</field></shadow>',
                'CLOSE': '<shadow type="logic_boolean"></shadow>'
            }
        };
    },
    javascript: (ui) => {
        return function (block) {
            let radius = Blockly.JavaScript.valueToCode(block, 'RADIUS') || 'null',
                start = Blockly.JavaScript.valueToCode(block, 'START') || 'null',
                end = Blockly.JavaScript.valueToCode(block, 'END') || 'null',
                close = block.getFieldValue('CLOSE') || false;
            return `devices.get('${ui.id}').modules.shapes.arc(${radius}, ${start}, ${end}, ${close});`;
        };
    },
    pseudo: (ui) => {
        return function (block) {
            let radius = Blockly.Pseudo.valueToCode(block, 'RADIUS') || 'null',
                start = Blockly.Pseudo.valueToCode(block, 'START') || 'null',
                end = Blockly.Pseudo.valueToCode(block, 'END') || 'null',
                close = block.getFieldValue('CLOSE') || false;
            return `devices.get('${ui.id}').modules.shapes.arc(${radius}, ${start}, ${end}, ${close});`;
        };
    }
}];
