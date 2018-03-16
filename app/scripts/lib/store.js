import FlowDown from '../../bower_components/flow-down/flow-down.js';

const Store = {
    create(config) {
        const store = FlowDown.createStore({
            running: false,
            config,
            addedParts: [],
            workspaceTab: 'workspace',
        });

        // If a store id is declared in the element,
        // it is used as a library and the store is managed by the library API
        const EnhancedBehavior = {
            properties: {
                storeId: Number,
            },
            getStoreId() {
                return this.storeId || store.ReceiverBehavior.getStoreId();
            },
        };

        store.ReceiverBehavior = [store.ReceiverBehavior, EnhancedBehavior];

        const StoreElement = Polymer({
            is: `kc-store-${store.id}`,
            behaviors: [store.ProviderBehavior],
            observers: ['_runningChanged(state.running)'],
            _runningChanged() {
                this.fire('running-changed');
            },
        });

        const storeElement = new StoreElement();

        store.providerElement = storeElement;

        return store;
    },
    types(constants) {
        return Object.freeze(constants.reduce((acc, constant) => {
            acc[constant] = constant;
            return acc;
        }, {}));
    },
};

export default Store;
