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

        this.addBlock({
            id: 'label_text_set_value',
            output: false,
            message0: 'set label value to %1',
            args0: [{
                type: "input_value",
                name: "INPUT"
            }],

            javascript: (hw) => {
                return function (block) {
                    let value = Blockly.JavaScript.valueToCode(block, 'INPUT');

                    return [`devices.get('${hw.id}').setValue(${value});`];
                };
            },
            natural: (hw) => {
                return function (block) {
                    return [`input set value`];
                };
            }
        });
    }


    setValue (value) {
        this.getElement().setValue(value);
    }

    addEventListener () {
        let element;
        super.addEventListener.apply(this, arguments);
        element = this.getElement();
        return element.addEventListener.apply(element, arguments);
    }

    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners();
    }
}
