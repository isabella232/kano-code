import VM from './vm.js';
import AppModulesLoader from './app-modules/index.js';
import Plugin from './editor/plugin.js';

class Runner extends Plugin {
    constructor(modules) {
        super();
        this.modules = modules;
        this._onRunningStateChange = this._onRunningStateChange.bind(this);
    }
    onInstall(editor) {
        this.editor = editor;
        this.appModulesLoader = new AppModulesLoader(this.editor, this.modules);
    }
    onInject() {
        this.appModulesLoader.start();
        this.editor.on('running-state-changed', this._onRunningStateChange);
    }
    onAppload() {
        // Force refresh app state if was running
        const running = this.editor.getRunningState();
        if (running) {
            this.editor.setRunningState(!running);
            this.editor.setRunningState(running);
        }
    }
    _onRunningStateChange() {
        const running = this.editor.getRunningState();
        const { appModules } = this.appModulesLoader;
        clearTimeout(this.asyncModule);
        this.asyncModule = setTimeout(() => {
            appModules.stop();
            if (!running) {
                return;
            }
            // Get the parts elements from the workspace
            const parts = this.editor.getWorkspace().getPartsDict();
            // Tell AppModules where to find the parts
            appModules.loadParts(parts);
            const code = this.editor.getCode();
            // Generate the code
            const appCode = appModules.createAppCode('AppModules', code);
            // Start all the modules. Will also trigger the `start` event from `global`
            appModules.start();
            // Prepare a sandbox exposing AppModules
            const vm = new VM({ AppModules: appModules });
            // Run the code
            vm.runInContext(appCode);
        });
    }
}

export default Runner;
