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
        label: 'Width',
        boundTo: 'width'
    },
    'height': {
        key: 'height',
        type: 'size',
        label: 'Height',
        boundTo: 'height'
    },
    'background': {
        key: 'background',
        type: 'color',
        label: 'Background'
    },
    'font-size': {
        key: 'font-size',
        type: 'size',
        label: 'Font size'
    }
};

export default class UI extends Part {

    constructor (opts, size) {
        super(opts);
        this.position = opts.position;
        this.customizable = Object.assign({}, opts.customizable) || { style: [], properties: [] };
        this.customizable.properties = this.customizable.properties || [];
        if (opts.customizable && opts.customizable.style) {
            this.customizable.style = opts.customizable.style.map((key) => {
                let style = STYLE_CONF[key];
                if (style.boundTo === 'width') {
                    style.max = size.width;
                } else if (style.boundTo === 'height') {
                    style.max = size.height;
                }
                return style;
            });
        }
        this.partType = 'ui';
        this.position = this.position || {
            x: size.width / 2,
            y: size.height / 2
        };

    }
    getElement () {
        return ComponentStore.get(this.id).element;
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        plain.customizable = {
            properties: this.customizable.properties,
            style: this.customizable.style.map(style => style.key)
        };
        return plain;
    }
    load (plain) {
        super.load(plain);
    }
}
