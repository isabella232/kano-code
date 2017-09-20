(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOR = '#ffc100';

    let category,
        register = () => {
            Kano.MakeApps.Blockly.Defaults.upgradeCategoryColours('variables', COLOR);
        };

    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_VARIABLES,
        id: 'variables',
        colour: COLOR,
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
