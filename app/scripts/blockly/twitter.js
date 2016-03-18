const COLOUR = '#0C94DE url("http://orig12.deviantart.net/031a/f/2010/306/3/0/free_twitter_bird_icon_by_georgiapeaches-d322076.gif")';

let register = (Blockly) => {
    Blockly.Blocks['get_last_tweet'] = {
        init: function () {
            let json = {
                id: 'get_last_tweet',
                colour: COLOUR,
                output: true,
                message0: 'last tweet from %1',
                args0: [{
                    type: "input_value",
                    name: "USERNAME"
                }]
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_last_tweet'] = (block) => {
        let username = Blockly.JavaScript.valueToCode(block, 'USERNAME'),
            code = `twitter.getLastTweet(${username})`;
        return code;
    };

    Blockly.Natural['get_last_tweet'] = (block) => {
        let username = Blockly.Natural.valueToCode(block, 'USERNAME'),
            code = `last tweet from ${username}`;
        return code;
    };

    Blockly.Blocks['refresh_twitter'] = {
        init: function () {
            let json = {
                id: 'refresh_twitter',
                colour: COLOUR,
                message0: 'refresh twitter',
                previousStatement: null,
                nextStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['refresh_twitter'] = (block) => {
        let code = `twitter.refresh()`;
        return [code];
    };

    Blockly.Natural['refresh_twitter'] = (block) => {
        let code = `refresh twitter`;
        return [code];
    };
};
let category = {
    name: 'Twitter',
    colour: COLOUR,
    blocks: [{
        id: 'get_last_tweet'
    },{
        id: 'refresh_twitter'
    }]
};

export default {
    register,
    category
};
