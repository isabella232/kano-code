import UI from './ui';

export default class UIImage extends UI {
    constructor () {
        super({
            type: 'image',
            label: 'Image',
            image: 'assets/hw/canvas.png',
            colour: '#E73544',
            customizable: {
                style: ['width', 'height']
            },
            userStyle: {
                width: '200px',
                height: '200px'
            }
        });
        this.addBlock({
            id: 'draw_picture',
            message0: 'draw picture from %1',
            args0: [{
                type: "input_value",
                name: "PICTURE"
            }],
            previousStatement: null,
            javascript: (hw) => {
                return function (block) {
                    let pic = Blockly.JavaScript.valueToCode(block, 'PICTURE'),
                        code = `devices.get('${hw.id}').drawPicture(${pic})`;
                    return code;
                };
            },
            natural: (hw) => {
                return function (block) {
                    let pic = Blockly.Natural.valueToCode(block, 'PICTURE'),
                        code = `draw picture on ${hw.name} from ${pic}`;
                    return code;
                };
            }
        });
    }
    drawPicture (pic) {
        return this.getElement().drawPicture(pic);
    }
}
