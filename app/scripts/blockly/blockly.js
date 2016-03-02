import natural from './natural';
import catPicture from './cat-picture';
import weather from './weather';
import images from './images';
import basic from './basic';

/**
 * Except for the natural declaration of language, each module will return a
 * definition of the category and blocks. We put these definitions on
 * an array and return all the categories;
 * @param  {[type]} Blockly [description]
 * @return {[type]}         [description]
 */
let register = (Blockly) => {
    // Register the modules
    natural.register(Blockly);
    catPicture.register(Blockly);
    weather.register(Blockly);
    images.register(Blockly);
};

let categories = [
    catPicture.category,
    weather.category,
    images.category
].concat(basic.categories);

export default {
    register,
    categories
};
