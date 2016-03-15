const COLOUR = '#FBDF51';

let register = (Blockly) => {
    Blockly.Blocks['camera_take_picture'] = {
        init: function () {
            let json = {
                id: 'camera_take_picture',
                colour: COLOUR,
                output: true,
                message0: 'a picture from the camera'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['camera_take_picture'] = (block) => {
        let code = `camera.takePicture()`;
        return [code];
    };

    Blockly.Natural['camera_take_picture'] = (block) => {
        let code = `a picture from the camera`;
        return [code];
    };

    Blockly.Blocks['camera_get_video'] = {
        init: function () {
            let json = {
                id: 'camera_get_video',
                colour: COLOUR,
                output: true,
                message0: 'camera\'s video'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['camera_get_video'] = (block) => {
        let code = `camera.getVideoStream()`;
        return [code];
    };

    Blockly.Natural['camera_get_video'] = (block) => {
        let code = `camera\'s video`;
        return [code];
    };
};
let category = {
    name: 'Camera',
    colour: COLOUR,
    blocks: [{
        id: 'camera_take_picture'
    },{
        id: 'camera_get_video'
    }]
};

export default {
    register,
    category
};
