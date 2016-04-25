/* globals Blockly */

let speaker;

export default speaker = {
    partType: 'hardware',
    type: 'speaker',
    label: 'Speaker',
    image: '/assets/part/speaker.svg',
    colour: '#FFB347',
    blocks: [{
        block: () => {
            return {
                id: 'say',
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
        },
        javascript: () => {
            return (block) => {
                let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '',
                    rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                    lang = block.getFieldValue('LANGUAGE'),
                    code = `speaker.say(${text}, ${rate}, "${lang}");\n`;
                return code;
            };
        },
        pseudo: () => {
            return (block) => {
                let text = Blockly.Pseudo.valueToCode(block, 'TEXT') || `''`,
                    rate = Blockly.Pseudo.valueToCode(block, 'RATE') || 1,
                    lang = block.getFieldValue('LANGUAGE'),
                    code = `speaker.say(${text}, ${rate}, "${lang}");\n`;
                return code;
            };
        }
    }]
};
