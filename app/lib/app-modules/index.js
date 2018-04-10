import AppModules from './app-modules.js';

class AppModulesLoader {
    constructor(editor, modules) {
        this.editor = editor;
        this.appModules = new AppModules();
        this.modules = modules;
    }

    start() {
        this.appModules.init(this.editor.config);
        this.modules.forEach((Mod) => {
            this.appModules.define(Mod.name, Mod);
        });
    }
}

export default AppModulesLoader;
