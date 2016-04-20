const COLOUR = 'linear-gradient(#34A836,#2C9929)';

let register = (Blockly) => {
    Blockly.Blocks.random_colour = {
        init: function () {
            let json = {
                id: 'random_colour ',
                colour: COLOUR,
                message0: 'random colour',
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
    colour: COLOUR,
    blocks: [{
        id: 'text'
    },{
        id: 'math_number'
    },{
        id: 'colour_picker'
    },{
        id: 'random_colour'
    },{
        id: 'variables_set'
    },{
        id: 'variables_get'
    }]
};

export default {
    register,
    category
};
