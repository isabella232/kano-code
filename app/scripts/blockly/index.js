import natural from './natural';
import basic from './basic';
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
        math.register(Blockly);
        registered = true;
    };

let categories = [
    math.category
].concat(basic.categories);

export default {
    register,
    categories
};
