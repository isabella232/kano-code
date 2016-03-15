import UI from './ui';

export default class Label extends UI {
    constructor () {
        super({
            type: 'label',
            label: 'The Label',
            image: 'https://placeholdit.imgix.net/~text?txtsize=9&txt=100%C3%97100&w=100&h=100',
            hue: 118,
            customizable: {
                style: ['background-color', 'color', 'font-size'],
                properties: [{
                    key: 'text',
                    type: 'text',
                    label: 'Text'
                }]
            }
        });
    }
}
