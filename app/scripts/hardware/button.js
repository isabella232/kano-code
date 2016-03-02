import Hardware from './hardware';

export default class Button extends Hardware {
    constructor () {
        super({
            type: 'button',
            label: 'Button',
            image: 'assets/hw/button.png',
            hue: 118
        });
        this.addEvent({
            label: 'is clicked',
            id: 'clicked'
        });
    }
    addEventListener (name, callback) {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        if (!this.remote) {
            return element.addEventListener.apply(element, arguments);
        }
    }
    removeListeners () {
        if (!this.remote) {
            let element = this.getElement();
            this.listeners.forEach((listener) => {
                element.removeEventListener.apply(element, listener);
            });
        }
        super.removeListeners();
    }
}
