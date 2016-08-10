/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#084655';

    let register = (Blockly) => {

        Blockly.Blocks.key_down = {
            init: function () {
                let json = {
                    id: 'key_down',
                    colour: COLOUR,
                    message0: Blockly.Msg.KEY_EVENT,
                    args0: [{
                        type: "input_value",
                        name: "KEY"
                    }, {
                        type: 'field_dropdown',
                        name: 'STATE',
                        options: [['pushed', 'pushed'], ['released', 'released']]
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

        Blockly.JavaScript.key_down = (block) => {
            let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                key = Blockly.JavaScript.valueToCode(block, 'KEY'),
                state = block.getFieldValue('STATE'),
                method = state === 'pushed' ? 'onDown' : 'onUp',
                code = `keyboard.${method}(${key}, function () {\n${statement}\n});\n`;
            return code;
        };

        Blockly.Pseudo.key_down = (block) => {
            let statement = Blockly.Pseudo.statementToCode(block, 'DO'),
                key = Blockly.Pseudo.valueToCode(block, 'KEY'),
                state = block.getFieldValue('STATE'),
                method = state === 'pushed' ? 'onDown' : 'onUp',
                code = `keyboard.${method}(${key}, function () {\n${statement}\n});\n`;
            return code;
        };

        // Create a block shell of the part_event if not there yet
        if (!Blockly.Blocks.part_event) {
            Blockly.Blocks.part_event = {
                init: function () {
                    let json = {
                        id: 'part_event',
                        colour: COLOUR,
                        message0: Blockly.Msg.EVENT,
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
        }

        Blockly.JavaScript.part_event = (block) => {
            let ev = block.getFieldValue('EVENT'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                pieces = ev.split('.'),
                emitter = pieces[0],
                eventId = pieces[1],
                code = `devices.get('${emitter}')`;
            if (emitter === 'global') {
                code = 'global';
            }
            code += `.when('${eventId}', function () {\n${statement}});\n`;
            return code;
        };

        Blockly.Pseudo.part_event = (block) => {
            let ev = block.getFieldValue('EVENT'),
                statement = Blockly.JavaScript.statementToCode(block, 'DO'),
                pieces = ev.split('.'),
                emitter = pieces[0],
                eventId = pieces[1],
                code = `devices.get('${emitter}')`;
            if (emitter === 'global') {
                code = 'global';
            }
            code += `.when('${eventId}', function () {\n${statement}});\n`;
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
    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_EVENTS,
        id: 'events',
        colour: COLOUR,
        blocks: ['part_event']
    });

    Kano.MakeApps.Blockly.addModule('events', {
        register,
        category,
        experiments: {
            'keyboard_events': [{
                id: 'key_down'
            }]
        }
    });

})(window.Kano = window.Kano || {});
