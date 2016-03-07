import forbidden from '../language/forbidden';
import modules from '../language/modules';

let CodeService;

/**
 * Takes care of running the user's code in a kinda safe context
 * We obviously cannot sandbox everything but we can block the access to some
 * functionalities
 * @type {Object}
 */
export default CodeService = {
    run (code, store) {
        // Extract the list of API modules names
        let modulesNames = Object.keys(modules),
        // Extract all the modules' methods
            modulesArray = modulesNames.map((name) => modules[name].methods),
            wrapUserCode;
        // Add the devices modules as first module
        modulesNames.unshift('devices');
        modulesArray.unshift(store);
        // Add the forbidden vars to the list of modules names
        modulesNames = modulesNames.concat(forbidden);
        // Use the modules names as the function args
        wrapUserCode = `window.userCode = function(${modulesNames.join(',')}){${code}};`;
        // Actually create the user's function
        eval(wrapUserCode);
        // Call the function with the modules as parameters
        // The forbidden vars will be undefined inside the function
        // since we used the names as args, but never define them
        // when we call it
        window.userCode.apply(null, modulesArray);
    },
    stop () {

    }
};
