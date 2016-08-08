import pseudo from './pseudo';
import operators from './operators';
import control from './control';
import variables from './variables';
import events from './events';
import fun from './fun';
import misc from './misc';

let modules = {
        control,
        operators,
        variables,
        events
    },
    categories = Object.keys(modules).reduce((acc, key) => {
        acc[key] = modules[key].category;
        return acc;
    }, {}),
    experiments = {
        fun: [fun],
        misc: [misc]
    },
    available = Object.keys(modules)
        .filter(key => modules[key].experiments)
        .reduce((acc, key) => {
            return acc.concat(Object.keys(modules[key].experiments));
        }, []);

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
        fun.register(Blockly);
        misc.register(Blockly);
        registered = true;
    },
    init = (c) => {
        let flags = c.getFlags();
        flags.experiments.forEach(exp => {
            if (experiments[exp]) {
                experiments[exp].forEach(m => {
                    categories[exp] = m.category;
                });
            }
            Object.keys(modules).forEach(key => {
                if (modules[key].experiments && modules[key].experiments[exp]) {
                    categories[key].blocks = categories[key].blocks.concat(modules[key].experiments[exp]);
                }
            });
        });
        c.addExperiments('blocks', available.concat(Object.keys(experiments)));
    };


module.exports = {
    register,
    categories,
    init
};
