import { Disposables } from '@kano/common/index.js';
import { collectPrototype } from './util.js';
import { PartComponent } from './component.js';

/**
 * Declares the APIs available for the part to use.
 * This usually give access to the output's APIs.
 */
export interface IPartContext {
    visuals : {
        canvas : HTMLCanvasElement;
        width : number;
        height : number;
    };
    audio : {
        context : AudioContext;
        destination : AudioNode;
    };
    dom : {
        root : HTMLElement;
    };
}

/**
 * Base interface every part must implement.
 * It ensures the lifecycle steps are dealt with
 */
export interface IPart {
    onInstall(context : IPartContext) : void;
    onStart() : void;
    onStop() : void;
}

export class Part implements IPart {
    protected subscriptions : Disposables = new Disposables();
    protected _components : Map<string, PartComponent> = new Map();
    public static components? : string[];
    public id? : string;
    public name? : string;
    static get type() : string {
        throw new Error('Could not create part, type is not defined');
    }
    constructor() {
        const components = collectPrototype<Type<PartComponent>>('components', this.constructor, Part);
        components.forEach((componentClass, key) => {
            const component = new componentClass();
            this._components.set(key, component);
        });
    }
    onInstall(context: IPartContext): void {
        throw new Error('Method not implemented.');
    }
    onStart() {}
    onStop() {
        this.reset();
    }
    dispose() {
        this.subscriptions.dispose();
    }
    serialize() {
        const data : { [K : string] : any } = {
            type: (this.constructor as typeof Part).type,
            id: this.id,
            name: this.name,
        };
        this._components.forEach((component, key) => {
            data[key] = component.serialize();
        });
        return data;
    }
    load(data : any) {
        this.id = data.id;
        this.name = data.name;
        this._components.forEach((component, key) => {
            if (!data[key]) {
                return;
            }
            component.load(data[key]);
        });
    }
    reset() {
        this._components.forEach(component => component.reset());
    }
}