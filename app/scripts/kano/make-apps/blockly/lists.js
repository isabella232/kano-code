/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#1198ff';

    let category,
        register = (Blockly) => {

        category.blocks.forEach((category) => {
            Kano.BlocklyUtil.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });
    };

    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_LISTS,
        id: 'lists',
        colour: COLOUR,
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

    Kano.MakeApps.Blockly.addModule('lists', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
