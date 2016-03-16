import UI from './ui';

export default class TextInput extends UI {
    constructor () {
        super({
            type: 'text-input',
            label: 'Text input',
            image: 'assets/hw/text-input.png',
            colour: '#3CAA36'
        });
        this.addBlock({
            id: 'input_text_get_value',
            output: true,
            message0: 'input value',
            javascript: (hw) => {
                return function (block) {
                    return [`devices.get('${hw.id}').getValue()`];
                };
            },
            natural: (hw) => {
                return function (block) {
                    return [`input value`];
                };
            }
        });
        this.addBlock({
            id: 'input_text_set_value',
            output: false,
            message0: 'set input value to %1',
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
        this.addEvent({
            label: 'has changed',
            id: 'input-keyup'
        });
    }
    getValue () {
        return this.getElement().getValue();
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
