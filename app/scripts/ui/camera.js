import UI from './ui';

export default class Camera extends UI {
    constructor () {
        super({
            type: 'camera',
            label: 'Camera',
            image: 'assets/hw/camera.png',
            hue: 60
        });
        this.addBlock({
            id: 'take_picture',
            output: true,
            message0: 'take a picture',
            javascript: (hw) => {
                return function (block) {
                    let code = `devices.get('${hw.id}').takePicture()`;
                    return [code];
                };
            },
            natural: (hw) => {
                return function (block) {
                    let code = `${hw.label}'s picture'`;
                    return [code];
                };
            }
        });
        this.addEvent({
            label: 'took a picture',
            id: 'picture-taken'
        });
        this.lastPicture = null;
    }
    getLastPicture () {
        return this.lastPicture;
    }
    takePicture () {
        return this.getElement()
                    .takePicture()
                    .then((picture) => {
                        this.lastPicture = picture;
                        return picture;
                    });
    }
    stop () {
        super.stop.apply(this, arguments);
        return this.getElement().stop();
    }
    start () {
        return this.getElement().start();
    }
    addEventListener () {
        super.addEventListener.apply(this, arguments);
        let element = this.getElement();
        return element.addEventListener.apply(element, arguments);
    }
    removeListeners () {
        let element = this.getElement();
        this.listeners.forEach((listener) => {
            element.removeEventListener.apply(element, listener);
        });
        super.removeListeners();
    }
}
