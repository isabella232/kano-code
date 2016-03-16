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
    run (code, modulesNames, store) {
        let modulesArray,
            wrapUserCode;

        modulesNames.unshift('global');
        modulesNames.unshift('time');

        modulesArray = modulesNames.map((name) => modules[name].methods);

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
        CodeService.executeLifecycleStep('stop');
    },
    start () {
        CodeService.executeLifecycleStep('start');
    },
    executeLifecycleStep (name) {
        Object.keys(modules).forEach((moduleName) => {
            if (modules[moduleName].lifecycle && modules[moduleName].lifecycle[name]) {
                modules[moduleName].lifecycle[name]();
            }
        });
    },
    getStringifiedModules (names) {
        names = names || Object.keys(modules);
        let modulesNames = Object.keys(modules)
                            .filter(name => names.indexOf(name) !== -1),
        // Extract all the modules' methods
            modulesArray = modulesNames
                    .map(CodeService.generateModuleCode).join(';');
        return modulesArray;
    },
    getStringifiedModule (name) {
        // Copy the object to flatten it
        // And by that I mean extracting the methods and
        // lifecycle function to put the a the root
        // level
        let flattened = Object.assign({}, modules[name]);

        // Move the methods
        Object.keys(flattened.methods).forEach((methodName) => {
            flattened[methodName] = flattened.methods[methodName];
        });
        delete flattened.methods;

        // Move the lifecycle functions
        if (flattened.lifecycle) {
            flattened.start = flattened.lifecycle.start;
            flattened.stop = flattened.lifecycle.stop;

            delete flattened.lifecycle;
        }

        // Stringify the whole object
        let methodsString = Object.keys(flattened)
            .map((methodName) => {
                // Use stringify or to string accordingly
                let value = typeof flattened[methodName] === 'function' ?
                            flattened[methodName].toString() :
                            JSON.stringify(flattened[methodName]);
                // Build the method assignment
                return `${name}.${methodName} = ${value}`;
            }).join(';'),
            startString = '';
        // Add a call to the start function if it exists
        if (flattened.start) {
            startString = `${name}.start()`;
        }
        // Create the module and add its methods
        return `var ${name} = {};${methodsString};${startString}`;
    }
};
