import { SubModule, AppModule } from '../../app-modules/app-module.js';
import { Instrument } from '../../app-modules/instrument.js';
import { defaultStamp, stamps } from './data.js';
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
    static get id() {
        return 'stamp';
    }
    
    constructor(output : any, ds? : any, set? :any) {
        super(output);
        // console.log(output, ds, set);

        this.addMethod('_defaultStamp', ds ? ds : defaultStamp);
        this.addMethod('_stamps', set ? set : stamps);

        this.addMethod('random', this.random);
        this.addMethod('randomFrom', this.randomFrom);
        this.addMethod('defaultStamp', this.defaultStamp);
        this.addMethod('stamps', this.stamps);
    }
    defaultStamp() { return defaultStamp }

    stamps() { return stamps }
    
    random() {
        const all = reduceAllImages(stamps);
        const allKeys = Object.keys(all);
        const idx = Math.floor(Math.random() * allKeys.length);
        return allKeys[idx];
    }

    randomFrom(index: string) {
        const set = stamps.find(stamp => stamp.id === index);
        if (!set) {
            return defaultStamp
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