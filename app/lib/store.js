import GlobalStore from './global-store.js';

const Store = {
    create(initState) {
        const store = GlobalStore.create(initState);

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
