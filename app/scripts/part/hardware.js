import Part from './part';

export default class Hardware extends Part {

    constructor (opts) {
        super(opts);
        this.partType = 'hardware';
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        return plain;
    }
}
