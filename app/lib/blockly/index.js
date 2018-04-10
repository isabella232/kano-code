import Registry from './registry.js';
import { addMessage } from '../i18n/index.js';

class Blockly {
    constructor(editor, modules) {
        this.editor = editor;
        this.registry = new Registry();
        this.registry.defineAll(modules);
    }
    start() {
        Blockly.updateI18n();
        this.registry.register(window.Blockly);
        this.editor.setToolbox(this.registry.getToolbox());
    }
    static loadLang(url) {
        return fetch(url)
            .then(r => r.json())
            .then((messages) => {
                window.CustomBlocklyMsg = window.CustomBlocklyMsg || {};
                window.Blockly = window.Blockly || {};
                window.Blockly.Msg = window.Blockly.Msg || {};
                Object.assign(window.CustomBlocklyMsg, messages);
                Object.assign(window.Blockly.Msg, messages);
            });
    }
    getToolbox() {
        return this.registry.getToolbox();
    }
    static updateI18n() {
        // Adapt blockly messages to internal i18n engine
        Object.keys(window.Blockly.Msg).forEach((id) => {
            addMessage(`BLOCKLY_${id}`, window.Blockly.Msg[id]);
        });
    }
}

export default Blockly;
