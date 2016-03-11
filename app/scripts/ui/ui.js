import ComponentStore from '../service/components';

export default class UI {
    constructor (opts) {
        this.type = opts.type;
        this.label = opts.label;
        this.image = opts.image;
        this.hue = opts.hue;
        this.blocks = opts.blocks || [];
        this.events = opts.events || [];
        this.listeners = opts.listeners || [];
        this.customizable = opts.customizable || { style: [], properties: [] };
        this.customizable.style = this.customizable.style || [];
        this.customizable.properties = this.customizable.properties || [];
        this.userStyle = {};
        this.userProperties = {};
    }
    getElement () {
        return ComponentStore.get(this.id).element;
    }
    addBlock (block) {
        this.blocks.push(block);
    }
    addEvent (event) {
        this.events.push(event);
    }
    stop () {
        this.removeListeners();
    }
    start () {

    }
    addEventListener (name, callback) {
        this.listeners.push(arguments);
    }
    removeListeners () {
        this.listeners = [];
    }
}
