import ComponentStore from '../service/components';

import Part from './part';

export default class UI extends Part {
    constructor (opts) {
        super(opts);
        this.customizable = opts.customizable || { style: [], properties: [] };
        this.customizable.style = this.customizable.style || [];
        this.customizable.properties = this.customizable.properties || [];
        this.userStyle = opts.userStyle || {};
        this.userProperties = opts.userProperties || {};
        this.partType = 'ui';
    }
    getElement () {
        return ComponentStore.get(this.id).element;
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.userStyle = this.userStyle;
        plain.userProperties = this.userProperties;
        plain.position = this.position;
        return plain;
    }
    load (plain) {
        super.load(plain);
        this.userStyle = plain.userStyle;
        this.userProperties = plain.userProperties;
        this.position = plain.position;
    }
}
