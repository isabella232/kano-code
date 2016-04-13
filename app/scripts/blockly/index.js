import natural from './natural';
import weather from './weather';
import images from './images';
import basic from './basic';
import giphy from './giphy';
import camera from './camera';
import math from './math';

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
        //weather.register(Blockly);
        //images.register(Blockly);
        //cons.register(Blockly);
        giphy.register(Blockly);
        camera.register(Blockly);
        math.register(Blockly);
        registered = true;
    };

let categories = [
    //weather.category,
    //images.category,
    //cons.category,
    giphy.category,
    camera.category,
    math.category
].concat(basic.categories);

export default {
    register,
    categories
};
