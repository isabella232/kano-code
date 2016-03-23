import ObservableProducer from '../observable-producer';
let cat;

const COLOUR = '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")';

export default cat = {
    name: 'Cats',
    colour: COLOUR,
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
    },
    blocks: [{
        block: {
            id: 'get_cat_picture',
            output: true,
            message0: 'random cat picture'
        },
        javascript: () => {
            let code = `cat.random()`;
            return [code];
        },
        natural: () => {
            let code = `a random cat picture`;
            return [code];
        }
    },{
        block: {
            id: 'refresh_cat',
            message0: 'refresh cats',
            previousStatement: null,
            nextStatement: null
        },
        javascript: () => {
            let code = `cat.refresh()`;
            return code;
        },
        natural: () => {
            let code = `refresh cats`;
            return code;
        }
    }]
};
