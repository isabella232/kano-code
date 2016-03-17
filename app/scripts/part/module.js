import Part from './part';

export default class Module extends Part {
    constructor (opts) {
        super(opts);
        this.partType = 'module';
    }
    toJSON () {
        let plain = super.toJSON.call(this);
        return plain;
    }
    load (plain) {
        super.load(plain);
    }
}
