/* globals Blockly */

let speaker;

const samples = {
    kano: {
        'level-up': 'Level up'
    },
    loops: {
        'amen': 'Amen'
    }
};
const COLOUR = '#FFB347';

export default speaker = {
    partType: 'hardware',
    type: 'speaker',
    label: 'Speaker',
    image: '/assets/part/speaker.svg',
    colour: COLOUR,
    blocks: [{
        block: () => {
            return {
                id: 'say',
                message0: 'Speaker: say Text %1 Speed %2 Accent %3',
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
    },{
        block: () => {
            return {
                id: 'speaker_play',
                message0: 'Speaker: play %1',
                args0: [{
                    type: "input_value",
                    name: "SAMPLE",
                    check: 'Sample'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: () => {
            return (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || {},
                    code = `speaker.play(${sample});\n`;
                return code;
            };
        },
        pseudo: () => {
            return (block) => {
                let sample = Blockly.Pseudo.valueToCode(block, 'SAMPLE') || {},
                    code = `speaker.play(${sample});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'speaker_loop',
                message0: 'Speaker: loop %1',
                args0: [{
                    type: "input_value",
                    name: "SAMPLE",
                    check: 'Sample'
                }],
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: () => {
            return (block) => {
                let sample = Blockly.JavaScript.valueToCode(block, 'SAMPLE') || {},
                    code = `speaker.loop(${sample});\n`;
                return code;
            };
        },
        pseudo: () => {
            return (block) => {
                let sample = Blockly.Pseudo.valueToCode(block, 'SAMPLE') || {},
                    code = `speaker.loop(${sample});\n`;
                return code;
            };
        }
    },{
        block: () => {
            return {
                id: 'speaker_stop',
                message0: 'Speaker: stop',
                previousStatement: null,
                nextStatement: null
            };
        },
        javascript: () => {
            return (block) => {
                let code = `speaker.stop();\n`;
                return code;
            };
        },
        pseudo: () => {
            return (block) => {
                let code = `speaker.stop();\n`;
                return code;
            };
        }
    },{
        block: (part) => {
            let sampleSet = Object.keys(samples),
                id = 'speaker_sample';
            Blockly.Blocks[`${part.id}#${id}`] = {
                init: function () {

                    let setDropdown = new Blockly.FieldDropdown(sampleSet.map(name => [name, name]), function (option) {
                        this.sourceBlock_.updateShape_(option);
                    });

                    this.setColour(part.colour);

                    this.appendDummyInput()
                        .appendField(setDropdown, 'SET');

                    this.setOutput('Sample');

                    this.setInputsInline(true);

                    this.createInputs_('kano');
                },
                updateShape_: function (option) {
                    this.removeInput('SAMPLE');
                    this.createInputs_(option);
                },
                createInputs_: function (option) {
                    let options = Object.keys(samples[option]).map(key => [samples[option][key], key]),
                        dropdown = new Blockly.FieldDropdown(options);
                    this.appendDummyInput('SAMPLE')
                        .appendField(dropdown, 'SAMPLE');
                },
                domToMutation: function (xmlElement) {
                    let type = xmlElement.getAttribute('set');
                    this.updateShape_(type);
                },
                mutationToDom: function () {
                    let container = document.createElement('mutation'),
                        type = this.getFieldValue('SET');
                    container.setAttribute('set', type);
                    return container;
                }
            };
            return {
                id,
                colour: COLOUR,
                doNotRegister: true
            }
        },
        javascript: () => {
            return (block) => {
                let sample = block.getFieldValue('SAMPLE') || 'amen';
                return [`'${sample}'`];
            };
        },
        pseudo: () => {
            return (block) => {
                let sample = block.getFieldValue('SAMPLE') || 'amen';
                return [`'${sample}'`];
            };
        }
    }]
};
