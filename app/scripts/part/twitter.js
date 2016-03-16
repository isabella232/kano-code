import Module from './module';

export default class Twitter extends Module {
    constructor () {
        super({
            type: 'twitter',
            label: 'Twitter',
            image: 'assets/hw/canvas.png',
            colour: '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")'
        });
        this.addBlock({
            id: 'get_last_tweet',
            output: true,
            message0: 'last tweet from %1',
            args0: [{
                type: "input_value",
                name: "USERNAME"
            }],
            javascript: (hw) => {
                return function (block) {
                    let username = Blockly.JavaScript.valueToCode(block, 'USERNAME'),
                        code = `twitter.getLastTweet(${username})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let username = Blockly.Natural.valueToCode(block, 'USERNAME'),
                        code = `last tweet from ${username}`;
                    return code;
                };
            }
        });
        this.addBlock({
            id: 'twitter_refresh',
            message0: 'refresh twitter',
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let code = `twitter.refresh()`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let code = `refresh twitter`;
                    return code;
                };
            }
        });
    }
}
