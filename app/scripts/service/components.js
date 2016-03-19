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
    /**
     * Call all the start functions of the registered components
     * @return
     */
    startAll (parts) {
        return this.callAll(parts, 'start');
    }
    /**
     * Call all the stop functions of the registered components
     * @return
     */
    stopAll (parts) {
        return this.callAll(parts, 'stop');
    }
    /**
     * Call a function by name on all the registered components
     * @param  {String} func Name of the function to call
     * @return
     */
    callAll (parts, func) {
        let element;
        parts.forEach((part) => {
            if (!part.id) {
                return;
            }
            element = document.querySelector(`#${part.id}`);
            if (element && element[func] && typeof element[func] == 'function') {
                element[func]();
            }
        });
    }
    generateCode (parts) {
        let codeList;
        codeList = parts
            .filter((part) => {
                return part.partType && part.partType === 'ui';
            })
            .map((part) => {
                return this.generateComponentCode(part);
            });
        codeList.push(`global.emit('start')`);
        return codeList.join(';');
    }
    generateEventCode (emitterId, eventId, code) {
        let emitterString = emitterId === 'global' ?
                            'global' :
                            `devices.get('${emitterId}')`;
        return `${emitterString}.when('${eventId}',
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
    /**
     * Bundle the pieces of code created by the user and evaluates it
     * @return
     */
    run (parts, modules) {
        let code = this.generateCode(parts);
        this.start(parts);
        // Run the code using this store. Only expose the get function
        CodeService.run(code, modules, {
            get (id) {
                return document.querySelector(`#${id}`);
            }
        });
    }
    start (parts) {
        CodeService.start();
        this.startAll(parts);
    }
    /**
     * Stop the current running code. Will take care to stop the components
     * and the pure JS modules
     */
    stop (parts) {
        CodeService.stop();
        this.stopAll(parts);
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
                                view-width="${app.config.WORKSPACE_FULL_SIZE.width}"
                                view-height="${app.config.WORKSPACE_FULL_SIZE.height}">
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
