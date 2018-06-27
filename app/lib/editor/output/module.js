import AppModule from '../../app-modules/app-module.js';

export class OutputModule extends AppModule {
    constructor(...args) {
        super(...args);
        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
    }
    _start() {
        this.editor.outputView.start();
    }
    _stop() {
        this.editor.outputView.stop();
    }
}

export default OutputModule;
