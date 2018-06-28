/* eslint class-methods-use-this: "off" */
export const OutputViewProviderMixin = base => class extends base {
    constructor(editor) {
        super();
        this.editor = editor;
    }
    start() {}
    stop() {}
    renderOnCanvas() {
        return Promise.resolve();
    }
    getRestrictElement() {
        return this;
    }
};

export const OutputViewProvider = OutputViewProviderMixin(class {});

export default OutputViewProvider;
