import Store from '../store.js';

const CONSTANTS = ['SET_RUNNING_STATE', 'UPDATE_CODE', 'LOAD_BLOCKS', 'RESET_EDITOR'];
const EDITOR_TYPES = Store.types(CONSTANTS);

const EditorActions = (store) => {
    store.addMutator(function modeActions(action) {
        switch (action.type) {
        case EDITOR_TYPES.SET_RUNNING_STATE: {
            this.set('state.running', action.state);
            break;
        }
        case EDITOR_TYPES.UPDATE_CODE: {
            this.set('state.code', action.code);
            break;
        }
        case EDITOR_TYPES.LOAD_BLOCKS: {
            this.set('state.blocks', action.blocks);
            break;
        }
        case EDITOR_TYPES.RESET_EDITOR: {
            const { mode } = this.get('state');
            this.set('state.blocks', mode.defaultBlocks);
            this.set('state.code', '');
            this.set('state.addedParts', []);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        setRunningState(state) {
            store.dispatch({ type: EDITOR_TYPES.SET_RUNNING_STATE, state });
        },
        updateCode(code) {
            store.dispatch({ type: EDITOR_TYPES.UPDATE_CODE, code });
        },
        loadBlocks(blocks) {
            store.dispatch({ type: EDITOR_TYPES.LOAD_BLOCKS, blocks });
        },
        reset() {
            store.dispatch({ type: EDITOR_TYPES.RESET_EDITOR });
        },
    };
};

export default EditorActions;
