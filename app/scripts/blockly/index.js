import pseudo from './pseudo';
import operators from './operators';
import control from './control';
import variables from './variables';
import events from './events';
import background from './background';

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
        pseudo.register(Blockly);
        control.register(Blockly);
        operators.register(Blockly);
        variables.register(Blockly);
        events.register(Blockly);
        background.register(Blockly);
        registered = true;
    };

let categories = {
    control: control.category,
    operators: operators.category,
    variables: variables.category,
    events: events.category,
    background: background.category
};

export default {
    register,
    categories
};
