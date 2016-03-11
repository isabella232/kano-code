import natural from './natural';
import catPicture from './cat-picture';
import weather from './weather';
import images from './images';
import time from './time';
import cons from './console';
import basic from './basic';
import giphy from './giphy';
import camera from './camera';

/**
 * Except for the natural declaration of language, each module will return a
 * definition of the category and blocks. We put these definitions on
 * an array and return all the categories;
 * @param  {[type]} Blockly [description]
 * @return {[type]}         [description]
 */
let registered = false,
    register = (Blockly) => {
        if (registered) {
            return;
        }
        // Register the modules
        natural.register(Blockly);
        catPicture.register(Blockly);
        weather.register(Blockly);
        images.register(Blockly);
        time.register(Blockly);
        cons.register(Blockly);
        giphy.register(Blockly);
        camera.register(Blockly);
        registered = true;
    };

let categories = [
    catPicture.category,
    weather.category,
    images.category,
    time.category,
    cons.category,
    giphy.category,
    camera.category
].concat(basic.categories);

export default {
    register,
    categories
};
