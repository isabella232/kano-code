import Plugin from './plugin.js';
import MetaModule from '../meta-api/module.js';
// TODO: Only load the required renderer for the source type
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';
import TypeScriptMetaRenderer from '../meta-api/renderer/typescript.js';

class Toolbox extends Plugin {
    onInstall(editor) {
        this.editor = editor;
        switch (editor.sourceType) {
        case 'code': {
            this.renderer = new TypeScriptMetaRenderer();
            break;
        }
        default:
        case 'blockly': {
            this.renderer = new BlocklyMetaRenderer();
            break;
        }
        }
    }
    setEntries(entries) {
        this.entries = entries;
    }
    onInject() {
        const toolbox = this.entries
            .map(entry => this.renderer.renderToolboxEntry(new MetaModule(entry)))
            .filter(entry => entry);
        this.editor.editorActions.setToolbox(toolbox);
    }
}

export default Toolbox;
