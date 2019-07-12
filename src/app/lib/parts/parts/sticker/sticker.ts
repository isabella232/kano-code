import { part, component } from '../../decorators.js';
import { DOMPart } from '../dom/dom.js';
// import { stamps, defaultStamp } from '../../../modules/stamp/data.js';
import { reduceAllImages, resolve } from '../../../util/image-stamp.js';
import { transformLegacySticker } from './legacy.js';
import { StickerComponent } from './sticker-component.js';
import * as StampFunctions from '../../../modules/stamp/stamp.js';
import { IPartContext } from '../../part.js';

// const all = reduceAllImages(stamps);

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    @component(StickerComponent)
    public core : StickerComponent;
    public _stickers? : { default: string; set: string[][]; };

    static transformLegacy(app : any) {
        transformLegacySticker(app);
    }
    public get items() { 
        if(this._stickers) {
            return this._stickers.set;
        }
    }
    public get defaultSticker() { 
        if(this._stickers) {
            return this._stickers.default;
        }
    }
    constructor() {
        super();
        this.core = this._components.get('core') as StickerComponent;
        this.core.invalidate();
    }

    onInstall(context : IPartContext) {
        this._stickers = context.stickers;
    }

    getElement() : HTMLDivElement {
        const el = document.createElement('div');
        el.style.width = '100px';
        el.style.height = '100px';
        el.style.backgroundSize = 'contain';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundPosition = 'center';
        el.title = 'sticker';
        return el;
    }
    render() {
        super.render();
        if (!this.core.invalidated) {
            return;
        }
        let all = [];
        if (this._stickers) {
            all = reduceAllImages(this._stickers.set);
        }
        const sticker = this.core.image.get();
        if (sticker && all[sticker]) {
            this._el.style.backgroundImage = `url(${resolve(all[sticker])})`;
        }
        this.core.apply();
    }
    renderComponents(ctx: CanvasRenderingContext2D) : Promise<void> {
        const transform = this._components.get('transform');
        let url = '';
        if (transform) {
            this.applyTransform(ctx);
        }
        let all = [];
        if (this._stickers) {
            all = reduceAllImages(this._stickers.set);
        }
        const sticker = this.core.image.get();
        if (sticker && all[sticker]) {
            url = resolve(all[sticker]);
        }
        const imageLoaded = new Promise((res) => {
            const img = new Image();
            img.onload = () => {
                this._components.forEach(component => component.render(ctx, img));
                this.resetTransform(ctx);
                res();
            }
            img.crossOrigin = "Anonymous";
            img.src = url;
        }) as Promise<void>;
        return imageLoaded;
    }
    set image(id : string) {
        this.core.image.set(id);
        this.core.invalidate();
    }
    random() {
        if (this._stickers) {
            return StampFunctions.random(this._stickers.set);
        }
    }
    randomFrom(index : string) {
        if (this._stickers) {
            return StampFunctions.randomFrom(index, this._stickers.set, this._stickers.default);
        }
    }
}
