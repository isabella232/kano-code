import slug from 'speakingurl';
import CodeService from './code';


let componentStore;

/**
 * Store and namespace manager for the UI components.
 * Adding UI components to this store will automatically add/correct collision
 * with already used names/ids
 */
class ComponentStore {
    constructor () {
        this.components = {};
    }
    /**
     * Add a component to this namespace
     * @param {Object}      component   The model
     * @param {HTMLElement} element     The DOM element added in the view
     */
    add (model) {
        // When added to this store, we make sure the name is unique
        model.name = this.createUniqueName(model.name || model.label);
        // As the name is displayed, we also want an id, that will only contain
        // safe characters
        model.id = this.createId(model.name);
        // Prefix the block ids with the component id to avoid
        // collision during creation
        model.blocks = model.blocks.map((block) => {
            block.id = `${model.id}_${block.id}`;
            return block;
        });
        // Use the id as key
        this.components[model.id] = {
            model,
            element: null,
            codes: {}
        };
    }
    setElement (id, element) {
        this.get(id).element = element;
    }
    /**
     * Add a piece of code to a component
     * @param {String} id   Component to which add the piece of code
     * @param {String} code JS code
     * @param {String} rule Natural language code
     * @param {String} xml  Blockly representation of the blocks used to
     *                      create this piece of code
     */
    setCode (id, event, code, rule, xml) {
        this.get(id).codes[event] = {
            code,
            rule,
            xml
        };
    }
    /**
     * Unregister a component
     * @param  {String} id
     */
    remove (id) {
        delete this.components[id];
    }
    /**
     * Access to a component using its id
     * @param  {String} id
     * @return {Object}    The component requested
     */
    get (id) {
        return this.components[id];
    }
    /**
     * Create a new unique id in the component workspace
     * @return {String}         A new unique id
     */
    createId (name) {
        return slug(name);
    }
    /**
     * Create a new unique name in the component workspace
     * @param  {String} name   The original name of the component
     * @param  {Number} incr    The increment id used for uniqueness check
     * @return {String}         A new unique id
     */
    createUniqueName (name, incr=0) {
        let ids = this.getNameList(),
            newName = name;
        if (incr) {
            newName = `${name} ${incr}`;
        }
        if (ids.indexOf(newName) !== -1) {
            return this.createUniqueName(name, incr + 1);
        }
        return newName;
    }
    /**
     * Check if the choosen name is available
     * @param  {String}  name Name to check against the namespace
     * @return {Boolean}      Available or conflicts
     */
    isNameAvailable (name) {
        return this.getNameList().indexOf(name) === -1;
    }
    /**
     * Get the list of names used in this namespace
     * @return {Array} [description]
     */
    getNameList () {
        return Object.keys(this.components)
                    .map((id) => this.components[id].model.name);
    }
    /**
     * Call all the start functions of the registered components
     * @return
     */
    startAll () {
        return this.callAll('start');
    }
    /**
     * Call all the stop functions of the registered components
     * @return
     */
    stopAll () {
        return this.callAll('stop');
    }
    /**
     * Call a function by name on all the registered components
     * @param  {String} func Name of the function to call
     * @return
     */
    callAll (func) {
        Object.keys(this.components).forEach((id) => {
            if (this.components[id].model[func] && typeof this.components[id].model[func] == 'function') {
                this.components[id].model[func]();
            }
        });
    }
    /**
     * Get a set of rules for a given component
     * @param  {String} id
     * @return {Array}      All the rules of the requested component
     */
    getRulesFor (id) {
        return this.components[id].codes.map((c) => {
            return c.rule;
        });
    }
    /**
     * Bundle the pieces of code created by the user and evaluates it
     * @return
     */
    run () {
        let codeList = Object.keys(this.components)
            // Exclude the components without code pieces
            .filter((id) => Object.keys(this.components[id].codes).length)
            .map((id) => {
                // Extract the JS code from the code pieces objects
                return Object.keys(this.components[id].codes)
                    .map((e) => {
                        let code = this.components[id].codes[e].code;
                        return `devices.get('${id}').addEventListener('${e}', function (){${code}})`;
                    })
                    .join(';');
            });
        this.start();
        // Run the code using this store. Only expose the get function
        CodeService.run(codeList.join(';'), {
            get (id) {
                return componentStore.get(id).model;
            }
        });
    }
    start () {
        CodeService.start();
        this.startAll();
    }
    /**
     * Stop the current running code. Will take care to stop the components
     * and the pure JS modules
     */
    stop () {
        CodeService.stop();
        this.stopAll();
    }
}

componentStore = new ComponentStore();

export default componentStore;
