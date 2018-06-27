import { WorkspaceViewProvider } from './index.js';
import { DefaultOutputViewProvider } from '../output/default.js';

export class DefaultWorkspaceViewProvider extends WorkspaceViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('div');
        this.output = new DefaultOutputViewProvider(...args);
        this.root.appendChild(this.output.root);
    }
    get outputView() {
        return this.output;
    }
    get partsRoot() {
        return this.root;
    }
}

export default DefaultWorkspaceViewProvider;
