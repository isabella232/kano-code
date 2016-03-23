import Observable from './observable';

export default class ObservableProducer {
    constructor () {
        this.currentObs = [];
    }
    createObservable (method, args) {
        let observable = new Observable();
        this.currentObs.push({
            method,
            args,
            observable
        });
        return observable;
    }
    refresh () {
        // Loop through the registered
        this.currentObs.forEach((ob) => {
            let result;
            result = ob.method.apply({}, ob.args);

            if (result.then && typeof result.then === 'function') {
                result.then((data) => {
                    ob.observable.update(data);
                });
            } else {
                ob.observable.update(result);
            }
        });
    }
    clear () {
        this.currentObs = [];
    }
}
