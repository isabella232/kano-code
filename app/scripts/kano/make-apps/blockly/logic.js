(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    /**
     * Registers the logic blocks, and creates its category
     */
    const COLOR = '#f75846';

    let register = (Blockly) => {

        Blockly.Blocks.logic_compare = {
            init: function () {
                let options = [
                    { label: "= equal", textLabel: "=", value: "EQ" },
                    { label: "\u2260 not equal", textLabel: "\u2260", value: "NEQ" },
                    { label: "< less than", textLabel: "<", value: "LT" },
                    { label: "\u2264 less than or equal", textLabel: "\u2264", value: "LTE" },
                    { label: "> greater than", textLabel: ">", value: "GT" },
                    { label: "\u2265 greater than or equal", textLabel: "\u2265", value: "GTE" }
                ]
                this.appendValueInput('A');

                this.appendDummyInput()
                    .appendField(new Blockly.FieldCustomDropdown(options), 'OP');

                this.appendValueInput('B');

                this.setInputsInline(true);
                this.setOutput('Boolean');
                this.setColour('%{BKY_LOGIC_HUE}');
                this.setHelpUrl('%{BKY_LOGIC_COMPARE_HELPURL}');
            }
        }

        Blockly.Pseudo.controls_if = (block) => {
            // If/elseif/else condition.
            let n = 0,
                argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false',
                branch = Blockly.Pseudo.statementToCode(block, 'DO' + n),
                code = 'if (' + argument + ') {\n' + branch + '}';
            for (n = 1; n <= block.elseifCount_; n++) {
                argument = Blockly.Pseudo.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false';
                branch = Blockly.Pseudo.statementToCode(block, 'DO' + n);
                code += ' else if (' + argument + ') {\n' + branch + '}';
            }
            if (block.elseCount_) {
                branch = Blockly.Pseudo.statementToCode(block, 'ELSE');
                code += ' else {\n' + branch + '}';
            }
            return code + '\n';
        };

        Blockly.Pseudo.logic_compare = (block) => {
            // Comparison operator.
            const OPERATORS = {
                'EQ': '==',
                'NEQ': '!=',
                'LT': '<',
                'LTE': '<=',
                'GT': '>',
                'GTE': '>='
            };
            let operator = OPERATORS[block.getFieldValue('OP')],
                order = (operator == '==' || operator == '!=') ? Blockly.JavaScript.ORDER_EQUALITY : Blockly.JavaScript.ORDER_RELATIONAL,
                argument0 = Blockly.Pseudo.valueToCode(block, 'A', order) || '0',
                argument1 = Blockly.Pseudo.valueToCode(block, 'B', order) || '0',
                code = argument0 + ' ' + operator + ' ' + argument1;
            return [code, order];
        };

        category.blocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOR);
        });
    };

    let category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_LOGIC,
        id: 'logic',
        colour: COLOR,
        blocks: [
            'controls_if',
            'logic_compare',
            'logic_operation',
            'logic_negate',
            'logic_boolean'
        ]
    });

    Kano.MakeApps.Blockly.setLookupString('controls_if', 'if (validation) {...}');
    Kano.MakeApps.Blockly.setLookupString('logic_compare', 'compare(a, b, check)');
    Kano.MakeApps.Blockly.setLookupString('logic_negate', 'not(a)');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'boolean');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'true');
    Kano.MakeApps.Blockly.setLookupString('logic_boolean', 'false');

    Kano.MakeApps.Blockly.addModule('logic', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
