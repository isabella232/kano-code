import VM from './vm.js';
import AppModules from './app-modules/index.js';

class Runner {
    constructor(editor) {
        this.editor = editor;
        this._onRunningStateChange = this._onRunningStateChange.bind(this);
    }
    start() {
        this.appModules = new AppModules(this.editor.config);
        this.editor.on('running-state-changed', this._onRunningStateChange);
    }
    _onRunningStateChange() {
        const running = this.editor.getRunningState();
        clearTimeout(this.asyncModule);
        this.asyncModule = setTimeout(() => {
            if (running) {
                this.appModules.stop();

                // Get the parts elements from the workspace
                const parts = this.editor.getWorkspace().getPartsDict();
                // Tell AppModules where to find the parts
                this.appModules.loadParts(parts);
                const code = this.editor.getCode();
                // Generate the code
                const appCode = this.appModules.createAppCode('AppModules', code);
                // Start all the modules. Will also trigger the `start` event from `global`
                this.appModules.start();
                // Prepare a sandbox exposing AppModules
                const vm = new VM({ AppModules: this.appModules });
                // Run the code
                vm.runInContext(appCode);
            } else {
                this.appModules.stop();
            }
        });
    }
}

export default Runner;
