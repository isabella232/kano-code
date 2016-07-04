const COLOUR = '#1198ff';

let register = (Blockly) => {
    Blockly.Blocks.random_cat = {
        init: function () {
            let json = {
                id: 'random_cat',
                colour: COLOUR,
                message0: 'random cat',
                output: 'String'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript.random_cat  = () => {
        let code = `cat.random()`;
        return [code];
    };

    Blockly.Pseudo.random_cat  = () => {
        let code = `randomCat()`;
        return [code];
    };
};
let category = {
    name: 'Fun',
    id: 'fun',
    colour: COLOUR,
    blocks: [{
        id: 'random_cat'
    }]
};

export default {
    register,
    category
};
