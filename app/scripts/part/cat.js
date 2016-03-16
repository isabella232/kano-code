import Module from './module';

export default class Cat extends Module {
    constructor () {
        super({
            type: 'cat',
            label: 'Cat',
            image: 'assets/hw/canvas.png',
            colour: '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")'
        });
        this.addBlock({
            id: 'get_cat_picture',
            output: true,
            message0: 'random cat picture',
            javascript: (hw) => {
                return function (block) {
                    let code = `cat.random()`;
                    return [code];
                };
            },
            natural: (hw) => {
                return function (block) {
                    let code = `a random cat picture`;
                    return [code];
                };
            }
        });
    }
}
