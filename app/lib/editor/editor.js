import EventEmitter from '../util/event-emitter.js';
import Config from '../config.js';
import Store from '../store.js';
import ModeActions from '../actions/mode.js';
import PartsActions from '../actions/parts.js';
import EditorActions from '../actions/editor.js';

// FIXME
import FlowDown from '../../../flow-down/flow-down.js';

window.FlowDown = FlowDown;

class Editor extends EventEmitter {
    constructor(opts) {
        super();
        this.config = Config.merge(opts);
        this.rootEl = document.createElement('kano-app-editor');
        this.rootEl.editor = this;
        this.store = Store.create({
            running: false,
            config: this.config,
            addedParts: [],
            workspaceTab: 'workspace',
        });
        this.modeActions = ModeActions(this.store);
        this.partsActions = PartsActions(this.store);
        this.editorActions = EditorActions(this.store);

        this.rootEl.storeId = this.store.id;

        this.rootEl.addEventListener('share', this.onShare.bind(this));
        this.rootEl.addEventListener('exit', this.onExit.bind(this));
        this.rootEl.addEventListener('change', this.onChange.bind(this));

        this.store.providerElement.addEventListener('running-changed', this.onRunningChange.bind(this));

        // Legacy APIs wrapped here
        // TODO: Interface these API better with a OO pattern
        Kano.MakeApps.Blockly.init();
        Kano.MakeApps.Blockly.register(window.Blockly);
        Kano.MakeApps.Parts.init();
    }

    inject(element = document.body, before = null) {
        element.appendChild(this.store.providerElement);
        if (before) {
            element.insertBefore(this.rootEl, before);
            return;
        }
        element.appendChild(this.rootEl);
    }

    setParts(parts) {
        this.partsActions.updatePartsList(parts);
    }

    setMode(modeDefinition) {
        this.modeActions.updateMode(modeDefinition);
    }

    setToolbox(toolbox) {
        this._toolbox = toolbox;
        this.rootEl.defaultCategories = this._toolbox;
    }

    load(app) {
        Kano.MakeApps.Parts.clear();
        this.rootEl.load(app, Kano.MakeApps.Parts.list);
        this.editorActions.loadBlocks(app.code.snapshot.blocks);
    }

    onShare(e) {
        this.emit('share', e.detail);
    }

    onExit() {
        this.emit('exit');
    }

    onChange(e) {
        this.emit('change', e.detail);
    }

    onRunningChange() {
        this.emit('running-state-changed');
    }

    save() {
        return this.rootEl.save();
    }

    share() {
        this.rootEl.share();
    }

    getMode() {
        const { mode } = this.store.getState();
        return mode;
    }

    getCode() {
        const { code } = this.store.getState();
        return code;
    }

    setRunningState(state) {
        this.editorActions.setRunningState(state);
    }

    getRunningState() {
        const { running } = this.store.getState();
        return running;
    }

    getWorkspace() {
        return this.rootEl.getWorkspace();
    }

    getBlocklyWorkspace() {
        return this.rootEl.getBlocklyWorkspace();
    }

    loadVariables(variables) {
        const workspace = this.getBlocklyWorkspace();
        if (variables && workspace) {
            variables.forEach((v) => {
                Blockly.Variables.addVariable(v, workspace);
            });
        }
    }
}

export default Editor;
