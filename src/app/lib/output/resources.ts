import { Output } from './output.js';
import { join } from '../util/path.js';
import { Sticker } from '../parts/parts/sticker/types.js';

export interface IResource {
    id : string,
    label : string,
    path : string
}

export interface IResourceCategory {
    id : string,
    label : string,
    stickers : { [key:string]: IResource }
}

export interface IResourceArrayWithSrc {
    id : string,
    label : string,
    stickers : {
        id: string,
        src: string,
    }[]
}

export interface IResourceArrayCategory {
    id : string,
    label : string,
    stickers : IResource[]
}

export interface IResourceInformation {
    default? : string,
    categories? : { [key:string]: IResourceCategory },
    categorisedStickers : IResourceArrayWithSrc[],
    categoryEnum : [string, string][],
    getUrl : (id: string | Sticker | null) => string,
    getRandom : () => string,
    getRandomFrom : (id: string) => string,
}

export interface IResources {
    stickers? : IResourceInformation,
    get: (id: string) => IResourceInformation | undefined
}

export class Stickers implements IResourceInformation {
    default : string;
    categories : { [key : string]: IResourceCategory };
    all: IResource[];
    allCategorised: IResourceArrayWithSrc[];

    constructor() {
        this.default = '';
        this.categories = {};
        this.all = [];
        this.allCategorised = [];
    }
    addCategory(id : string, label : string) {
        if (this.categories[id]) {
            console.warn('Category already exists')
            return
        }
        this.categories[id] = { id, label, stickers: {} };
    }
    add(category : string, id : string, label : string, path : string) {
        if (!this.categories[category]) {
            console.warn('Category does not exist')
            return
        }
        if (this.categories[category].stickers[id]) {
            console.warn('A sticker with this name has already been created')
            return
        }

        this.categories[category].stickers[id] = { id, label, path: path }  
    }
    setDefault(id : string) {
        this.default = id;
    }

    resolve(path : string) {
        const ASSET_URL_PREFIX_KEY = 'sticker:base-url';

        const prefix = Output.config.get(ASSET_URL_PREFIX_KEY, '/assets/part/stickers');
        return encodeURI(join(prefix, path));
    }

    get stickerSet() {
        if (this.all.length > 0) {
            return this.all
        }
        
        Object.keys(this.categories).forEach(category => {
            Object.keys(this.categories[category].stickers).forEach(sticker => {
                this.all.push(this.categories[category].stickers[sticker])
            })
        })
        return this.all;
    }

    get categorisedStickers() {
        if (this.allCategorised.length > 0) {
            return this.allCategorised
        }

        Object.keys(this.categories).forEach(category => {
            let categoryObject : IResourceArrayWithSrc = {
                id: this.categories[category].id,
                label: this.categories[category].label,
                stickers: []
            }
            Object.keys(this.categories[category].stickers).forEach(
                sticker => {
                    const stickerObject = {id: sticker, src: this.getUrl(sticker)}
                    categoryObject.stickers.push( stickerObject )}
            )
            this.allCategorised.push(categoryObject)
        })
        return this.allCategorised;
    }

    get categoryEnum() {
        return Object.keys(this.categories).map<[string, string]>(category => [this.categories[category].label, this.categories[category].id])
    }

    getRandom() {
        return this.stickerSet[Math.floor(Math.random() * this.stickerSet.length)].id;
    }

    getRandomFrom(id: string) {
        if (!this.categories[id]) {
            console.warn('Category does not exist')
            return this.default
        } else {
            const randomKey = Object.keys(this.categories[id].stickers)[Math.floor(Math.random() * Object.keys(this.categories[id].stickers).length)]
            return this.categories[id].stickers[randomKey].id;
        }
    }

    getUrl(id: string | Sticker | null) {
        if (!id) {
            console.warn(`No sticker provided`);
            return '';
        }
        let selectedSticker = this.stickerSet.find(sticker => sticker.id === id)
        if (!selectedSticker) {
            selectedSticker = this.stickerSet.find(sticker => sticker.id === this.default)
        }
        if (!selectedSticker) {
            console.warn(`Sticker ${id} does not exist`)
            return '';
        }
        return this.resolve(selectedSticker.path);
    }

    getLabel(id: string) {
        const selectedSticker = this.stickerSet.find(sticker => sticker.id === id)
        if (!selectedSticker) {
            console.warn('Sticker does not exist')
            return
        }
        return this.resolve(selectedSticker.label);
    }
}

export class Resources implements IResources {
    stickers: IResourceInformation;
    constructor() {
        this.stickers = new Stickers;
    }

    get(id: string) {
        if (id === 'stickers') {
            return this.stickers;
        } else {
            console.warn('Unknown resource requested');
            return
        }
    }
}