import UI from './ui';

export default class UIVideo extends UI {
    constructor () {
        super({
            type: 'video',
            label: 'Video screen',
            image: 'assets/hw/canvas.png',
            hue: 60,
            customizable: {
                style: ['width', 'height']
            }
        });
        this.addBlock({
            id: 'show_video',
            message0: 'show video from %1',
            args0: [{
                type: "input_value",
                name: "VIDEO"
            }],
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let video = Blockly.JavaScript.valueToCode(block, 'VIDEO'),
                        code = `devices.get('${hw.id}').showVideo(${video})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let video = Blockly.Natural.valueToCode(block, 'VIDEO'),
                        code = `show video from ${video}`;
                    return code;
                };
            }
        });
    }
    showVideo (url) {
        return this.getElement().showVideo(url);
    }
}
