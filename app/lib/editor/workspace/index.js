export const WorkspaceViewProviderMixin = base => class extends base {
    constructor(editor) {
        super();
        this.editor = editor;
    }
    clear() {}
    /* eslint class-methods-use-this: "off" */
    get outputView() {
        return null;
    }
    get partsRoot() {
        return null;
    }
};

export const WorkspaceViewProvider = WorkspaceViewProviderMixin(class {});

export default WorkspaceViewProvider;
