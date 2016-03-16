const COLOUR = '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")';

let register = (Blockly) => {
    Blockly.Blocks['get_cat_picture'] = {
        init: function () {
            let json = {
                id: 'get_cat_picture',
                colour: COLOUR,
                output: true,
                message0: 'random cat picture'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_cat_picture'] = (block) => {
        let code = `cat.random()`;
        return [code];
    };

    Blockly.Natural['get_cat_picture'] = (block) => {
        let code = `a random cat picture`;
        return [code];
    };
};
let category = {
    name: 'Cats',
    colour: COLOUR,
    blocks: [{
        id: 'get_cat_picture'
    }]
};

export default {
    register,
    category
};
