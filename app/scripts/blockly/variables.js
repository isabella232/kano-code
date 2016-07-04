const COLOUR = '#1198ff';

let register = (Blockly) => {
    Blockly.Blocks.random_colour = {
        init: function () {
            let json = {
                id: 'random_colour',
                colour: COLOUR,
                message0: 'random color',
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
};
let category = {
    name: 'Variables',
    id: 'variables',
    colour: COLOUR,
    blocks: [{
        id: 'text'
    },{
        id: 'math_number'
    },{
        id: 'colour_picker'
    },{
        id: 'colour_rgb'
    },{
        id: 'random_colour'
    },{
        id: 'variables_set'
    },{
        id: 'variables_get'
    },{
        id: 'lists_create_empty'
    },{
        id: 'lists_create_with'
    },{
        id: 'lists_repeat'
    },{
        id: 'lists_length'
    },{
        id: 'lists_isEmpty'
    },{
        id: 'lists_indexOf'
    },{
        id: 'lists_getIndex'
    },{
        id: 'lists_setIndex'
    }]
};

export default {
    register,
    category
};
