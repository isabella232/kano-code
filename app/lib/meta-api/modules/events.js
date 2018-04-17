const COLOR = '#5fc9f3';

class BlocklyEvents {
    static get type() { return 'blockly'; }
    static get id() { return 'events'; }
    static register(Blockly) {
        // Create a block shell of the part_event if not there yet
        if (!Blockly.Blocks.part_event) {
            Blockly.Blocks.part_event = {
                init() {
                    const json = {
                        id: 'part_event',
                        colour: COLOR,
                        message0: Blockly.Msg.GLOBAL_EVENT,
                        args0: [{
                            type: 'field_dropdown',
                            name: 'EVENT',
                            options: [['', '']],
                        }],
                        message1: '%1',
                        args1: [{
                            type: 'input_statement',
                            name: 'DO',
                        }],
                    };
                    this.jsonInit(json);
                },
            };
        }

        Blockly.JavaScript.part_event = (block) => {
            const ev = block.getFieldValue('EVENT');
            const statement = Blockly.JavaScript.statementToCode(block, 'DO');
            const pieces = ev.split('.');
            const emitter = pieces[0];
            const eventId = pieces[1];
            let code = `devices.get('${emitter}')`;
            if (emitter === 'global') {
                code = 'global';
            }
            code += `.when('${eventId}', function () {\n${statement}});\n`;
            return code;
        };

        // Create a block shell of the collision event if not there yet
        if (!Blockly.Blocks.collision_event) {
            Blockly.Blocks.collision_event = {
                init() {
                    Blockly.Blocks.collision_event.applyCollisionFields(Blockly.Msg.WHEN, this);

                    this.appendStatementInput('DO');

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
                    const options = parts.filter(part => `parts.get('${part.id}')` !== this.getFieldValue('PART1')).map(this.formatPartOption);

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
            Blockly.Blocks.collision_event.getParts = () => Blockly.Blocks.collision_event._compatibleParts;
            Blockly.Blocks.collision_event.setParts = (parts) => {
                Blockly.Blocks.collision_event._compatibleParts = parts.filter(part => part.collidable);
            };
            Blockly.Blocks.collision_event.applyCollisionFields = (prefix, target) => {
                const firstDropdown = new Blockly.FieldDropdown(() => target.getFirstPartOptions(), ((option) => {
                    if (target.getFieldValue('PART2') === option) {
                        const options = target.getField('PART2').getOptions();
                        target.setFieldValue(options[0][1], 'PART2');
                    }
                }));

                // Apply the field right away to let know the second dropdown the default selection
                const input = target.appendDummyInput()
                    .appendField(prefix)
                    .appendField(firstDropdown, 'PART1');

                const secondDropdown = new Blockly.FieldDropdown(() => target.getSecondPartOptions());

                input.appendField(Blockly.Msg.COLLIDES_WITH)
                    .appendField(secondDropdown, 'PART2');
            };
        }

        Blockly.JavaScript.collision_event = (block) => {
            const part1Id = block.getFieldValue('PART1');
            const part2Id = block.getFieldValue('PART2');
            const statement = Blockly.JavaScript.statementToCode(block, 'DO');
            return `parts.whenCollisionBetween(${part1Id || null}, ${part2Id}, function () {\n${statement}});\n`;
        };
    }
    static get category() {
        return {
            name: Blockly.Msg.CATEGORY_EVENTS,
            id: BlocklyEvents.id,
            colour: COLOR,
            blocks: [
                'part_event',
                'collision_event',
            ],
        };
    }
    static get defaults() {
        return {
            part_event: {
                EVENT: 'global.start',
            },
        };
    }
}

export default BlocklyEvents;
