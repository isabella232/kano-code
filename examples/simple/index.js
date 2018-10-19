import { Editor, EditorProfile, WorkspaceViewProvider } from '../../index.js';
import { DrawOutputProfile } from './profile.js';

const editor = new Editor();

class DrawWorkspaceProvider extends WorkspaceViewProvider {
    constructor() {
        super();
        this._root = document.createElement('div');
    }
    get root() {
        return this._root;
    }
    get outputViewRoot() {
        return this.root;
    }
}

const DrawToolbox = {
    type: 'module',
    name: 'draw',
    color: '#00796b',
    symbols: [{
        type: 'function',
        name: 'square',
        parameters: [{
            name: 'x',
            returnType: Number,
            default: 0,
        }, {
            name: 'y',
            returnType: Number,
            default: 0,
        }, {
            name: 'width',
            returnType: Number,
            default: 100,
        }, {
            name: 'height',
            returnType: Number,
            default: 100,
        }],
    }],
};

class DrawProfile extends EditorProfile {
    get toolbox() {
        return [DrawToolbox];
    }
    get outputProfile() {
        return new DrawOutputProfile();
    }
    get workspaceViewProvider() {
        return new DrawWorkspaceProvider();
    }
}

editor.registerProfile(new DrawProfile());

editor.inject();

editor.output.setRunningState(true);
