const COLOUR = 41;

let register = (Blockly) => {
    Blockly.Blocks['get_cat_picture'] = {
        init: function () {
            let json = {
                id: 'get_cat_picture',
                colour: COLOUR,
                message0: 'get a random cat picture, then',
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_cat_picture'] = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            catVar = Blockly.JavaScript.variableDB_.getDistinctName(
                        'catPicture', Blockly.Variables.NAME_TYPE),
            code = `fetch('http://random.cat/meow')
                        .then((res) => res.json())
                        .then((j) => j.file)
                        .then((src) => {
                            window.catPicture = src;
                            ${statement}
                        });`;
        console.log(code);
        return code;
    };

    Blockly.Natural['get_cat_picture'] = (block) => {
        let statement = Blockly.Natural.statementToCode(block, 'DO'),
            code = `Download a cat picture then ${statement}`;
        return code;
    };


    Blockly.Blocks['get_last_cat_picture'] = {
        init: function () {
            let json = {
                id: 'get_last_cat_picture',
                output: true,
                colour: COLOUR,
                message0: 'last cat picture'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_last_cat_picture'] = (block) => {
        let code = `window.catPicture`;
        return [code];
    };

    Blockly.Natural['get_last_cat_picture'] = (block) => {
        let code = `last cat picture`;
        return [code];
    };
};
let category = {
    name: 'Cats',
    colour: COLOUR,
    blocks: [{
        id: 'get_cat_picture'
    },
    {
        id: 'get_last_cat_picture'
    }]
};

export default {
    register,
    category
};
