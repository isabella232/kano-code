/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#ccdd1e';

    let category,
        register = (Blockly) => {

            let flags = Kano.MakeApps.config.getFlags();

            for (let i = 0; i < flags.experiments.length; i++) {
                if (flags.experiments[i] === 'functions') {
                    Blockly.Blocks['lists_create_with'] = {
                        /**
                         * Block for creating a list with any number of elements of any type.
                         * @this Blockly.Block
                         */
                        init: function () {
                            this.setHelpUrl(Blockly.Msg.LISTS_CREATE_WITH_HELPURL);
                            this.setColour(Blockly.Blocks.lists.HUE);
                            this.itemCount_ = 3;
                            this.updateShape_();
                            this.setOutput(true, 'Array');
                            this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_TOOLTIP);
                        },
                        /**
                         * Create XML to represent list inputs.
                         * @return {!Element} XML storage element.
                         * @this Blockly.Block
                         */
                        mutationToDom: function () {
                            var container = document.createElement('mutation');
                            container.setAttribute('items', this.itemCount_);
                            return container;
                        },
                        /**
                         * Parse XML to restore the list inputs.
                         * @param {!Element} xmlElement XML storage element.
                         * @this Blockly.Block
                         */
                        domToMutation: function (xmlElement) {
                            this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
                            this.updateShape_();
                        },
                        /**
                         * Modify this block to have the correct number of inputs.
                         * @private
                         * @this Blockly.Block
                         */
                        updateShape_: function () {
                            if (this.itemCount_ && this.getInput('EMPTY')) {
                                this.removeInput('EMPTY');
                            } else if (!this.itemCount_ && !this.getInput('EMPTY')) {
                                this.appendDummyInput('EMPTY')
                                    .appendField(Blockly.Msg.LISTS_CREATE_EMPTY_TITLE);
                            }
                            // Add new inputs.
                            for (var i = 0; i < this.itemCount_; i++) {
                                if (!this.getInput('ADD' + i)) {
                                    var input = this.appendValueInput('ADD' + i);
                                    if (i == 0) {
                                        input.appendField(new Blockly.FieldArrayLength(this.itemCount_, (newValue) => {
                                            this.itemCount_ = newValue;
                                            this.updateShape_();
                                        }));
                                        input.appendField(Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH);
                                    }
                                }
                            }
                            // Remove deleted inputs.
                            while (this.getInput('ADD' + i)) {
                                this.removeInput('ADD' + i);
                                i++;
                            }
                        }
                    };
                    break;
                }
            }

        category.blocks.forEach((category) => {
            Kano.Util.Blockly.updateBlockColour(Blockly.Blocks[category.id], COLOR);
        });
    };

    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name  : Blockly.Msg.CATEGORY_LISTS,
        id    : 'lists',
        colour: COLOR,
        blocks: [
            'lists_create_empty',
            'lists_create_with',
            'lists_repeat',
            'lists_length',
            'lists_isEmpty',
            'lists_indexOf',
            'lists_getIndex',
            'lists_setIndex'
        ]
    });

    Kano.MakeApps.Blockly.setLookupString('lists_create_empty', 'listEmpty()');
    Kano.MakeApps.Blockly.setLookupString('lists_create_with', 'listWith(1, 2, 3, ...)');
    Kano.MakeApps.Blockly.setLookupString('lists_repeat', 'listRepeat(list, action)');
    Kano.MakeApps.Blockly.setLookupString('lists_length', 'listLength(list)');
    Kano.MakeApps.Blockly.setLookupString('lists_isEmpty', 'listIsEmpty(list)');
    Kano.MakeApps.Blockly.setLookupString('lists_indexOf', 'listIndexOf(list, element)');
    Kano.MakeApps.Blockly.setLookupString('lists_getIndex', 'listGetIndex(list, index)');
    Kano.MakeApps.Blockly.setLookupString('lists_setIndex', 'listSetIndex(list, index, element)');

    Kano.MakeApps.Blockly.addModule('lists', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
