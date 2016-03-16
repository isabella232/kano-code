import Observable from '../observable';
import ObservableProducer from '../observable-producer';
let cat;

export default cat = {
    observableProducer: new ObservableProducer(),
    random () {
        return fetch('http://random.cat/meow')
            .then((res) => res.json())
            .then((j) => j.file);
    },
    methods: {
        random () {
            let obs = cat.observableProducer
                .createObservable(cat.random.bind(cat), arguments);
            cat.observableProducer.refresh();
            return obs;
        },
        refresh () {
            cat.observableProducer.refresh();
        }
    },
    lifecycle: {
        stop () {
            cat.observableProducer.clear();
        }
    }
};
