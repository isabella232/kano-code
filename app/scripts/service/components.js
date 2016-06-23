import CodeService from './code';

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
        code.snapshot = code.snapshot || {};
        return `\nglobal.emit('start');\n${code.snapshot.javascript}` || '';
    }
    /**
     * Bundle the pieces of code created by the user and evaluates it
     * @return
     */
    run (parts, code, modules) {
        let codeString = this.generateCode(code);
        this.start(parts, modules);
        // Run the code using this store. Only expose the get function
        CodeService.run(codeString, {
            get (id) {
                return document.querySelector(`kano-workspace #${id}`);
            }
        }, modules);
    }
    start (parts, modules) {
        this.executeLifecycleStep('start', modules);
        this.startAll(parts);
    }
    /**
     * Stop the current running code. Will take care to stop the components
     * and the pure JS modules
     */
    stop (parts, modules) {
        this.executeLifecycleStep('stop', modules);
        this.stopAll(parts);
    }
    executeLifecycleStep (name, modules) {
        Object.keys(modules).forEach((moduleName) => {
            if (modules[moduleName].lifecycle && modules[moduleName].lifecycle[name]) {
                modules[moduleName].lifecycle[name]();
            }
        });
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
    generateStandaloneComponent (componentName, parts, backgroundStyle, workspaceRect, codes, modules) {
        let template = [],
            tagName,
            components,
            code = this.generateCode(codes),
            component,
            partsString;

        parts = parts || [];

        components = parts.reduce((acc, part) => {
            tagName = part.tagName || `kano-ui-${part.type}`;
            acc[part.id] = part.toJSON();
            template.push(`<${tagName} id="${part.id}" model="{{parts.${part.id}}}" auto-start></${tagName}>`);
            return acc;
        }, {});
        partsString = JSON.stringify(components);

        template = template.join('\n');
        // TODO find a better way to avoid having this script tag swallowed by
        // crisper
        let scr = 'script',
            moduleNames = Object.keys(modules),
            moduleValues = moduleNames.map(m => `Kano.AppModules.getModule('${m}')`),
            wrappedCode = `
                (function (devices, ${moduleNames.join(', ')}) {
                    ${code};
                })(devices, ${moduleValues.join(', ')});
            `;

        component = `
            <dom-module id="kano-${componentName}">
                <style>
                    :host {
                        ${backgroundStyle}
                        position: relative;
                    }
                    kano-ui-viewport {
                        position: absolute;
                        top: 0px;
                        left: 0px;
                        width: 100%;
                        height: 100%;
                    }
                    kano-ui-viewport * {
                        position: absolute;
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
                    is: 'kano-${componentName}',
                    properties: {
                        parts: {
                            type: Object,
                            value: ${partsString}
                        }
                    },
                    attached: function () {
                        var devices = {
                            get: function (id) {
                                if (id === 'dropzone') {
                                    return this;
                                }
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
}

componentStore = new ComponentStore();

export default componentStore;
