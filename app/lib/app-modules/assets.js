import AppModule from './app-module.js';

class AssetsModule extends AppModule {
    constructor() {
        super();

        this.addMethod('getSticker', '_getSticker');
        this.addMethod('randomSticker', '_randomSticker');
    }

    static get name() {
        return 'assets';
    }

    _getSticker(set, sticker) {
        return Kano.MakeApps.Files.generators.stickers(set, sticker);
    }

    _randomSticker(set) {
        let sets;
        if (!set) {
            sets = Object.keys(Kano.MakeApps.Files.stickers);
            set = sets[Math.floor(Math.random() * sets.length)];
        }
        const stickers = Object.keys(Kano.MakeApps.Files.stickers[set]);
        const randomSticker = stickers[Math.floor(Math.random() * stickers.length)];
        return this._getSticker(set, randomSticker);
    }
}

export default AssetsModule;
