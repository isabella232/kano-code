import CodeService from './code';
import part from '../part';
import modules from '../language/modules';

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
            if (element && typeof element[func] == 'function') {
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
                            `devices.get('${emitterId}')`,
            javascript = code.snapshot.javascript || '';
        return `${emitterString}.when('${eventId}',
                        function (){
                            ${javascript}
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
    run (parts) {
        let code = this.generateCode(parts);
        this.start(parts);
        // Run the code using this store. Only expose the get function
        CodeService.run(code, {
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
    generateStandaloneComponent (parts, workspaceRect) {
        let template = [],
            components = parts.reduce((acc, part) => {
                acc[part.id] = part.toJSON();
                template.push(`<kano-ui-${part.type} id="${part.id}" model="{{parts.${part.id}}}"></kano-ui-${part.type}>`);
                return acc;
            }, {}),
            code = this.generateCode(parts),
            id = 'kano-user-component',
            component,
            partsString = JSON.stringify(components).replace(/"/g, '\\"');

        template = template.join('\n');
        // TODO find a better way to avoid having this script tag swallowed by
        // crisper
        let scr = 'script',
            moduleNames = Object.keys(modules),
            moduleValues = moduleNames.map(m => `KanoModules.${m}`),
            wrappedCode = `
                (function (devices, ${moduleNames.join(', ')}) {
                    ${code};
                })(devices, ${moduleValues.join(', ')});
            `;

        component = `
            <dom-module id="${id}">
                <style></style>
                <template>
                    <kano-ui-viewport mode="scaled"
                                view-width="${workspaceRect.width}"
                                view-height="${workspaceRect.height}">
                        ${template}
                    </kano-ui-viewport>
                </template>
            </dom-module>
            <${scr}>
                Polymer({
                    is: '${id}',
                    properties: {
                        parts: {
                            type: Object,
                            value: JSON.parse("${partsString}}"),
                            observer: 'partsChanged'
                        }
                    },
                    attached: function () {
                        var devices = {
                            get: function (id) {
                                return this.$$('#' + id);
                            }.bind(this)
                        };
                        ${wrappedCode}
                    },
                    partsChanged () {
                        var el;
                        Object.keys(this.parts).forEach(function (id) {
                            el = this.$$('#' + id);
                            el.style.position = 'absolute';
                            el.style.left = this.parts[id].position.x + 'px';
                            el.style.top = this.parts[id].position.y + 'px';
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
