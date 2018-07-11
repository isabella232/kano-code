import VM from '../vm.js';
import AppModulesLoader from '../app-modules/index.js';
import { Plugin } from './plugin.js';

class Runner extends Plugin {
    constructor() {
        super();
        this.modules = [];
        this._onRunningStateChange = this._onRunningStateChange.bind(this);
    }
    addModule(mod) {
        const mods = Array.isArray(mod) ? mod : [mod];
        mods.forEach(m => this.modules.push(m));
        this._updateModules();
    }
    onInstall(editor) {
        this.editor = editor;
    }
    onInject() {
        this._updateModules();
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
    _updateModules() {
        if (!this.editor || !this.editor.injected) {
            return;
        }
        if (this.appModulesLoader) {
            const { appModules } = this.appModulesLoader;
            appModules.stop();
        }
        this.appModulesLoader = new AppModulesLoader(this.editor, this.modules);
        this.appModulesLoader.start();
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
            const code = this.editor.getCode();
            // Generate the code
            const appCode = appModules.createAppCode('AppModules', code);
            // Start all the modules. Will also trigger the `start` event from `global`
            appModules.start();
            // Prepare a sandbox exposing AppModules
            const vm = new VM({ AppModules: appModules });
            // Run the code
            vm.runInContext(appCode);
            appModules.afterRun();
        });
    }
}

export default Runner;
