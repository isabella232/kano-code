import { AppModule } from '../../app-modules/app-module.js';
import { defaultStamp, stamps } from './data.js';
import { reduceAllImages } from '../../util/image-stamp.js';

export class StampModule extends AppModule {
    static get id() {
        return 'stamp';
    }
    
    constructor(output : any) {
        super(output);
        this.addMethod('random', this.random);
        this.addMethod('randomFrom', this.randomFrom);
        this.addMethod('defaultStamp', this.defaultStamp);
        this.addMethod('stamps', this.stamps);
    }
    defaultStamp() { return defaultStamp }

    stamps() { return stamps }
    
    random() {
        const all = reduceAllImages(this.stamps());
        const allKeys = Object.keys(all);
        const idx = Math.floor(Math.random() * allKeys.length);
        return allKeys[idx];
    }

    randomFrom(index: string) {
        const set = this.stamps().find(stamp => stamp.id === index);
        if (!set) {
            return this.defaultStamp
        }
        const allKeys = Object.keys(set.stickers);
        const idx = Math.floor(Math.random() * allKeys.length);
        return allKeys[idx];
    }

}

export default StampModule;
