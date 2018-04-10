import { localize } from '../../i18n/index.js';

const COLOR = '#88c440';

const register = (Blockly, registry) => {
    Blockly.Blocks.random_colour = {
        init: function () {
            let json = {
                id      : 'random_colour',
                colour  : COLOR,
                message0: Blockly.Msg.COLOR_RANDOM,
                output  : 'Colour'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.random_colour = () => {
        let code = `colour.random()`;
        return [code];
    };

    Blockly.Blocks.create_color = {
        inputs: {
            rgb: {
                '1': '% red',
                '2': '% green',
                '3': '% blue'
            },
            hsv: {
                '1': 'hue',
                '2': 'saturation',
                '3': 'value'
            }
        },
        init: function () {
            let PROPERTIES = [
                ['RGB', 'rgb'],
                ['HSV', 'hsv']
            ];

            let dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
                this.sourceBlock_.updateShape_(option);
            });

            this.setColour(COLOR);

            this.appendDummyInput()
                .appendField('new color with')
                .appendField(dropdown, 'TYPE');

            this.setOutput('Colour');

            this.createInputs_('rgb');
        },
        updateShape_: function (option) {
            this.removeInput('1');
            this.removeInput('2');
            this.removeInput('3');

            this.createInputs_(option);
        },
        createInputs_: function (option) {
            Object.keys(this.inputs[option]).forEach(key => {
                this.appendValueInput(key)
                .setCheck('Number')
                .setAlign(Blockly.ALIGN_RIGHT)
                .appendField(this.inputs[option][key]);
            });
        },
        domToMutation: function (xmlElement) {
            let type = xmlElement.getAttribute('color_type');
            this.updateShape_(type);
        },
        mutationToDom: function () {
            let container = document.createElement('mutation'),
                type      = this.getFieldValue('TYPE');
            container.setAttribute('color_type', type);
            return container;
        }
    };

    Blockly.JavaScript.create_color = (block) => {
        let type     = block.getFieldValue('TYPE'),
            one      = Blockly.JavaScript.valueToCode(block, '1') || 0,
            two      = Blockly.JavaScript.valueToCode(block, '2'),
            three    = Blockly.JavaScript.valueToCode(block, '3'),
            defaults = type === 'hsv' ? 100 : 0;
            two      = two || defaults;
            three    = three || defaults;
        let code     = `colour.create('${type}', ${one}, ${two}, ${three})`;
        return [code];
    };

    Blockly.Blocks.color_lerp = {
        init: function () {
            let json = {
                id      : 'color_lerp',
                colour  : COLOR,
                message0: Blockly.Msg.COLOR_LERP,
                args0   : [{
                    type : "input_value",
                    name : "FROM",
                    check: "Colour"
                }, {
                    type : "input_value",
                    name : "TO",
                    check: "Colour"
                }, {
                    type : 'input_value',
                    name : 'PERCENT',
                    check: "Number"
                }],
                inputsInline: true,
                output      : "Colour"
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.color_lerp = (block) => {
        Blockly.JavaScript.valueToCode(block, 'FROM') || '"#ffffff"'
        let from    = Blockly.JavaScript.valueToCode(block, 'FROM') || '"#000000"',
            to      = Blockly.JavaScript.valueToCode(block, 'TO') || '"#ffffff"',
            percent = Blockly.JavaScript.valueToCode(block, 'PERCENT') || 50,
            code    = `colour.lerp(${from}, ${to}, ${percent})`;
        return [code];
    };

    registry.upgradeCategoryColours('color', COLOR);
};

const category = {
    name: localize('CATEGORY_COLOR', 'Color'),
    id: 'color',
    colour: COLOR,
    blocks: [
        'colour_picker',
        'create_color',
        'random_colour',
        {
            id: 'color_lerp',
            defaults: ['FROM', 'TO', 'PERCENT'],
        },
    ],
};

const defaults = {
    colour_picker: {
        COLOUR: '#ff0000',
    },
    create_color: {
        TYPE: 'rgb',
    },
    color_lerp: {
        FROM: '#000000',
        TO: '#ffffff',
        PERCENT: 50,
    },
};

export default {
    id: category.id,
    register,
    category,
    defaults,
};
