import UI from './ui';

export default class Button extends UI {
    constructor () {
        super({
            type: 'button',
            label: 'Button',
            image: 'assets/part/buttons-icon.png',
            description: 'A button that can trigger all sort of crazy stuff',
            customizable: {
                properties: [{
                    key: 'text',
                    type: 'text',
                    label: 'Text'
                }]
            },
            userProperties: {
                text: 'Click me'
            }
        });
        this.addEvent({
            label: 'is clicked',
            id: 'clicked'
        });
        this.setCustomizableStyles(['background-color']);
    }
    addEventListener (name, callback) {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        return element.addEventListener.apply(element, arguments);
    }
    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners.apply(this, arguments);
    }
    stop () {
        this.removeListeners();
        super.stop.apply(this, arguments);
    }
}
