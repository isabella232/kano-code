import Store from '../store.js';

const CONSTANTS = ['UPDATE_PART_LIST', 'ADD_PART', 'REMOVE_PART', 'LOAD_ADDED_PARTS'];
const PARTS_TYPES = Store.types(CONSTANTS);

const PartsActions = (store) => {
    store.addMutator(function partsActions(action) {
        switch (action.type) {
        case PARTS_TYPES.UPDATE_PART_LIST: {
            const mode = this.get('state.mode');
            this.set('state.partsList', action.parts);
            if (mode) {
                const parts = action.parts.filter(part => mode.parts.indexOf(part.type) !== -1);
                this.set('state.parts', parts);
            }
            break;
        }
        case PARTS_TYPES.ADD_PART: {
            this.push('state.addedParts', action.part);
            break;
        }
        case PARTS_TYPES.REMOVE_PART: {
            const { addedParts } = this.get('state');
            const index = addedParts.indexOf(action.part);
            this.splice('state.addedParts', index, 1);
            break;
        }
        case PARTS_TYPES.LOAD_ADDED_PARTS: {
            this.set('state.addedParts', action.parts);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        updatePartsList(parts) {
            store.dispatch({ type: PARTS_TYPES.UPDATE_PART_LIST, parts });
        },
        addPart(part) {
            store.dispatch({ type: PARTS_TYPES.ADD_PART, part });
        },
        removePart(part) {
            store.dispatch({ type: PARTS_TYPES.REMOVE_PART, part });
        },
        loadAddedParts(part) {
            store.dispatch({ type: PARTS_TYPES.LOAD_ADDED_PARTS, part });
        },
    };
};

export default PartsActions;
