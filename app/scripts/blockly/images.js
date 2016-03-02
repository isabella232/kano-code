const COLOUR = 172;

const FLICKR_API_KEY = 'f41acedbc022e1ebfcd54d28cf6af628';
const FLICKR_API_SECRET = '84e188d180222e4f';

let register = (Blockly) => {
    Blockly.Blocks['search_image'] = {
        init: function () {
            let json = {
                id: 'search_image',
                colour: COLOUR,
                message0: 'search an image that look like %1, then',
                args0: [{
                    type: "input_value",
                    name: "SEARCH"
                }],
                message1: '%1',
                args1: [{
                    type: "input_statement",
                    name: "DO"
                }],
                previousStatement: null
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['search_image'] = (block) => {
        let statement = Blockly.JavaScript.statementToCode(block, 'DO'),
            search = Blockly.JavaScript.valueToCode(block, 'SEARCH'),
            url = `https://www.flickr.com/services/rest/?api_key=${FLICKR_API_KEY}&method=flickr.photos.search&tags='+(${search}+',sky').split(' ').join(',')+'&format=json&nojsoncallback=1`,
            code = `fetch('${url}')
                        .then((res) => res.json())
                        .then((j) => {
                            var photos = j.photos.photo;
                            return photos[Math.floor(Math.random()*photos.length)].id
                        })
                        .then((photoId) => {
                            return fetch('https://www.flickr.com/services/rest/?api_key=${FLICKR_API_KEY}&method=flickr.photos.getSizes&photo_id='+photoId+'&format=json&nojsoncallback=1');
                        })
                        .then((res) => res.json())
                        .then((sizes) => {
                            return sizes.sizes.size[3].source;
                        })
                        .then((src) => {
                            window.lastImage = src;
                            ${statement}
                        });`;
        return code;
    };

    Blockly.Natural['search_image'] = (block) => {
        let statement = Blockly.Natural.statementToCode(block, 'DO'),
            search = Blockly.Natural.valueToCode(block, 'SEARCH'),
            code = `search an image that look like ${search} and store it, then ${statement}`;
        return code;
    };


    Blockly.Blocks['get_stored_image'] = {
        init: function () {
            let json = {
                id: 'get_stored_image',
                output: true,
                colour: COLOUR,
                message0: 'stored image'
            };
            this.jsonInit(json);
        }
    };

    Blockly.JavaScript['get_stored_image'] = (block) => {
        let code = `window.lastImage`;
        return [code];
    };

    Blockly.Natural['get_stored_image'] = (block) => {
        let code = `stored image`;
        return [code];
    };
};

let category = {
    name: 'Image',
    colour: COLOUR,
    blocks: [{
        id: 'search_image'
    },
    {
        id: 'get_stored_image'
    }]
};

export default {
    register,
    category
};
