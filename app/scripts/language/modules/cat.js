import cats from './cats.json';
let cat;

const COLOUR = '#F29120 url("http://a.deviantart.net/avatars/a/p/appoxity.gif")';

export default cat = {
    name: 'Cats',
    colour: COLOUR,
    methods: {
        random () {
            let index = Math.floor(Math.random() * cats.length);
            return `http://random.cat/i/${cats[index]}`;
        }
    },
    lifecycle: {},
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
    }]
};
