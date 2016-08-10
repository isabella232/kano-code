(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#a8c25f';

    let category,
        register = (Blockly) => {

        category.blocks.forEach((category) => {
            Kano.BlocklyUtil.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });
    };

    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: 'Variables',
        id: 'variables',
        colour: COLOUR,
        blocks: [
            'math_number',
            'text',
            'text_join',
            'variables_set',
            'variables_get'
        ]
    });

    Kano.MakeApps.Blockly.addModule('variables', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
