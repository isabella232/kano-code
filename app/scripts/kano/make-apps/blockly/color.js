/* globals Blockly */
(function (Kano) {
    Kano.MakeApps = Kano.MakeApps || {};

    const COLOUR = '#1198ff';

    let category,
        register = (Blockly) => {
        Blockly.Blocks.random_colour = {
            init: function () {
                let json = {
                    id: 'random_colour',
                    colour: COLOUR,
                    message0: Blockly.Msg.COLOR_RANDOM,
                    output: 'Colour'
                };
                this.jsonInit(json);
            }
        };

        Blockly.JavaScript.random_colour  = () => {
            let code = `colour.random()`;
            return [code];
        };

        Blockly.Pseudo.random_colour  = () => {
            let code = `randomColour()`;
            return [code];
        };

        category.blocks.forEach((category) => {
            Kano.BlocklyUtil.updateBlockColour(Blockly.Blocks[category.id], COLOUR);
        });
    };
    category = Kano.MakeApps.Blockly.Defaults.createCategory({
        name: Blockly.Msg.CATEGORY_COLOR,
        id: 'color',
        colour: COLOUR,
        blocks: [
            'colour_picker',
            'colour_rgb',
            'random_colour'
        ]
    });

    Kano.MakeApps.Blockly.addModule('color', {
        register,
        category
    });

})(window.Kano = window.Kano || {});
