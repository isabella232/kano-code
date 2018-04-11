/**
 * Registers the logic blocks, and creates its category
 */
const COLOR = '#f75846';

class BlocklyLogic {
    static get id() { return 'logic'; }
    static register(Blockly, registry) {
        Blockly.Blocks.logic_compare = {
            init() {
                const options = [
                    ['=', 'EQ'],
                    ['\u2260', 'NEQ'],
                    ['<', 'LT'],
                    ['\u2264', 'LTE'],
                    ['>', 'GT'],
                    ['\u2265', 'GTE'],
                ];
                const labels = {
                    EQ: '= equal',
                    NEQ: '\u2260 not equal',
                    LT: '< less than',
                    LTE: '\u2264 less than or equal',
                    GT: '> greater than',
                    GTE: '\u2265 greater than or equal',
                };
                this.appendValueInput('A');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options, labels), 'OP');

                this.appendValueInput('B');

                this.setInputsInline(true);
                this.setOutput('Boolean');
                this.setColour(COLOR);
                this.setHelpUrl('%{BKY_LOGIC_COMPARE_HELPURL}');
            },
        };

        Blockly.Blocks.if_collides = {
            init() {
                Blockly.Blocks.collision_event.applyCollisionFields('', this);

                this.setOutput('Boolean');

                this.setColour(COLOR);
            },
            getFirstPartOptions() {
                const parts = Blockly.Blocks.collision_event.getParts() || [];
                const options = parts.map(this.formatPartOption);

                if (!options.length) {
                    options.push(['No available part', '']);
                }

                return options;
            },
            getSecondPartOptions() {
                const parts = Blockly.Blocks.collision_event.getParts() || [];
                const options = parts.filter(part => part.id !== this.getFieldValue('PART1')).map(this.formatPartOption);

                // The @ here is to make sure no part id will collide with this name
                options.push(['Top Edge', "'@top-edge'"]);
                options.push(['Right Edge', "'@right-edge'"]);
                options.push(['Bottom Edge', "'@bottom-edge'"]);
                options.push(['Left Edge', "'@left-edge'"]);

                return options;
            },
            formatPartOption(part) {
                return [part.name, `parts.get('${part.id}')`];
            },
        };

        Blockly.JavaScript.if_collides = (block) => {
            const part1Id = block.getFieldValue('PART1');
            const part2Id = block.getFieldValue('PART2');
            const code = `parts.collisionBetween(${part1Id || null}, ${part2Id})`;
            return [code];
        };

        registry.upgradeCategoryColours(BlocklyLogic.id, COLOR);
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_LOGIC,
            id: BlocklyLogic.id,
            colour: COLOR,
            blocks: [
                'controls_if',
                'logic_compare',
                'logic_operation',
                'logic_negate',
                'logic_boolean',
                'if_collides',
            ],
        };
    }
    static get defaults() {
        return {
            logic_compare: {
                OP: 'EQ',
            },
            logic_boolean: {
                BOOL: 'TRUE',
            },
        };
    }
}

export default BlocklyLogic;
