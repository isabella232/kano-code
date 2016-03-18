const COLOUR = '#FFB347';

let register = (Blockly) => {
    Blockly.Blocks['say'] = {
        init: function () {
            let json = {
                id: 'say',
                colour: COLOUR,
                message0: 'say Text %1 Speed %2 Accent %3',
                inputsInline: false,
                args0: [{
                    type: "input_value",
                    name: "TEXT"
                },
                {
                    type: "input_value",
                    name: "RATE",
                    check: "Number"
                },
                {
                    type: "field_dropdown",
                    name: "LANGUAGE",
                    options: [
                        [
                            "British English",
                            "en-GB"
                        ],
                        [
                            "US English",
                            "en-US"
                        ],
                        [
                            "French",
                            "fr-FR"
                        ],
                        [
                            "German",
                            "de-DE"
                        ],
                        [
                            "Italian",
                            "it-IT"
                        ]
                    ]
                }],
                previousStatement: null,
                nextStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['say'] = (block) => {
        let text = Blockly.JavaScript.valueToCode(block, 'TEXT'),
            rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
            lang = block.getFieldValue('LANGUAGE'),
            code = `speaker.say(${text}, ${rate}, "${lang}")`;
        return code;
    };

    Blockly.Natural['say'] = (block) => {
        return function (block) {
            let text = Blockly.Natural.valueToCode(block, 'TEXT'),
                rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                lang = block.getFieldValue('LANGUAGE'),
                code = `speaker say ${text} (speed=${rate}, language=${lang})`;
            return code;
        };
    };
};
let category = {
    name: 'Speaker',
    colour: COLOUR,
    blocks: [{
        id: 'say'
    }]
};

export default {
    register,
    category
};
