import ComponentStore from '../service/components';

import Part from './part';

const STYLE_CONF = {
    'background-color': {
        key: 'background-color',
        type: 'color',
        label: 'Background color'
    },
    'width': {
        key: 'width',
        type: 'size',
        label: 'Width'
    },
    'height': {
        key: 'height',
        type: 'size',
        label: 'Height'
    },
    'background': {
        key: 'background',
        type: 'color',
        label: 'Background'
    }
};

export default class UI extends Part {
    constructor (opts) {
        super(opts);
        this.customizable = opts.customizable || { style: [], properties: [] };
        this.customizable.properties = this.customizable.properties || [];
        if (opts.customizable && opts.customizable.style) {
            this.customizable.style = opts.customizable.style.map((key) => {
                return STYLE_CONF[key];
            });
        }
        this.userStyle = opts.userStyle || {};
        this.userProperties = opts.userProperties || {};
        this.partType = 'ui';
        Part.typeCounter[this.type] = Part.typeCounter[this.type] || 0;
        Part.typeCounter[this.type]++;
        this.name = `${this.label} ${Part.typeCounter[this.type]}`;
        this.id = `${this.type}-${Part.typeCounter[this.type]}`;
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

Part.typeCounter = {};
