import Plugin from './plugin.js';
import MetaModule from '../meta-api/module.js';
import BlocklyMetaRenderer from '../meta-api/renderer/blockly.js';

class Toolbox extends Plugin {
    onInstall(editor) {
        this.editor = editor;
        // TODO: Do not hardcode the renderer and let the user choose the source editor
        this.renderer = new BlocklyMetaRenderer();
    }
    setEntries(entries) {
        this.entries = entries;
    }
    onInject() {
        const toolbox = this.entries.map(entry => this.renderer.renderToolboxEntry(new MetaModule(entry))).filter(entry => entry);
        this.editor.setToolbox(toolbox);
    }
}

export default Toolbox;
