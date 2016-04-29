const COLOUR = '#33a7ff';

let register = (Blockly) => {

    Blockly.Blocks.part_event = {
        init: function () {
            let json = {
                id: 'part_event',
                colour: COLOUR,
                message0: 'When %1',
                args0: [{
                    type: "field_dropdown",
                    name: "EVENT",
                    options: []
                }],
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }]
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.part_event = (block) => {
        let ev = block.getFieldValue('EVENT'),
            statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            pieces = ev.split('.'),
            emitter = pieces[0],
            eventId = pieces[1],
            code;
        code = `devices.get('${emitter}').when('${eventId}', function () {\n${statement}});\n`;
        return code;
    };
    Blockly.Pseudo.part_event = (block) => {
        let ev = block.getFieldValue('EVENT'),
            statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            code = `devices.get('${ev.emitter}').when('${ev.event}', function () {\n${statement}});\n`;
        return code;
    };

    /*Blockly.Blocks.mouse_move = {
        init: function () {
            let json = {
                id: 'mouse_move',
                colour: COLOUR,
                message0: 'When mouse moves',
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }]
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.mouse_move = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            code = `mouse.whenMove(function () {\n${statement}});\n`;
        return code;
    };
    Blockly.Pseudo.mouse_move = (block) => {
        let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
            code = `mouse.whenMove(function () {\n${statement}});\n`;
        return code;
    };*/
};
let category = {
    name: 'Events',
    colour: COLOUR,
    blocks: [{
        id: 'part_event'
    }]
};

export default {
    register,
    category
};