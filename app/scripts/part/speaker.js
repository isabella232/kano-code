import Module from './module';

export default class Speaker extends Module {
    constructor () {
        super({
            type: 'speaker',
            label: 'Speaker',
            image: 'assets/hw/speaker.png',
            colour: '#FFB347'
        });
        this.addBlock({
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
            javascript: (part) => {
                return function (block) {
                    let text = Blockly.JavaScript.valueToCode(block, 'TEXT'),
                        rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                        lang = block.getFieldValue('LANGUAGE'),
                        code = `${part.type}.say(${text}, ${rate}, "${lang}")`;
                    return code;
                };
            },
            natural: (part) => {
                return function (block) {
                    let text = Blockly.Natural.valueToCode(block, 'TEXT'),
                        rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                        lang = block.getFieldValue('LANGUAGE'),
                        code = `${part.label} say ${text} (speed=${rate}, language=${lang})`;
                    return code;
                };
            }
        });
    }
    say (text, rate, lang) {
        this.getElement().say(text, rate, lang);
    }
}
