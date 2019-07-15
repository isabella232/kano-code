import { SubModule, AppModule } from '../../app-modules/app-module.js';
import { Instrument } from '../../app-modules/instrument.js';
import * as data from './data.js';
import { reduceAllImages } from '../../util/image-stamp.js';

export function random(stamps) {
    const all = reduceAllImages(stamps);
    const allKeys = Object.keys(all);
    const idx = Math.floor(Math.random() * allKeys.length);
    return allKeys[idx];
}

export function randomFrom(index: string, stamps, defaultStamp) {
    const set = stamps.find(stamp => stamp.id === index);
    if (!set) {
        return defaultStamp
    }
    const allKeys = Object.keys(set.stickers);
    const idx = Math.floor(Math.random() * allKeys.length);
    return allKeys[idx];
}

export class StampModule extends AppModule {
    private _defaultStamp = '';
    private _stamps = [];

    static get defaultSticker() { return data.defaultStamp }
    static get stickers() { return data.stamps }

    static get id() {
        return 'stamp';
    }
    
    constructor(output : any) {
        super(output);

        this._defaultStamp = (this.constructor as typeof StampModule).defaultSticker;
        (this.constructor as typeof StampModule).stickers.forEach((set) => {
            const stickerSet = { id: set.id, label: set.label, stickers: [] };
            this._stamps.push(stickerSet);
            stickerSet.stickers.push(Object.assign(set.stickers, {}));
        })

        this.addMethod('random', this.random);
        this.addMethod('randomFrom', this.randomFrom);
        this.addMethod('defaultStamp', this.defaultStamp);
        this.addMethod('stamps', this.stamps);
        this.addMethod('_defaultStamp', this._defaultStamp);
        this.addMethod('_stamps', this._stamps);
    }
    defaultStamp() { return this._defaultStamp }

    stamps() { return this._stamps }
    
    random() {
        console.log(StampModule.defaultSticker)
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

// export function StampModule (output : any, defaultStamp? : any, stamps? : any) : AppModule {
//     if (!defaultStamp) {
//         defaultStamp = data.defaultStamp;
//     }
//     if (!stamps) {
//         stamps = data.stamps;
//     }

//     function random() {
//         const all = reduceAllImages(stamps);
//         const allKeys = Object.keys(all);
//         const idx = Math.floor(Math.random() * allKeys.length);
//         return allKeys[idx];
//     }

//     function randomFrom(index:string) {
//         const set = stamps().find(stamp => stamp.id === index);
//         if (!set) {
//             return defaultStamp
//         }
//         const allKeys = Object.keys(set.stickers);
//         const idx = Math.floor(Math.random() * allKeys.length);
//         return allKeys[idx];
//     }

//     const methods = {
//         random: random,
//         randomFrom: randomFrom,
//         defaultStamp: defaultStamp,
//         stamps: stamps,
//     }
    
//     const symbols : string[] = [];

//     const lifecycle = {};

//     const rootModule = new SubModule(methods);

//     return {
//         id: 'stamp',
//         methods,
//         symbols,
//         rootModule,
//         output,
//         lifecycle,
//         getSymbols: () => symbols,
//         addMethod: (name : string, cbName : Function|string) => {
//             if (typeof cbName === 'function') {
//                 rootModule.addMethod(name, cbName);
//             } else if (typeof this[cbName] === 'function') {
//                 rootModule.addMethod(name, this[cbName].bind(this));
//             } else {
//                 rootModule.addMethod(name, this[cbName]);
//             }
//         },
//         addModule: (name: string) => rootModule.addModule(name),
//         instrumentize: (fullPath : string, method : string) => {
//             const instrument = new Instrument(fullPath, methods, method);
//             return instrument;
//         },
//         addLifecycleStep: (name : string, cbName : string) => {
//             lifecycle[name] = this[cbName].bind(this);
//         },
//         executeLifecycleStep: (name : string) => {
//             if (name === 'start') {
//                 this.isRunning = true;
//             } else if (name === 'stop') {
//                 this.isRunning = false;
//             }
//             if (typeof this.lifecycle[name] === 'function') {
//                 this.lifecycle[name].call(this);
//             }
//         },
//     };
// }

export default StampModule;