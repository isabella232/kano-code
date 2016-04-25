import Part from './part';

export default class Hardware extends Part {

    constructor (opts) {
        super(opts);
        this.partType = 'hardware';
        this.tagName = 'kano-part-hardware';
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        return plain;
    }
}
