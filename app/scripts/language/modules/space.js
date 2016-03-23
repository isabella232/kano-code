import ObservableProducer from '../observable-producer';
let space;

const COLOUR = '#1f1f1f url("http://i.huffpost.com/gadgets/slideshows/290159/slide_290159_2299290_sq50.jpg")';

export default space = {
    name: 'Space',
    colour: COLOUR,
    observableProducer: new ObservableProducer(),
    issLocation () {
        return fetch('https://api.wheretheiss.at/v1/satellites/25544')
            .then((res) => res.json())
            .then((j) => {
                return {
                    latitude: j.latitude,
                    longitude: j.longitude
                };
            })
            .catch((e) => {
                console.log(e);
            });
    },
    methods: {
        issLocation () {
            let obs = space.observableProducer
                .createObservable(space.issLocation.bind(space), arguments);
            return obs;
        },
        refresh () {
            space.observableProducer.refresh();
        }
    },
    lifecycle: {
        stop () {
            space.observableProducer.clear();
        }
    },
    blocks: [{
        block: {
            id: 'get_iss_location',
            output: true,
            message0: 'ISS location'
        },
        javascript: () => {
            let code = `space.issLocation()`;
            return [code];
        },
        natural: () => {
            let code = `ISS location`;
            return [code];
        }
    },{
        block: {
            id: 'refresh_space',
            message0: 'refresh space',
            previousStatement: null,
            nextStatement: null
        },
        javascript: () => {
            let code = `space.refresh();`;
            return code;
        },
        natural: () => {
            let code = `refresh space`;
            return code;
        }
    }]
};
