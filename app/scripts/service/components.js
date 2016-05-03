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
            element = document.querySelector(`kano-workspace #${part.id}`);
            if (element && typeof element[func] == 'function') {
                element[func]();
            }
        });
    }
    generateCode (code = {}) {
        return code.snapshot.javascript;
    }
    /**
     * Bundle the pieces of code created by the user and evaluates it
     * @return
     */
    run (parts, code) {
        let codeString = this.generateCode(code);
        this.start(parts);
        // Run the code using this store. Only expose the get function
        CodeService.run(codeString, {
            get (id) {
                return document.querySelector(`kano-workspace #${id}`);
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
        let component = this.get(id);
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
    generateStandaloneComponent (parts, backgroundStyle, workspaceRect, codes) {
        let template = [],
            tagName,
            components,
            code = this.generateCode(codes),
            id = 'kano-user-component',
            component,
            partsString;

        parts = parts || [];

        components = parts.reduce((acc, part) => {
            tagName = part.tagName || `kano-ui-${part.type}`;
            acc[part.id] = part.toJSON();
            template.push(`<${tagName} id="${part.id}" model="{{parts.${part.id}}}" auto-start></${tagName}>`);
            return acc;
        }, {});
        partsString = JSON.stringify(components).replace(/"/g, '\\"');

        template = template.join('\n');
        // TODO find a better way to avoid having this script tag swallowed by
        // crisper
        let scr = 'script',
            moduleNames = Object.keys(modules),
            moduleValues = moduleNames.map(m => `KanoModules.${m}.methods`),
            wrappedCode = `
                (function (devices, ${moduleNames.join(', ')}) {
                    ${code};
                })(devices, ${moduleValues.join(', ')});
            `;

        component = `
            <dom-module id="${id}">
                <style>
                    :host kano-ui-viewport * {
                        position: absolute;
                    }

                    :host kano-ui-viewport {
                        ${backgroundStyle}
                    }
                </style>
                <template>
                    <kano-ui-viewport mode="scaled"
                                view-width="${workspaceRect.width}"
                                view-height="${workspaceRect.height}"
                                no-overflow>
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
                            value: JSON.parse("${partsString}"),
                            observer: 'partsChanged'
                        }
                    },
                    partsChanged () {
                        console.log(this.parts);
                    },
                    attached: function () {
                        var devices = {
                            get: function (id) {
                                return this.$$('#' + id);
                            }.bind(this)
                        };
                        ${wrappedCode}
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
