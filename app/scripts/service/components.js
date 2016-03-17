import slug from 'speakingurl';
import CodeService from './code';
import part from '../part';

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
    add (model, codes) {
        if (!model.id) {
            // When added to this store, we make sure the name is unique
            model.name = this.createUniqueName(model.name || model.label);
            // As the name is displayed, we also want an id, that will only contain
            // safe characters
            model.id = this.createId(model.name);
        }
        // Prefix the block ids with the component id to avoid
        // collision during creation
        model.blocks = model.blocks.map((block) => {
            block.id = `${model.id}_${block.id}`;
            return block;
        });

        model.codes = codes || {};

        // Use the id as key
        this.components[model.id] = {
            model,
            element: null
        };
    }
    setElement (id, element) {
        this.get(id).element = element;
    }
    /**
     * Add a piece of code to a component
     * @param {String} id       Component to which add the piece of code
     * @param {String} emitter  Id of the emitter component
     * @param {Object} code     javascript, and natural code
     * @param {String} xml      Blockly representation of the blocks used to
     *                          create this piece of code
     */
    setCode (id, emitter, event, code) {
        let codes;
        codes = this.get(id).model.codes;
        codes[emitter] = codes[emitter] || {};
        codes[emitter][event] = code;
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
        return this.components[id].model.codes.map((c) => {
            return c.rule;
        });
    }
    generateCode () {
        let model,
            codeList;
        codeList = Object.keys(this.components)
            .filter((id) => {
                return this.components[id].model.partType === 'ui';
            })
            .map((id) => {
                model = this.components[id].model;
                return this.generateComponentCode(model);
            });
        codeList.push(`global.emit('start')`);
        return codeList.join(';');
    }
    generateEventCode (emitterId, eventId, code) {
        let emitterString = emitterId === 'global' ?
                            'global' :
                            `devices.get('${emitterId}')`;
        return `${emitterString}.addEventListener('${eventId}',
                        function (){
                            ${code.javascript}
                        })`;
    }
    generateEmitterCode (emitterId, emitter) {
        let eventCode;
        return Object.keys(emitter).map((eventId) => {
            eventCode = emitter[eventId];
            return this.generateEventCode(emitterId, eventId, eventCode);
        }).join(';');
    }
    generateComponentCode (model) {
        let codes = model.codes,
            emitter;
        return Object.keys(codes)
            .map((emitterId) => {
                emitter = codes[emitterId];
                return this.generateEmitterCode(emitterId, emitter);
            })
            .join(';');
    }
    generateModuleCode (model) {
        return CodeService.getStringifiedModule(model.type);
    }
    getModules () {
        return Object.keys(this.components)
            .filter((id) => {
                return this.components[id].model.partType === 'module';
            })
            .map((id) => {
                return this.components[id].model.type;
            });
    }
    /**
     * Bundle the pieces of code created by the user and evaluates it
     * @return
     */
    run () {
        let code = this.generateCode(),
            modules;
        modules = this.getModules();
        this.start();
        // Run the code using this store. Only expose the get function
        CodeService.run(code, modules, {
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
    save (id, rect) {
        let component = this.get(id),
            saved;
        component.model.position = component.element.getPosition();
        component.model.position.x -= rect.left;
        component.model.position.y -= rect.top;
        return {
            model: component.model.toJSON(),
            codes: component.model.codes
        };
    }
    saveAll (workspaceRect) {
        let components = Object.keys(this.components).reduce((acc, id) => {
            acc[id] = this.save(id, workspaceRect);
            return acc;
        }, {});

        return components;
    }
    generateStandaloneComponent (workspaceRect) {
        let template = '',
            components = Object.keys(this.components).reduce((acc, id) => {
                acc[id] = this.save(id, workspaceRect).model;
                template += this.get(id).element.save();
                return acc;
            }, {}),
            code = this.generateCode(),
            id = 'kano-user-component',
            component,
            modules,
            componentsString = JSON.stringify(components).replace(/"/g, '\\"');

        modules = CodeService.getStringifiedModules(this.getModules());

        // TODO This hack is to prevent crisper to extract code between the
        // script tags
        let scr = 'script';

        component = `
            <${scr}>${modules};</${scr}>
            <dom-module id="${id}">
                <style></style>
                <template>
                    <kano-ui-viewport mode="scaled"
                                view-width="1024"
                                view-height="768">
                        ${template}
                    </kano-ui-viewport>
                </template>
            </dom-module>
            <${scr}>
                Polymer({
                    is: '${id}',
                    properties: {
                        components: {
                            type: Object,
                            value: JSON.parse("${componentsString}}"),
                            observer: 'componentsChanged'
                        }
                    },
                    attached: function () {
                        var devices = {
                            get: function (id) {
                                return this.$$('#' + id);
                            }.bind(this)
                        };
                        ${code};
                    },
                    componentsChanged () {
                        var el;
                        Object.keys(this.components).forEach(function (id) {
                            el = this.$$('#' + id);
                            el.style.position = 'absolute';
                            el.style.left = this.components[id].position.x + 'px';
                            el.style.top = this.components[id].position.y + 'px';
                        }.bind(this));
                    }
                });
            </${scr}>
        `;

        return component;
    }
    loadAll (components) {
        Object.keys(components).forEach((id) => {
            this.load(part.fromSaved(components[id].model), components[id].codes);
        });
    }
    load (model, codes) {
        this.add(model, codes);
    }
    getAll () {
        return this.components;
    }
}

componentStore = new ComponentStore();

export default componentStore;
