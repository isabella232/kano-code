/* globals Blockly */
import TextToSpeech from '../../service/text-to-speech';

let speaker;

export default speaker = {
    name: 'Speaker',
    colour: '#FFB347',
    say (text, rate, language) {
        speaker.tts.speak(text, rate, language);
    },
    methods: {
        say (text, rate, language) {
            if (typeof text.subscribe === 'function') {
                return text.subscribe((result) => {
                    speaker.say(result, rate, language);
                });
            }
            speaker.say(text, rate, language);
        }
    },
    lifecycle: {
        stop () {

        }
    },
    config (opts) {
        speaker.tts = TextToSpeech(opts);
    },
    blocks: [{
        block: {
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
        },
        javascript: (block) => {
            let text = Blockly.JavaScript.valueToCode(block, 'TEXT') || '',
                rate = Blockly.JavaScript.valueToCode(block, 'RATE') || 1,
                lang = block.getFieldValue('LANGUAGE'),
                code = `speaker.say(${text}, ${rate}, "${lang}");\n`;
            return code;
        },
        pseudo: (block) => {
            let text = Blockly.Pseudo.valueToCode(block, 'TEXT') || `''`,
                rate = Blockly.Pseudo.valueToCode(block, 'RATE') || 1,
                lang = block.getFieldValue('LANGUAGE'),
                code = `speaker.say(${text}, ${rate}, "${lang}");\n`;
            return code;
        }
    }]
};
