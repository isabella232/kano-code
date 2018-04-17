/* eslint class-methods-use-this: "off" */
import EventEmitter from '../util/event-emitter.js';

class EditorPlugin extends EventEmitter {
    onInstall() {}
    onModeSet() {}
    onInject() {}
    onAppLoad() {}
    onSave(app) {
        return app;
    }
}

export default EditorPlugin;
