const COLOUR = 41;

let register = (Blockly) => {
    Blockly.Blocks['random_giphy'] = {
        init: function () {
            let json = {
                id: 'search_giphy',
                colour: COLOUR,
                message0: 'a random gif',
                output: true,
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['random_giphy'] = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            code = `giphy.random()`;
        return [code];
    };

    Blockly.Natural['random_giphy'] = (block) => {
        let code = `a random gif`;
        return [code];
    };

};
let category = {
    name: 'Giphy',
    colour: COLOUR,
    blocks: [{
        id: 'random_giphy'
    }]
};

export default {
    register,
    category
};
