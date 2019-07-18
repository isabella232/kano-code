import { part, component } from '../../decorators.js';
import { IResourceInformation } from '../../../output/resources.js';
import { DOMPart } from '../dom/dom.js';
import { stamps, defaultStamp } from '../../../modules/stamp/data.js';
import { transformLegacySticker } from './legacy.js';
import { StickerComponent } from './sticker-component.js';
import { IPartContext } from '../../part.js';

@part('sticker')
export class StickerPart extends DOMPart<HTMLDivElement> {
    private _stickers: IResourceInformation;
    @component(StickerComponent)
    public core : StickerComponent;
    static transformLegacy(app : any) {
        transformLegacySticker(app);
    }
    static get items() { return stamps; }
    static get defaultSticker() { return defaultStamp; }
    constructor() {
        super();
        this._stickers = {
            categorisedStickers: [],
            categoryEnum: [],
            getUrl: () => { return '' },
            getRandom: () => { return '' },
            getRandomFrom: () => { return '' }
        };
        this.core = this._components.get('core') as StickerComponent;
        this.core.invalidate();
    }
    onInstall(context : IPartContext) {
        if (context.stickers) {
            this._stickers = context.stickers;
        }
        if (this._stickers.default) {
            this.core.image.set(this._stickers.default)
            this.core.invalidate();
        }
        context.dom.root.appendChild(this._el);
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

        const sticker = this.core.image.get();
        if (sticker) {
            this._el.style.backgroundImage = `url(${this._stickers.getUrl(sticker)})`;
        }

        this.core.apply();
    }
    renderComponents(ctx: CanvasRenderingContext2D) : Promise<void> {
        const transform = this._components.get('transform');
        let url = '';
        if (transform) {
            this.applyTransform(ctx);
        }
        const sticker = this.core.image.get();
        
        if (sticker && this._stickers.getUrl(sticker)) {
            url = this._stickers.getUrl(sticker);
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
        return this._stickers.getRandom();
    }
    randomFrom(setId : string) {
        return this._stickers.getRandomFrom(setId);    }
}
