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
        this.remote = opts.remote || false;
        this.slave = opts.slave || false;
        this.element = null;
    }
    getElement () {
        return ComponentStore.get(this.id);
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
